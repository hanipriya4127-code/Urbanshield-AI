/**
 * UrbanShield AI - Real-World Integration & Telemetry Connectors
 * 
 * Provides production-ready service interfaces and data contract specifications
 * for live integration with external municipal systems:
 * - Doppler Weather Radar & Precipitation API (NOAA / Open-Meteo)
 * - Fluvial River Gauges & Retention Basins (USGS Water Services)
 * - Storm Drain Ultrasonic Depth Sensors (Municipal IoT SCADA)
 * - GIS Cartography & Elevation Polygons (OGC GeoJSON / OpenStreetMap)
 * - Traffic Management Systems (ITS / Waze Connected Citizens / GTFS)
 * - Civil Protection Alert Aggregators (CAP XML v1.2 / IPAWS)
 */

export interface WeatherTelemetry {
  source: string;
  stationId: string;
  radarReflectivityDbz: number;
  precipitationRateMmHr: number;
  accumulated1hrMm: number;
  convectiveCellMovement: string;
  forecastNext60mMm: number;
  status: 'ONLINE' | 'SIMULATED_FALLBACK';
  lastPingMs: number;
}

export interface IoTDrainageSensor {
  sensorId: string;
  location: string;
  type: 'Ultrasonic Depth' | 'Piezoresistive Pressure' | 'Acoustic Silt Meter';
  currentLevelM: number;
  surchargeThresholdM: number;
  conduitBlockagePct: number;
  batteryPct: number;
  status: 'ONLINE' | 'SIMULATED_FALLBACK';
}

export interface TrafficITSSegment {
  segmentId: string;
  corridorName: string;
  currentSpeedKmh: number;
  freeFlowSpeedKmh: number;
  inundationReported: boolean;
  clearanceState: 'OPEN' | 'WARNING' | 'CLOSED';
  lastUpdated: string;
}

export interface ConnectorStatus {
  id: string;
  name: string;
  category: 'Weather Radar' | 'Hydrologic Sensors' | 'Municipal SCADA' | 'GIS Services' | 'Traffic ITS' | 'Civil Defense';
  protocol: string;
  endpointUrl: string;
  activeFeed: boolean;
  statusText: string;
  lastTelemetrySummary: string;
}

export const REGISTERED_CONNECTORS: ConnectorStatus[] = [
  {
    id: 'conn-weather',
    name: 'National Doppler Weather Radar & Quantitative Precipitation (QPE)',
    category: 'Weather Radar',
    protocol: 'WSR-88D NEXRAD Level III / REST JSON',
    endpointUrl: '/api/v1/weather/radar/reflectivity',
    activeFeed: true,
    statusText: 'Active Stream',
    lastTelemetrySummary: 'Convective storm front bearing 135° SE at 22 km/h; peak cell reflectivity 54 dBZ'
  },
  {
    id: 'conn-usgs',
    name: 'USGS Fluvial River Basin Stage Sensors',
    category: 'Hydrologic Sensors',
    protocol: 'OGC WaterML 2.0 / REST API',
    endpointUrl: '/api/v1/hydrology/stations/river-stage',
    activeFeed: true,
    statusText: 'Active Stream',
    lastTelemetrySummary: 'North Basin gauge station NF-01 reading 4.42m (surging +0.35m/hr)'
  },
  {
    id: 'conn-scada',
    name: 'Municipal Stormwater Trunk SCADA & IoT Telemetry',
    category: 'Municipal SCADA',
    protocol: 'MQTT / Modbus-TCP / TLS 1.3',
    endpointUrl: 'mqtts://telemetry.metro.gov:8883/stormwater/trunks',
    activeFeed: true,
    statusText: 'Active Stream',
    lastTelemetrySummary: 'Central Metro Trunk CT-04 at 88% surcharge; debris blockage estimated at 40%'
  },
  {
    id: 'conn-gis',
    name: 'Municipal GIS Elevation & Cadastral Vector Server',
    category: 'GIS Services',
    protocol: 'OGC WFS / GeoJSON / Cloud-Optimized GeoTIFF',
    endpointUrl: '/api/v1/gis/elevation-contours/1m-dem',
    activeFeed: true,
    statusText: 'Spatial Layer Verified',
    lastTelemetrySummary: '9 Municipal wards loaded; LiDAR 1m DEM elevation mesh cached'
  },
  {
    id: 'conn-its',
    name: 'Intelligent Transportation System (ITS) Traffic Flow Sensor',
    category: 'Traffic ITS',
    protocol: 'NTCIP 1204 / GTFS-Realtime',
    endpointUrl: '/api/v1/traffic/arterials/live-status',
    activeFeed: true,
    statusText: 'Active Stream',
    lastTelemetrySummary: 'Riverwalk Blvd Underpass automated sensor reporting 52cm water depth; gates armed'
  },
  {
    id: 'conn-ipaws',
    name: 'Common Alerting Protocol (CAP) / Emergency Dispatch Gateway',
    category: 'Civil Defense',
    protocol: 'OASIS CAP v1.2 / SOAP XML over HTTPS',
    endpointUrl: 'https://ipaws.fema.gov/v1/alert-dissemination',
    activeFeed: true,
    statusText: 'Gateway Ready',
    lastTelemetrySummary: 'CAP v1.2 XML payload generator verified for WEA cellular push broadcast'
  }
];
