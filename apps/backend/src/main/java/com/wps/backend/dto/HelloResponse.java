package com.wps.backend.dto;

import java.time.Instant;

public record HelloResponse(
        String message,
        String app,
        String version,
        String status,
        Instant timestamp
) {
}
