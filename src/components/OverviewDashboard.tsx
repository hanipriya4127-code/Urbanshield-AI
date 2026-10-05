import React, { useState } from 'react';
import {
  AlertTriangle,
  Car,
  Building2,
  Users,
  BellRing,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Activity,
  Navigation
} from 'lucide-react';
import { RiskLevel, SimulationResult, TimelineStep } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { FloodChainReaction } from './FloodChainReaction';
import { PredictedImpactTimeline } from './PredictedImpactTimeline';
import { AIInsightPanel } from './AIInsightPanel';
import { EmergencyPriorityList } from './EmergencyPriorityList';

interface OverviewDashboardProps {
  simulation: SimulationResult;
  onNavigateToTab: (tab: string) => void;
  onLoadBenchmarkPreset: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  simulation,
  onNavigateToTab,
  onLoadBenchmarkPreset,
}) => {
  const [selectedTimelineStep, setSelectedTimelineStep] = useState<TimelineStep>('NOW');

  const {
    riskScore,
    riskCategory,
    predicted30mRisk,
    predicted60mRisk,
    predicted120mRisk,
    affectedRoadsCount,
    blockedRoadsCount,
    criticalFacilitiesAtRiskCount,
    totalFacilitiesEvaluated,
    populationAtRisk,
    predictedAffectedAreaKm2,
    activeAlerts,
    zones,
    roads,
    facilities,
    safeRouteIds,
    peakInundationDepthCm,
    chainReaction,
    impactTimeline,
    aiInsight,
    emergencyPriorities,
    dynamicRoutes,
    params,
  } = simulation;

  const getRiskBadgeStyles = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/70 border-red-800';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/70 border-amber-800';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-950/70 border-yellow-800';
      case 'LOW':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Protocol Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-cyan-400">
              Active Decision Support
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            UrbanShield AI
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Urban flood nowcasting, spatial hazard propagation, and evacuation routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateToTab('flood-simulation')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-950/30"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Simulation</span>
          </button>
          <button
            onClick={() => onNavigateToTab('live-map')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>GIS Map</span>
          </button>
        </div>
      </div>

      {/* 2. Command-Center Dashboard: 6 Essential Municipal Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Current Risk */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Current Risk</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getRiskBadgeStyles(riskCategory)}`}>
              {riskCategory}
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {riskScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80 truncate">
            Peak Depth: {peakInundationDepthCm} cm
          </div>
        </div>

        {/* Card 2: 60-min Risk */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>60-min Risk</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getRiskBadgeStyles(predicted60mRisk.level)}`}>
              {predicted60mRisk.level}
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {predicted60mRisk.score}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="text-[10px] text-amber-400 font-mono pt-1.5 border-t border-slate-800/80 truncate flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{predicted60mRisk.score - riskScore} Forecast Peak</span>
          </div>
        </div>

        {/* Card 3: Roads at Risk */}
        <div
          onClick={() => onNavigateToTab('safe-routes')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-cyan-400" /> Roads at Risk
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {affectedRoadsCount}
            </span>
            <span className="text-xs text-red-400 font-mono font-semibold">({blockedRoadsCount} Blocked)</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80 truncate">
            Underpass Inundated
          </div>
        </div>

        {/* Card 4: Facilities at Risk */}
        <div
          onClick={() => onNavigateToTab('critical-facilities')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> Facilities at Risk
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {criticalFacilitiesAtRiskCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {totalFacilitiesEvaluated}</span>
          </div>
          <div className="text-[10px] text-amber-400 font-mono pt-1.5 border-t border-slate-800/80 truncate">
            Hospital Access Strained
          </div>
        </div>

        {/* Card 5: Population at Risk */}
        <div
          onClick={() => onNavigateToTab('impact-analysis')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" /> Population at Risk
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {populationAtRisk.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80 truncate">
            {predictedAffectedAreaKm2} km² Zone Ingress
          </div>
        </div>

        {/* Card 6: Active Alerts */}
        <div
          onClick={() => onNavigateToTab('alerts')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-red-400" /> Active Alerts
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {activeAlerts.length}
            </span>
            <span className="text-xs text-red-400 font-mono font-semibold">CAP Active</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80 truncate">
            P1 Emergency Broadcast
          </div>
        </div>
      </div>

      {/* 3. MAIN VISUAL ELEMENT: INTERACTIVE CITY MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-sans">
              Live Risk Map
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              Time Step: {selectedTimelineStep}
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('live-map')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-sans"
          >
            <span>Expanded View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The GIS Map Container */}
        <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
          <InteractiveMap
            zones={zones}
            roads={roads}
            facilities={facilities}
            safeRouteIds={safeRouteIds}
            peakDepthCm={peakInundationDepthCm}
            externalStep={selectedTimelineStep}
            onStepChange={setSelectedTimelineStep}
            rerouteReason={dynamicRoutes.rerouteReason}
          />
        </div>
      </div>

      {/* 4. Evacuation Route Directive & Forward Horizon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Safe Evacuation Corridor */}
        <div
          onClick={() => onNavigateToTab('safe-routes')}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/40 hover:border-emerald-500/70 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <Navigation className="w-4 h-4 text-emerald-400" /> Recommended Safe Route
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-mono font-bold">
              100% PASSABLE
            </span>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <span>Interstate 80 Elevated Viaduct</span>
              <span className="text-emerald-400 text-sm font-mono">(9.4 km · 18 min)</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              “Route changed due to predicted flood risk.” Lowland underpasses bypassed.
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 pt-3 mt-3 border-t border-emerald-900/40 flex items-center justify-between font-mono">
            <span>Destination: Metropolitan Hospital</span>
            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View Route Options</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Nowcast Projection Windows */}
        <div
          onClick={() => onNavigateToTab('flood-simulation')}
          className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Forecast Horizons (30m / 120m)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              Temporal Inundation
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">30-MIN RISK</div>
              <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1 mt-0.5">
                <span>{predicted30mRisk.score}</span>
                <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
                <span className={`text-[10px] font-mono ml-auto font-semibold ${predicted30mRisk.level === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                  {predicted30mRisk.level}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">120-MIN RISK</div>
              <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1 mt-0.5">
                <span>{predicted120mRisk.score}</span>
                <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
                <span className="text-[10px] font-mono ml-auto text-emerald-400 font-semibold">
                  {predicted120mRisk.level}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 mt-1 border-t border-slate-800/80 flex items-center justify-between font-mono">
            <span>Hydrological Attenuation Window</span>
            <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Simulation Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 8. AI INSIGHT (Short, actionable decision summary) */}
      <AIInsightPanel
        insight={aiInsight}
        params={params}
        riskCategory={riskCategory}
      />

      {/* 9. FLOOD CHAIN REACTION & PREDICTED IMPACT TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FloodChainReaction
          chain={chainReaction}
          riskCategory={riskCategory}
        />

        <PredictedImpactTimeline
          timelineEvents={impactTimeline}
          selectedStep={selectedTimelineStep}
          onSelectStep={setSelectedTimelineStep}
          peakDepthCm={peakInundationDepthCm}
        />
      </div>

      {/* 10. EMERGENCY PRIORITIES */}
      <EmergencyPriorityList
        priorities={emergencyPriorities}
        riskCategory={riskCategory}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
};
