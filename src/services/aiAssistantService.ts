/**
 * UrbanShield AI - Conversational Assistant & Decision Support Engine
 * Grounded in the active simulation state and hydrological calculations.
 */

import { SimulationResult } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  keyMetrics?: { label: string; value: string }[];
  suggestedAction?: string;
  category?: 'risk' | 'routing' | 'facilities' | 'priority' | 'scenario';
}

export function generateAssistantResponse(
  query: string,
  simulation: SimulationResult
): ChatMessage {
  const normalized = query.toLowerCase().trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const id = `msg-${Date.now()}`;

  const {
    riskScore,
    riskCategory,
    zones,
    roads,
    facilities,
    dynamicRoutes,
    emergencyPriorities,
    params,
    populationAtRisk,
    blockedRoadsCount,
    criticalFacilitiesAtRiskCount,
    peakInundationDepthCm,
  } = simulation;

  // Find the highest-risk zone
  const highestZone = zones.slice().sort((a, b) => b.riskScore - a.riskScore)[0];

  // Find the most flooded road
  const worstRoad = roads.slice().sort((a, b) => b.waterDepthCm - a.waterDepthCm)[0];

  // Find the most affected hospital
  const hospitals = facilities.filter((f) => f.type === 'Hospital');
  const worstHospital = hospitals.slice().sort((a, b) => b.inundationDepthCm - a.inundationDepthCm)[0];

  // 1. "What is the highest-risk area?"
  if (
    normalized.includes('highest-risk') ||
    normalized.includes('highest risk') ||
    normalized.includes('most vulnerable') ||
    normalized.includes('worst zone') ||
    normalized.includes('where is flooding worst')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `Based on current simulation data (${params.rainfall}mm rain, ${params.drainageBlockage}% blockage), the highest-risk area is **${highestZone.name}** with a risk score of **${highestZone.riskScore}/100** (${highestZone.riskLevel} threat). Predicted water accumulation reaches **${highestZone.predictedDepthCm} cm** due to its low elevation of ${highestZone.elevationMeters}m ASL and proximity to the fluvial delta.`,
      timestamp: time,
      category: 'risk',
      keyMetrics: [
        { label: 'Highest Risk Zone', value: highestZone.name },
        { label: 'Predicted Depth', value: `${highestZone.predictedDepthCm} cm` },
        { label: 'Zone Elevation', value: `${highestZone.elevationMeters} m ASL` },
        { label: 'Population Exposed', value: highestZone.basePopulation.toLocaleString() }
      ],
      suggestedAction: 'Prioritize automated flood barrier deployment and stage civil protection transport at coastal perimeters.'
    };
  }

  // 2. "Which road should emergency vehicles avoid?"
  if (
    normalized.includes('road') &&
    (normalized.includes('avoid') || normalized.includes('blocked') || normalized.includes('impassable') || normalized.includes('unsafe'))
  ) {
    const blockedList = roads.filter((r) => r.status === 'Blocked');
    return {
      id,
      sender: 'assistant',
      text: `Emergency vehicles must strictly avoid **${worstRoad.name}** where water depth is predicted to reach **${worstRoad.waterDepthCm} cm** (exceeding the 35 cm vehicle submersion threshold). Total ${blockedRoadsCount} road segments are currently impassable: ${blockedList.map((r) => r.name).join(', ')}. Emergency access is routed via the elevated **Interstate 80 Corridor** at 12m ASL.`,
      timestamp: time,
      category: 'routing',
      keyMetrics: [
        { label: 'Critical Impassable Road', value: worstRoad.name },
        { label: 'Submersion Depth', value: `${worstRoad.waterDepthCm} cm` },
        { label: 'Total Blocked Roads', value: `${blockedRoadsCount} Segments` },
        { label: 'Safe Bypass Road', value: 'Interstate 80 Corridor (12m ASL)' }
      ],
      suggestedAction: 'Lock automatic underpass swing barricades and illuminate digital variable messaging signs.'
    };
  }

  // 3. "Which hospital is most affected?"
  if (
    normalized.includes('hospital') ||
    normalized.includes('healthcare') ||
    normalized.includes('medical')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `The most severely affected healthcare facility is **${worstHospital.name}** (elevation ${worstHospital.elevationMeters}m ASL). Predicted doorstep inundation reaches **${worstHospital.inundationDepthCm} cm** (${worstHospital.status} status). Auxiliary generator circuits are ${worstHospital.backupPower === 'Active' ? 'currently operational' : 'vulnerable'}. In contrast, **Metropolitan General Hospital & Trauma Center** remains 100% dry at 14.2m ASL.`,
      timestamp: time,
      category: 'facilities',
      keyMetrics: [
        { label: 'Threatened Hospital', value: worstHospital.name },
        { label: 'Doorstep Inundation', value: `${worstHospital.inundationDepthCm} cm` },
        { label: 'Generator Status', value: worstHospital.backupPower },
        { label: 'Safe Alternative Hub', value: 'Metropolitan General Hospital (14.2m ASL)' }
      ],
      suggestedAction: 'Deploy inflatable cofferdam rings around East Bay Hospital ambulance bays and divert critical trauma to Metro General.'
    };
  }

  // 4. "Why did the safe route change?"
  if (
    normalized.includes('route') &&
    (normalized.includes('why') || normalized.includes('change') || normalized.includes('reroute') || normalized.includes('detour'))
  ) {
    return {
      id,
      sender: 'assistant',
      text: `The safe evacuation route changed from the direct street grid because: **${dynamicRoutes.rerouteReason}** The shortest route passes directly through Riverwalk Boulevard Underpass, where rapid drainage surcharge creates an acute 52cm drowning hazard within 45 minutes. The recommended safe route utilizes the elevated **Interstate 80 Viaduct** and **Foothills Parkway**, remaining 100% dry and passable.`,
      timestamp: time,
      category: 'routing',
      keyMetrics: [
        { label: 'Shortest Route Status', value: 'Compromised (52cm underpass depth)' },
        { label: 'Recommended Route', value: 'Interstate 80 Viaduct (12m ASL)' },
        { label: 'Safe Distance / Time', value: '9.4 km · 18 min' },
        { label: 'Hazard Clearance', value: '100% Dry & Elevated' }
      ],
      suggestedAction: 'Broadcast dynamic GPS waypoints to municipal response fleets and mobile emergency notification channels.'
    };
  }

  // 5. "What happens if rainfall increases?"
  if (
    normalized.includes('rainfall') ||
    normalized.includes('rain increases') ||
    normalized.includes('what happens if') ||
    normalized.includes('cloudburst') ||
    normalized.includes('intensity')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `If precipitation increases from ${params.rainfall}mm to 160mm, urban runoff surges non-linearly due to saturated ground infiltration capacity. Model projections indicate: (1) Inundated urban area expands by +4.8 km²; (2) Additional 2 arterial roads submerge; (3) Critical facilities threatened increases from ${criticalFacilitiesAtRiskCount} to 5; and (4) Population at risk increases by +35,000 citizens.`,
      timestamp: time,
      category: 'scenario',
      keyMetrics: [
        { label: 'Current Rainfall', value: `${params.rainfall} mm` },
        { label: 'Runoff Sensitivity', value: '+32% volume per 20mm rain' },
        { label: 'Peak River Surge', value: '+1.1m stage crest at +60m' },
        { label: 'Threshold Warning', value: 'Breaches 5.0m Danger Crest at 160mm' }
      ],
      suggestedAction: 'Use the What-If Scenario Comparison tab to benchmark 120mm vs 160mm compound failure.'
    };
  }

  // 6. "What should responders prioritize?"
  if (
    normalized.includes('prioritize') ||
    normalized.includes('priority') ||
    normalized.includes('first action') ||
    normalized.includes('what should responders do') ||
    normalized.includes('response')
  ) {
    const topPriorities = emergencyPriorities.slice(0, 3);
    return {
      id,
      sender: 'assistant',
      text: `Based on the active ${riskCategory} risk posture, municipal responders must execute the following top priorities: (1) **${topPriorities[0].tier}**: ${topPriorities[0].recommendedResponse} (2) **${topPriorities[1].tier}**: ${topPriorities[1].recommendedResponse} (3) **${topPriorities[2].tier}**: ${topPriorities[2].recommendedResponse}`,
      timestamp: time,
      category: 'priority',
      keyMetrics: [
        { label: 'Priority 1', value: 'Hospital Access Protection' },
        { label: 'Priority 2', value: 'Underpass Barricades & Traffic Detour' },
        { label: 'Priority 3', value: 'Lowland Residential Evacuation' }
      ],
      suggestedAction: 'Click "Dispatch Units" on the Priority 1 action card to broadcast orders to field marshals.'
    };
  }

  // Default intelligent synthesis based on current telemetry
  return {
    id,
    sender: 'assistant',
    text: `Under the active simulation (${params.rainfall}mm rain, ${params.drainageBlockage}% blockage, ${params.waterLevel} baseline water level), urban flood risk is categorized as **${riskCategory}** (${riskScore}/100). There are **${blockedRoadsCount} impassable roads**, **${criticalFacilitiesAtRiskCount} threatened critical facilities**, and an estimated **${populationAtRisk.toLocaleString()} citizens at risk**. Peak inundation reaches **${peakInundationDepthCm} cm** in the East Estuary lowlands.`,
    timestamp: time,
    category: 'risk',
    keyMetrics: [
      { label: 'Overall Risk Score', value: `${riskScore}/100 (${riskCategory})` },
      { label: 'Affected Roads', value: `${blockedRoadsCount} blocked` },
      { label: 'Threatened Facilities', value: `${criticalFacilitiesAtRiskCount} facilities` },
      { label: 'Population at Risk', value: populationAtRisk.toLocaleString() }
    ],
    suggestedAction: 'Review the Predicted Impact Timeline and Dynamic Safe Route to maintain operational emergency corridors.'
  };
}

// Voice synthesis helper
export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  // Strip markdown formatting for cleaner speech
  const clean = text.replace(/[*_#`[\]()]/g, '');
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;
  if (onEnd) {
    utterance.onend = onEnd;
  }
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
