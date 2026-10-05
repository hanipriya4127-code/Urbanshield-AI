import { CriticalFacility, RoadSegment, SensorStation, ZoneRisk } from '../types';

export const INITIAL_ZONES: ZoneRisk[] = [
  {
    id: 'zone-1',
    name: 'North River Basin',
    category: 'Riverbank',
    elevationMeters: 4.2,
    basePopulation: 28400,
    riskScore: 35,
    riskLevel: 'MODERATE',
    predictedDepthCm: 15,
    flowDirection: 'SE',
    polygon: [
      [80, 40], [320, 30], [360, 150], [220, 200], [70, 160]
    ]
  },
  {
    id: 'zone-2',
    name: 'Downtown Commercial Core',
    category: 'Commercial',
    elevationMeters: 8.5,
    basePopulation: 45200,
    riskScore: 22,
    riskLevel: 'LOW',
    predictedDepthCm: 5,
    flowDirection: 'S',
    polygon: [
      [360, 150], [560, 130], [580, 270], [380, 290], [360, 150]
    ]
  },
  {
    id: 'zone-3',
    name: 'East Estuary Lowlands',
    category: 'Lowland',
    elevationMeters: 2.1,
    basePopulation: 34100,
    riskScore: 68,
    riskLevel: 'HIGH',
    predictedDepthCm: 45,
    flowDirection: 'SE',
    polygon: [
      [560, 130], [760, 120], [770, 310], [580, 270]
    ]
  },
  {
    id: 'zone-4',
    name: 'Central Metro Transit Hub',
    category: 'Commercial',
    elevationMeters: 5.8,
    basePopulation: 51800,
    riskScore: 40,
    riskLevel: 'MODERATE',
    predictedDepthCm: 22,
    flowDirection: 'S',
    polygon: [
      [220, 200], [380, 290], [360, 420], [180, 380]
    ]
  },
  {
    id: 'zone-5',
    name: 'Riverside Industrial District',
    category: 'Industrial',
    elevationMeters: 3.4,
    basePopulation: 19600,
    riskScore: 62,
    riskLevel: 'HIGH',
    predictedDepthCm: 40,
    flowDirection: 'SE',
    polygon: [
      [380, 290], [580, 270], [590, 430], [360, 420]
    ]
  },
  {
    id: 'zone-6',
    name: 'South Bay Marina & Wetlands',
    category: 'Lowland',
    elevationMeters: 1.8,
    basePopulation: 22900,
    riskScore: 78,
    riskLevel: 'CRITICAL',
    predictedDepthCm: 65,
    flowDirection: 'S',
    polygon: [
      [580, 270], [770, 310], [760, 520], [590, 430]
    ]
  },
  {
    id: 'zone-7',
    name: 'West Foothills & Uplands',
    category: 'Upland',
    elevationMeters: 18.6,
    basePopulation: 31200,
    riskScore: 12,
    riskLevel: 'LOW',
    predictedDepthCm: 0,
    flowDirection: 'E',
    polygon: [
      [50, 210], [220, 200], [180, 380], [40, 420]
    ]
  },
  {
    id: 'zone-8',
    name: 'South Valley Residential Quarter',
    category: 'Residential',
    elevationMeters: 4.9,
    basePopulation: 62000,
    riskScore: 48,
    riskLevel: 'MODERATE',
    predictedDepthCm: 28,
    flowDirection: 'SW',
    polygon: [
      [180, 380], [360, 420], [340, 560], [150, 540]
    ]
  },
  {
    id: 'zone-9',
    name: 'Harbor Gate Cargo Terminals',
    category: 'Industrial',
    elevationMeters: 2.6,
    basePopulation: 14500,
    riskScore: 72,
    riskLevel: 'CRITICAL',
    predictedDepthCm: 58,
    flowDirection: 'S',
    polygon: [
      [360, 420], [590, 430], [570, 570], [340, 560]
    ]
  }
];

export const INITIAL_ROADS: RoadSegment[] = [
  // Primary Arterials & Expressways
  {
    id: 'road-h1',
    name: 'Interstate 80 Corridor (Upland Highway)',
    type: 'Highway',
    points: [[50, 90], [220, 110], [420, 90], [640, 75], [770, 70]],
    elevationMeters: 12.0,
    status: 'Passable',
    waterDepthCm: 0,
    trafficVolume: 'Heavy',
    isSafeEvacuationRoute: true
  },
  {
    id: 'road-h2',
    name: 'Harbor Parkway Express (Coastal Arterial)',
    type: 'Highway',
    points: [[600, 100], [630, 260], [650, 410], [670, 560]],
    elevationMeters: 2.8,
    status: 'High Risk',
    waterDepthCm: 38,
    trafficVolume: 'Medium',
    isSafeEvacuationRoute: false
  },
  {
    id: 'road-a1',
    name: 'Central Grand Avenue',
    type: 'Arterial',
    points: [[120, 240], [280, 270], [440, 280], [580, 260]],
    elevationMeters: 6.5,
    status: 'Passable',
    waterDepthCm: 8,
    trafficVolume: 'Heavy',
    isSafeEvacuationRoute: true
  },
  {
    id: 'road-a2',
    name: 'Riverwalk Boulevard & Underpass',
    type: 'Arterial',
    points: [[260, 80], [310, 210], [350, 340], [390, 520]],
    elevationMeters: 3.2,
    status: 'Blocked',
    waterDepthCm: 52,
    trafficVolume: 'Low',
    isSafeEvacuationRoute: false
  },
  {
    id: 'road-a3',
    name: 'South Valley Orbital (Evacuation Bypass)',
    type: 'Arterial',
    points: [[80, 390], [220, 420], [360, 480], [520, 490]],
    elevationMeters: 7.2,
    status: 'Passable',
    waterDepthCm: 6,
    trafficVolume: 'Medium',
    isSafeEvacuationRoute: true
  },
  {
    id: 'road-b1',
    name: 'North Delta Suspension Bridge',
    type: 'Bridge',
    points: [[310, 160], [380, 160]],
    elevationMeters: 9.8,
    status: 'Passable',
    waterDepthCm: 0,
    trafficVolume: 'Medium',
    isSafeEvacuationRoute: true
  },
  {
    id: 'road-b2',
    name: 'Industrial Causeways Bridge',
    type: 'Bridge',
    points: [[340, 360], [420, 360]],
    elevationMeters: 4.1,
    status: 'High Risk',
    waterDepthCm: 32,
    trafficVolume: 'Low',
    isSafeEvacuationRoute: false
  },
  {
    id: 'road-l1',
    name: 'Market Row & Station Lane',
    type: 'Local',
    points: [[240, 260], [290, 330], [260, 380]],
    elevationMeters: 5.0,
    status: 'Caution',
    waterDepthCm: 18,
    trafficVolume: 'Medium',
    isSafeEvacuationRoute: false
  },
  {
    id: 'road-l2',
    name: 'Lowland Wharf Approach Road',
    type: 'Local',
    points: [[660, 320], [720, 390], [710, 480]],
    elevationMeters: 1.9,
    status: 'Blocked',
    waterDepthCm: 64,
    trafficVolume: 'Low',
    isSafeEvacuationRoute: false
  },
  {
    id: 'road-l3',
    name: 'Foothills Ridge Parkway',
    type: 'Local',
    points: [[90, 140], [110, 300], [130, 460]],
    elevationMeters: 16.5,
    status: 'Passable',
    waterDepthCm: 0,
    trafficVolume: 'Low',
    isSafeEvacuationRoute: true
  },
  {
    id: 'road-l4',
    name: 'Cargo Marshaling Feeder Road',
    type: 'Local',
    points: [[410, 460], [480, 510], [560, 540]],
    elevationMeters: 2.3,
    status: 'Blocked',
    waterDepthCm: 56,
    trafficVolume: 'Low',
    isSafeEvacuationRoute: false
  }
];

export const INITIAL_FACILITIES: CriticalFacility[] = [
  {
    id: 'fac-h1',
    name: 'Metropolitan General Hospital & Trauma Center',
    type: 'Hospital',
    coordinates: [140, 290],
    elevationMeters: 14.2,
    zoneId: 'zone-7',
    status: 'Operational',
    inundationDepthCm: 0,
    backupPower: 'Active',
    capacity: '850 Beds / Level 1 Trauma',
    contact: '+1 (555) 019-4401'
  },
  {
    id: 'fac-h2',
    name: 'St. Jude Riverside Health Center',
    type: 'Hospital',
    coordinates: [370, 250],
    elevationMeters: 4.8,
    zoneId: 'zone-2',
    status: 'Alert',
    inundationDepthCm: 14,
    backupPower: 'Active',
    capacity: '240 Beds / Clinic',
    contact: '+1 (555) 019-4402'
  },
  {
    id: 'fac-h3',
    name: 'East Bay Community Hospital',
    type: 'Hospital',
    coordinates: [680, 240],
    elevationMeters: 2.4,
    zoneId: 'zone-3',
    status: 'At Risk',
    inundationDepthCm: 48,
    backupPower: 'Vulnerable',
    capacity: '180 Beds / Primary Care',
    contact: '+1 (555) 019-4403'
  },
  {
    id: 'fac-f1',
    name: 'Central Fire & Rescue Station #1',
    type: 'Fire Station',
    coordinates: [280, 240],
    elevationMeters: 6.8,
    zoneId: 'zone-4',
    status: 'Operational',
    inundationDepthCm: 2,
    backupPower: 'Active',
    capacity: '8 Engine Units / 2 Rescue Boats',
    contact: '+1 (555) 019-9111'
  },
  {
    id: 'fac-f2',
    name: 'Harbor Marine Fire Rescue Station #7',
    type: 'Fire Station',
    coordinates: [630, 390],
    elevationMeters: 2.1,
    zoneId: 'zone-6',
    status: 'Compromised',
    inundationDepthCm: 58,
    backupPower: 'Offline',
    capacity: '4 Watercraft / Rapid Dive Unit',
    contact: '+1 (555) 019-9117'
  },
  {
    id: 'fac-f3',
    name: 'West Ridge Emergency Station #4',
    type: 'Fire Station',
    coordinates: [100, 180],
    elevationMeters: 17.5,
    zoneId: 'zone-7',
    status: 'Operational',
    inundationDepthCm: 0,
    backupPower: 'Active',
    capacity: '6 Engine Units / High-Ground Staging',
    contact: '+1 (555) 019-9114'
  },
  {
    id: 'fac-p1',
    name: 'Downtown Police Precinct Headquarters',
    type: 'Police Station',
    coordinates: [460, 200],
    elevationMeters: 7.9,
    zoneId: 'zone-2',
    status: 'Operational',
    inundationDepthCm: 4,
    backupPower: 'Active',
    capacity: 'Command & Dispatch Ops',
    contact: '+1 (555) 019-3310'
  },
  {
    id: 'fac-p2',
    name: 'Port Authority Security Post',
    type: 'Police Station',
    coordinates: [520, 520],
    elevationMeters: 2.5,
    zoneId: 'zone-9',
    status: 'At Risk',
    inundationDepthCm: 42,
    backupPower: 'Vulnerable',
    capacity: 'Perimeter Patrol Units',
    contact: '+1 (555) 019-3315'
  },
  {
    id: 'fac-s1',
    name: 'Lincoln Heights Regional High School (Shelter A)',
    type: 'School',
    coordinates: [130, 440],
    elevationMeters: 11.2,
    zoneId: 'zone-7',
    status: 'Operational',
    inundationDepthCm: 0,
    backupPower: 'Active',
    capacity: 'Designated Shelter: 1,800 capacity',
    contact: '+1 (555) 019-7701'
  },
  {
    id: 'fac-s2',
    name: 'Riverside Elementary School (Shelter B)',
    type: 'School',
    coordinates: [330, 360],
    elevationMeters: 4.5,
    zoneId: 'zone-4',
    status: 'Alert',
    inundationDepthCm: 22,
    backupPower: 'Active',
    capacity: 'Designated Shelter: 600 capacity',
    contact: '+1 (555) 019-7702'
  },
  {
    id: 'fac-s3',
    name: 'Southgate Technical Academy',
    type: 'School',
    coordinates: [260, 510],
    elevationMeters: 4.8,
    zoneId: 'zone-8',
    status: 'Alert',
    inundationDepthCm: 26,
    backupPower: 'Active',
    capacity: 'Designated Shelter: 950 capacity',
    contact: '+1 (555) 019-7703'
  },
  {
    id: 'fac-s4',
    name: 'Delta Shore Elementary',
    type: 'School',
    coordinates: [710, 340],
    elevationMeters: 1.9,
    zoneId: 'zone-3',
    status: 'Compromised',
    inundationDepthCm: 62,
    backupPower: 'Offline',
    capacity: 'Closed / Evacuated',
    contact: '+1 (555) 019-7704'
  }
];

export const INITIAL_SENSORS: SensorStation[] = [
  {
    id: 'sensor-1',
    name: 'North Fluvial Gauge NF-01',
    type: 'River Gauge',
    coordinates: [290, 90],
    currentLevelMeters: 3.8,
    warningLevelMeters: 4.2,
    dangerLevelMeters: 5.0,
    trend: 'rising'
  },
  {
    id: 'sensor-2',
    name: 'Central Storm Trunk CT-04',
    type: 'Storm Drain',
    coordinates: [340, 280],
    currentLevelMeters: 2.9,
    warningLevelMeters: 2.5,
    dangerLevelMeters: 3.2,
    trend: 'surging'
  },
  {
    id: 'sensor-3',
    name: 'Riverwalk Underpass Ultrasonic US-02',
    type: 'Underpass Sensor',
    coordinates: [350, 340],
    currentLevelMeters: 1.45,
    warningLevelMeters: 0.6,
    dangerLevelMeters: 1.1,
    trend: 'surging'
  },
  {
    id: 'sensor-4',
    name: 'Harbor Gate Tidal Station HG-09',
    type: 'Retention Basin',
    coordinates: [650, 420],
    currentLevelMeters: 2.4,
    warningLevelMeters: 2.2,
    dangerLevelMeters: 2.8,
    trend: 'rising'
  }
];
