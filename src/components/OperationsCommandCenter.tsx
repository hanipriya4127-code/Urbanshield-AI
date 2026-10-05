import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Maximize2,
  Minimize2,
  X,
  MapPin,
  Car,
  Building2,
  Navigation,
  AlertOctagon,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2,
  Send
} from 'lucide-react';
import { SimulationResult, TimelineStep } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface OperationsCommandCenterProps {
  simulation: SimulationResult;
  onExit: () => void;
  onOpenAssistant: () => void;
}

export const OperationsCommandCenter: React.FC<OperationsCommandCenterProps> = ({
  simulation,
  onExit,
  onOpenAssistant,
}) => {
  const [selectedStep, setSelectedStep] = useState<TimelineStep>('NOW');

  const {
    riskScore,
    riskCategory,
    predicted60mRisk,
    affectedRoadsCount,
    blockedRoadsCount,
    criticalFacilitiesAtRiskCount,
    populationAtRisk,
    peakInundationDepthCm,
    zones,
    roads,
    facilities,
    safeRouteIds,
    aiInsight,
    emergencyPriorities,
    dynamicRoutes,
    params,
  } = simulation;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto select-none font-sans">
      {/* Top Mission Control Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/30 px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-950/40">
            <ShieldAlert className="w-6 h-6 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white font-sans">
                Emergency Operations Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-700">
                ACTIVE MONITORING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Urban Flood Nowcasting & Decision Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Assistant button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-950/30"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>AI Assistant</span>
          </button>

          {/* Exit Command Center */}
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono border border-slate-700 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): MAP (Live Risk + Predicted Spread + Safe Route) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Live Risk & Map Section Header */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  Spatial Cartography & Directional Flow
                </span>
                <h3 className="text-base font-bold text-white">
                  Live GIS Hydrological Inundation & Routing Map
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Risk Score:</span>
                <span className="text-lg font-black text-cyan-300">{riskScore}/100 ({riskCategory})</span>
              </div>
            </div>

            {/* Interactive GIS Map */}
            <InteractiveMap
              zones={zones}
              roads={roads}
              facilities={facilities}
              safeRouteIds={safeRouteIds}
              peakDepthCm={peakInundationDepthCm}
              externalStep={selectedStep}
              onStepChange={setSelectedStep}
              rerouteReason={dynamicRoutes.rerouteReason}
            />

            {/* SAFE ROUTE DIRECTIVE BANNER */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
                  <Navigation className="w-4 h-4" />
                  <span>Recommended Safe Route</span>
                </div>
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  100% Passable
                </span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                <strong>Route Notice:</strong> {dynamicRoutes.rerouteReason}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                <span>Corridor: Interstate 80 Viaduct + Foothills Parkway</span>
                <span className="text-emerald-400 font-bold">9.4 km · 18 min</span>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): ROADS + FACILITIES + EMERGENCY PRIORITY + AI RECOMMENDATION */}
          <div className="space-y-4">
            {/* AI RECOMMENDATION */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>AI Insight</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {aiInsight.summary}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-[11px] text-cyan-200">
                <strong className="text-cyan-400 font-mono">Recommended Action:</strong> {aiInsight.tacticalAdvice}
              </div>
            </div>

            {/* ROADS AT RISK & CRITICAL FACILITIES */}
            <div className="grid grid-cols-2 gap-3">
              {/* Roads at Risk */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Roads at Risk
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {blockedRoadsCount}{' '}
                  <span className="text-xs font-normal text-slate-400">Blocked</span>
                </div>
                <p className="text-[10px] text-red-300 font-mono line-clamp-1">
                  Riverwalk Blvd Underpass (52cm)
                </p>
              </div>

              {/* Critical Facilities */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Critical Facilities
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {criticalFacilitiesAtRiskCount}{' '}
                  <span className="text-xs font-normal text-slate-400">At Risk</span>
                </div>
                <p className="text-[10px] text-amber-300 font-mono line-clamp-1">
                  East Bay Hospital Access Threat
                </p>
              </div>
            </div>

            {/* EMERGENCY PRIORITY RANKED LIST */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Emergency Priorities</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ranked P1 - P5</span>
              </div>

              <div className="space-y-2">
                {emergencyPriorities.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-mono font-bold ${
                          p.rank === 1 ? 'bg-red-600 text-white' : p.rank === 2 ? 'bg-orange-500 text-slate-950' : 'bg-slate-700 text-white'
                        }`}>
                          {p.rank}
                        </span>
                        {p.targetName}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/50 text-slate-300">
                        {p.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                      {p.recommendedResponse}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
