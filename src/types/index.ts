export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type WaterLevelState = 'Normal' | 'Rising' | 'High' | 'Critical';

export type TimelineStep = 'NOW' | '15m' | '30m' | '45m' | '60m' | '120m';

export interface SimulationParams {
  rainfall: 20 | 50 | 80 | 120 | 160; // mm
  drainageBlockage: 0 | 20 | 40 | 60; // %
  waterLevel: WaterLevelState;
  duration: 15 | 30 | 60 | 120; // minutes
}

export interface ZoneRisk {
  id: string;
  name: string;
  category: 'Commercial' | 'Residential' | 'Industrial' | 'Riverbank' | 'Lowland' | 'Upland';
  elevationMeters: number;
  basePopulation: number;
  riskScore: number;
  riskLevel: RiskLevel;
  predictedDepthCm: number;
  flowDirection: 'NE' | 'NW' | 'SE' | 'SW' | 'S' | 'E';
  polygon: [number, number][]; // normalized SVG coordinates [x, y] 0-1000
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'Highway' | 'Arterial' | 'Local' | 'Bridge';
  points: [number, number][];
  elevationMeters: number;
  status: 'Passable' | 'Caution' | 'High Risk' | 'Blocked';
  waterDepthCm: number;
  trafficVolume: 'Low' | 'Medium' | 'Heavy';
  isSafeEvacuationRoute?: boolean;
}

export type FacilityType = 'Hospital' | 'School' | 'Fire Station' | 'Police Station';

export interface CriticalFacility {
  id: string;
  name: string;
  type: FacilityType;
  coordinates: [number, number];
  elevationMeters: number;
  zoneId: string;
  status: 'Operational' | 'Alert' | 'At Risk' | 'Compromised';
  inundationDepthCm: number;
  backupPower: 'Active' | 'Vulnerable' | 'Offline';
  capacity: string;
  contact: string;
}

export interface SensorStation {
  id: string;
  name: string;
  type: 'River Gauge' | 'Storm Drain' | 'Underpass Sensor' | 'Retention Basin';
  coordinates: [number, number];
  currentLevelMeters: number;
  warningLevelMeters: number;
  dangerLevelMeters: number;
  trend: 'stable' | 'rising' | 'surging' | 'falling';
}

export interface ActiveAlert {
  id: string;
  title: string;
  severity: RiskLevel;
  type: 'Flash Flood' | 'Drainage Overflow' | 'Road Inundation' | 'Facility Threat' | 'River Crest';
  affectedArea: string;
  issuedAt: string;
  expiresInMinutes: number;
  instruction: string;
  isSimulated: boolean;
  timeLabel?: string;
  recommendedAction?: string;
}

// 2. Flood Chain Reaction Node
export interface ChainReactionNode {
  id: string;
  stage:
    | 'Heavy Rain'
    | 'Drainage Overload'
    | 'Water Accumulation'
    | 'Road Risk'
    | 'Traffic Disruption'
    | 'Critical Facility Accessibility Risk'
    | 'Emergency Response Recommendation';
  status: 'Nominal' | 'Strained' | 'Severe' | 'Critical';
  metric: string;
  description: string;
  recommendedAction: string;
}

// 3. Predicted Impact Timeline Event
export interface PredictedTimelineEvent {
  id: string;
  timeLabel: '15 MIN' | '30 MIN' | '45 MIN' | '60 MIN';
  minutes: 15 | 30 | 45 | 60;
  title: string;
  description: string;
  severity: RiskLevel;
  location: string;
  category: 'Water Accumulation' | 'Road Risk' | 'Road Closure' | 'Facility Accessibility';
}

// 4. Critical Facility Decision Support Detail
export interface FacilityDecisionSupport {
  facilityId: string;
  name: string;
  type: FacilityType;
  currentRisk: RiskLevel;
  predictedRisk: RiskLevel;
  accessibility: 'Direct Access Clear' | 'Restricted / Caution' | 'Severe Detour Required' | 'Cut Off / Inaccessible';
  priority: 'Priority 1 — Critical' | 'Priority 2 — High' | 'Priority 3 — Moderate' | 'Priority 4 — Stable';
  recommendedAction: string;
  elevationMeters: number;
  inundationDepthCm: number;
  contact: string;
  capacity: string;
}

// 5. Dynamic Safe Route States
export interface RouteStateOption {
  id: 'CURRENT_SHORTEST' | 'PREDICTED_RISK' | 'RECOMMENDED_SAFE';
  label: 'CURRENT SHORTEST ROUTE' | 'PREDICTED-RISK ROUTE' | 'RECOMMENDED SAFE ROUTE';
  pathPoints: [number, number][];
  distanceKm: number;
  estimatedMinutes: number;
  riskExposure: RiskLevel;
  statusBadge: string;
  description: string;
}

export interface DynamicRouteAnalysis {
  origin: string;
  destination: string;
  routes: {
    currentShortest: RouteStateOption;
    predictedRisk: RouteStateOption;
    recommendedSafe: RouteStateOption;
  };
  rerouteReason: string;
}

// 7. AI Insight Model
export interface AIInsightData {
  summary: string;
  mainRisk: string;
  predictedConsequence: string;
  recommendedAction: string;
  keyDrivers: string[];
  tacticalAdvice: string;
  routingAdvice: string;
  confidence: number;
}

// 9. Emergency Priority Item
export interface EmergencyPriorityItem {
  id: string;
  rank: 1 | 2 | 3 | 4 | 5;
  tier:
    | 'Priority 1 — Critical hospital access'
    | 'Priority 2 — Major road closure'
    | 'Priority 3 — High-risk residential zone'
    | 'Priority 4 — School accessibility'
    | 'Priority 5 — Other affected locations';
  targetName: string;
  location: string;
  severity: RiskLevel;
  triggerCondition: string;
  recommendedResponse: string;
}

export interface SimulationResult {
  params: SimulationParams;
  calculatedAt: string;
  riskScore: number; // 0 - 100
  riskCategory: RiskLevel;
  predicted30mRisk: { score: number; level: RiskLevel };
  predicted60mRisk: { score: number; level: RiskLevel };
  predicted120mRisk: { score: number; level: RiskLevel };
  affectedRoadsCount: number;
  blockedRoadsCount: number;
  criticalFacilitiesAtRiskCount: number;
  totalFacilitiesEvaluated: number;
  populationAtRisk: number;
  predictedAffectedAreaKm2: number;
  peakInundationDepthCm: number;
  activeAlerts: ActiveAlert[];
  zones: ZoneRisk[];
  roads: RoadSegment[];
  facilities: CriticalFacility[];
  safeRouteIds: string[];
  rainfallTimeSeries: { time: string; pastMm: number; forecastMm: number }[];
  riskTimeSeries: { time: string; score: number; level: RiskLevel }[];
  waterLevelTimeSeries: { time: string; riverLevelM: number; dangerM: number; warningM: number }[];
  riskProgressionBySector: {
    sector: string;
    t0: number;
    t15: number;
    t30: number;
    t60: number;
    t120: number;
  }[];

  // UPGRADED DECISION SUPPORT PAYLOADS
  chainReaction: ChainReactionNode[];
  impactTimeline: PredictedTimelineEvent[];
  facilityDecisionList: FacilityDecisionSupport[];
  dynamicRoutes: DynamicRouteAnalysis;
  aiInsight: AIInsightData;
  emergencyPriorities: EmergencyPriorityItem[];
}
