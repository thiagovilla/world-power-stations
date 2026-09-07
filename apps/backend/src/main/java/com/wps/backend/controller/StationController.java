package com.wps.backend.controller;

import com.wps.backend.dto.StationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private static final List<StationResponse> SAMPLE_STATIONS = List.of(
            new StationResponse("1", "Three Gorges Dam", "China", "HYDRO", 22500, 30.823, 111.003, "ACTIVE"),
            new StationResponse("2", "Kashiwazaki-Kariwa", "Japan", "NUCLEAR", 7965, 37.427, 138.599, "ACTIVE"),
            new StationResponse("3", "Bhadla Solar Park", "India", "SOLAR", 2245, 27.539, 71.915, "ACTIVE"),
            new StationResponse("4", "Hornsea Wind Farm", "United Kingdom", "WIND", 2600, 53.883, 1.783, "ACTIVE"),
            new StationResponse("5", "Bath County Pumped Storage", "United States", "STORAGE", 3003, 38.212, -79.801, "ACTIVE"),
            new StationResponse("6", "The Geysers", "United States", "GEOTHERMAL", 1517, 38.798, -122.754, "ACTIVE")
    );

    @GetMapping
    public ResponseEntity<List<StationResponse>> getStations() {
        return ResponseEntity.ok(SAMPLE_STATIONS);
    }
}
