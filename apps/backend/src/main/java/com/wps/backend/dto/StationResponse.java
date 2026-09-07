package com.wps.backend.dto;

public record StationResponse(
        String id,
        String name,
        String country,
        String fuelType,
        double capacityMw,
        double latitude,
        double longitude,
        String status
) {
}
