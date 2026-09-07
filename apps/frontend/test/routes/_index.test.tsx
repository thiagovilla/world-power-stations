import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Index from "~/routes/_index";

// Mock Remix's useLoaderData
vi.mock("@remix-run/react", () => ({
  useLoaderData: vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

import { useLoaderData } from "@remix-run/react";

describe("Index Route Component", () => {
  it("renders backend online state and stations list correctly", () => {
    vi.mocked(useLoaderData).mockReturnValue({
      backendUrl: "http://localhost:8080",
      backendConnected: true,
      helloData: {
        message: "Hello from World Power Stations (WPS) Backend API!",
        app: "World Power Stations",
        version: "0.0.1-SNAPSHOT",
        status: "UP",
        timestamp: "2026-09-07T15:00:00Z",
      },
      stations: [
        {
          id: "1",
          name: "Three Gorges Dam",
          country: "China",
          fuelType: "HYDRO",
          capacityMw: 22500,
          latitude: 30.823,
          longitude: 111.003,
          status: "ACTIVE",
        },
      ],
    });

    render(<Index />);

    expect(screen.getByText("World Power Stations (WPS)")).toBeInTheDocument();
    expect(screen.getByText("ONLINE")).toBeInTheDocument();
    expect(screen.getByText(/Hello from World Power Stations/)).toBeInTheDocument();
    expect(screen.getByText("Three Gorges Dam")).toBeInTheDocument();
    expect(screen.getByText("HYDRO")).toBeInTheDocument();
    expect(screen.getByText(/22,500 MW/)).toBeInTheDocument();
  });

  it("renders offline error message when backend connection fails", () => {
    vi.mocked(useLoaderData).mockReturnValue({
      backendUrl: "http://localhost:8080",
      backendConnected: false,
      helloData: null,
      stations: [],
      errorMessage: "Network error connection refused",
    });

    render(<Index />);

    expect(screen.getByText("OFFLINE")).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to Spring Boot API/)).toBeInTheDocument();
  });
});
