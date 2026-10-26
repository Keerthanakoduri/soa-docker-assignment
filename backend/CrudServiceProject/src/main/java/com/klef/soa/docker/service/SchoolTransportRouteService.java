
package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.entity.SchoolTransportRoute;

public interface SchoolTransportRouteService {

    SchoolTransportRoute addSchoolTransportRoute(
            SchoolTransportRoute route);

    List<SchoolTransportRoute> displayAllSchoolTransportRoutes();

    SchoolTransportRoute displaySchoolTransportRouteById(Long id);


    SchoolTransportRoute updateSchoolTransportRoute(
            Long id, SchoolTransportRoute route);

    String deleteSchoolTransportRoute(Long id);
}
