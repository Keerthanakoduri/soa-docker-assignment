import {useCallback,useEffect,useMemo,useState} from 'react';
import {Bus,Search,Plus,RefreshCw,Pencil,Trash2,X,Check,Users,Route as RouteIcon,CircleCheck,CircleX,AlertCircle,LayoutDashboard} from 'lucide-react';

const API='/Schooltransportroute';
const blank={routeName:'',driverName:'',studentCount:'0',active:true};
async function api(path,options={}) {
 const r=await fetch(API+path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
 const t=await r.text(); let d=null; if(t){try{d=JSON.parse(t)}catch{d=t}}
 if(!r.ok) throw new Error(typeof d==='string'?d:(d?.message||d?.error||`Request failed (${r.status})`));
 return d;
}
function Stat({title,value,sub,icon:Icon,tone}){return <div className="stat"><div className={'staticon '+tone}><Icon size={20}/></div><div><span>{title}</span><strong>{value}</strong><small>{sub}</small></div></div>}
function RouteForm({route,onClose,onSave,saving}) {
 const [form,setForm]=useState(route||blank),[error,setError]=useState('');
 const set=(k,v)=>setForm(p=>({...p,[k]:v}));
 async function submit(e){e.preventDefault();setError('');if(!form.routeName.trim()||!form.driverName.trim()){setError('Enter both route and driver names.');return}
 const n=Number(form.studentCount);if(!Number.isInteger(n)||n<0){setError('Student count must be a non-negative whole number.');return}
 try{await onSave({routeName:form.routeName.trim(),driverName:form.driverName.trim(),studentCount:n,active:!!form.active})}catch(e){setError(e.message)}}
 return <div className="shade" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}>
 <div className="modalhead"><div><small>{route?.id?'UPDATE RECORD':'NEW RECORD'}</small><h2>{route?.id?'Edit route':'Add transport route'}</h2><p>Enter the school transport details.</p></div><button type="button" className="iconbtn" onClick={onClose}><X/></button></div>
 <label>Route name<input maxLength="100" autoFocus value={form.routeName} onChange={e=>set('routeName',e.target.value)} placeholder="e.g. Route 01 — City Centre" required/></label>
 <label>Driver name<input maxLength="100" value={form.driverName} onChange={e=>set('driverName',e.target.value)} placeholder="Enter driver full name" required/></label>
 <label>Student count<input type="number" min="0" step="1" value={form.studentCount} onChange={e=>set('studentCount',e.target.value)} required/></label>
 <div className="switchrow"><div><b>Route status</b><small>Is this route currently operational?</small></div><button type="button" className={'switch '+(form.active?'on':'')} onClick={()=>set('active',!form.active)} aria-checked={form.active} role="switch"><i/></button><b>{form.active?'Active':'Inactive'}</b></div>
 {error&&<div className="error"><AlertCircle size={16}/>{error}</div>}
 <div className="modalactions"><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary" disabled={saving}>{saving?'Saving…':<><Check size={16}/>{route?.id?'Save changes':'Create route'}</>}</button></div>
 </form></div>
}
export default function App(){
 const [routes,setRoutes]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[modal,setModal]=useState(null),[saving,setSaving]=useState(false),[toast,setToast]=useState('');
 const load=useCallback(async()=>{setLoading(true);setError('');try{const d=await api('/displayall');setRoutes(Array.isArray(d)?d:[])}catch(e){setError(`${e.message}. Ensure the backend is running on port 8081.`)}finally{setLoading(false)}},[]);
 useEffect(()=>{load()},[load]);
 const active=routes.filter(r=>r.active===true||r.active==='true').length;
 const students=routes.reduce((s,r)=>s+(Number(r.studentCount)||0),0);
 const shown=useMemo(()=>routes.filter(r=>{const a=r.active===true||r.active==='true';const term=query.toLowerCase().trim();return(filter==='all'||(filter==='active'?a:!a))&&(!term||[r.routeName,r.driverName,String(r.id)].some(x=>String(x??'').toLowerCase().includes(term)))}),[routes,query,filter]);
 function notify(t){setToast(t);setTimeout(()=>setToast(''),3000)}
 async function save(payload){setSaving(true);try{if(modal?.id){await api(`/updateRoute/${modal.id}`,{method:'PUT',body:JSON.stringify(payload)});notify('Route updated successfully.')}else{await api('/addRoute',{method:'POST',body:JSON.stringify(payload)});notify('Route created successfully.')}setModal(null);await load()}finally{setSaving(false)}}
 async function edit(r){try{const d=await api(`/displayById/${r.id}`);setModal({...d,studentCount:String(d.studentCount??0)})}catch{setModal({...r,studentCount:String(r.studentCount??0)})}}
 async function remove(r){if(!confirm(`Delete route "${r.routeName}"?`))return;try{await api(`/deleteById/${r.id}`,{method:'DELETE'});notify('Route deleted successfully.');await load()}catch(e){notify('Delete failed: '+e.message)}}
 return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brandicon"><Bus/></div><div><b>RoutePilot</b><small>SCHOOL TRANSPORT</small></div></div><div className="navlabel">WORKSPACE</div><div className="nav active"><LayoutDashboard size={18}/> Overview <span>●</span></div><div className="sidecard"><RouteIcon/><b>Every route, in control.</b><p>Manage your school transport operations from one place.</p></div><div className="sidebottom"><i/> Route management system <small>v1.0</small></div></aside>
 <main><header className="topbar"><div>Workspace <span>/</span> <b>Overview</b></div><div className="system"><i/> System dashboard <strong>ST</strong></div></header><div className="content">
 <section className="intro"><div><small className="kicker">TRANSPORT OPERATIONS</small><h1>School transport <em>overview</em></h1><p>Monitor routes, manage drivers, and keep every journey organized.</p></div><button className="btn primary" onClick={()=>setModal({...blank})}><Plus size={18}/> Add new route</button></section>
 <section className="stats"><Stat title="Total routes" value={routes.length} sub="Routes in your system" icon={RouteIcon} tone="blue"/><Stat title="Active routes" value={active} sub="Currently operational" icon={CircleCheck} tone="green"/><Stat title="Students assigned" value={students.toLocaleString()} sub="Across all routes" icon={Users} tone="purple"/><Stat title="Inactive routes" value={routes.length-active} sub="Not currently active" icon={CircleX} tone="amber"/></section>
 <section className="panel"><div className="panelhead"><div><h2>Transport routes</h2><p>View and manage all registered school routes.</p></div><button className="btn secondary" onClick={load} disabled={loading}><RefreshCw size={15}/> Refresh</button></div>
 <div className="tools"><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search route, driver or ID…"/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All routes</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></div>
 {error&&<div className="errorbanner"><AlertCircle/><div><b>Couldn't load routes</b><p>{error}</p><button onClick={load}>Try again</button></div></div>}
 <div className="tablewrap"><table><thead><tr><th>ROUTE</th><th>DRIVER</th><th>STUDENTS</th><th>STATUS</th><th className="right">ACTIONS</th></tr></thead><tbody>
 {loading&&<tr><td colSpan="5" className="state">Loading routes…</td></tr>}
 {!loading&&!error&&shown.length===0&&<tr><td colSpan="5"><div className="empty"><Bus size={28}/><b>{routes.length?'No matching routes':'Your route list is empty'}</b><p>{routes.length?'Try changing your search or filter.':'Add your first school transport route to get started.'}</p>{!routes.length&&<button className="btn primary" onClick={()=>setModal({...blank})}><Plus size={16}/> Add first route</button>}</div></td></tr>}
 {!loading&&shown.map(r=>{const on=r.active===true||r.active==='true';return <tr key={r.id}><td><div className="routecell"><div className="busbox"><Bus size={18}/></div><div><b>{r.routeName||'Unnamed route'}</b><small>Route ID: {r.id}</small></div></div></td><td>{r.driverName||'—'}</td><td><b>{Number(r.studentCount)||0}</b><small className="muted"> students</small></td><td><span className={'badge '+(on?'yes':'no')}><i/>{on?'Active':'Inactive'}</span></td><td><div className="actions"><button className="iconbtn edit" title="Edit" onClick={()=>edit(r)}><Pencil size={16}/></button><button className="iconbtn delete" title="Delete" onClick={()=>remove(r)}><Trash2 size={16}/></button></div></td></tr>})}
 </tbody></table></div><div className="tablefoot"><span>Showing <b>{loading?'—':shown.length}</b> of <b>{routes.length}</b> routes</span><span><i/> Live from backend</span></div></section>
 <footer>RoutePilot · School Transport Route Management <span>Built for safer, more organized journeys.</span></footer></div></main>
 {modal&&<RouteForm route={modal} onClose={()=>setModal(null)} onSave={save} saving={saving}/>}
 {toast&&<div className="toast"><Check size={17}/>{toast}</div>}</div>
}