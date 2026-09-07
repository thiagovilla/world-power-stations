package com.wps.backend.controller;

import com.wps.backend.dto.HelloResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public ResponseEntity<HelloResponse> getHello() {
        HelloResponse response = new HelloResponse(
                "Hello from World Power Stations (WPS) Backend API!",
                "World Power Stations",
                "0.0.1-SNAPSHOT",
                "UP",
                Instant.now()
        );
        return ResponseEntity.ok(response);
    }
}
