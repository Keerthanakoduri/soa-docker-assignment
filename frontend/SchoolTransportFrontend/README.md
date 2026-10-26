# School Transport Route Management Frontend

React + Vite frontend for the Spring Boot CRUD backend.

## Run
1. Install Node.js (LTS).
2. Extract the ZIP and open a terminal inside `SchoolTransportFrontend`.
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:5173`.

Keep the Spring Boot backend running on `http://localhost:8081`.
Vite proxies `/Schooltransportroute` requests to the backend.

Expected API endpoints:
- GET `/Schooltransportroute/displayall`
- POST `/Schooltransportroute/addRoute`
- GET `/Schooltransportroute/displayById/{id}`
- PUT `/Schooltransportroute/updateRoute/{id}`
- DELETE `/Schooltransportroute/deleteById/{id}`

Expected fields: `id`, `routeName`, `driverName`, `studentCount`, `active`.
