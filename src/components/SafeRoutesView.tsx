import React, { useState } from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Car,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Share2,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';
import { RouteStateOption, SimulationResult } from '../types';

interface SafeRoutesViewProps {
  simulation: SimulationResult;
}

export const SafeRoutesView: React.FC<SafeRoutesViewProps> = ({ simulation }) => {
  const { roads, facilities, dynamicRoutes } = simulation;
  const [selectedRouteId, setSelectedRouteId] = useState<'CURRENT_SHORTEST' | 'PREDICTED_RISK' | 'RECOMMENDED_SAFE'>('RECOMMENDED_SAFE');

  const { routes, rerouteReason, origin, destination } = dynamicRoutes;
  const routeOptions: RouteStateOption[] = [
    routes.currentShortest,
    routes.predictedRisk,
    routes.recommendedSafe
  ];

  const activeRoute = routeOptions.find((r) => r.id === selectedRouteId) || routes.recommendedSafe;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            Dynamic Safe Route Engine & Predictive Rerouting
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compares shortest transit routes against forecasted water accumulation to deliver hazard-free evacuation corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evacuation Corridor Alpha Active</span>
          </span>
        </div>
      </div>

      {/* Prominent Reason Banner (Requirement 5) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-600/70 shadow-xl flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Predictive Reroute Directive Justification
          </span>
          <p className="text-sm font-semibold text-white leading-snug">
            “{rerouteReason}”
          </p>
          <p className="text-xs text-slate-400">
            Automated civil protection dispatch has updated electronic roadside matrix boards and mobile municipal guidance.
          </p>
        </div>
      </div>

      {/* Origin & Destination Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">ORIGIN:</span>
          <span className="text-white font-bold">{origin}</span>
        </div>
        <div className="hidden sm:flex items-center text-cyan-400">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">DESTINATION:</span>
          <span className="text-emerald-400 font-bold">{destination}</span>
        </div>
      </div>

      {/* 3 Route States Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {routeOptions.map((opt) => {
          const isSelected = selectedRouteId === opt.id;
          const isRecommended = opt.id === 'RECOMMENDED_SAFE';
          const isShortest = opt.id === 'CURRENT_SHORTEST';

          return (
            <div
              key={opt.id}
              onClick={() => setSelectedRouteId(opt.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? isRecommended
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/40'
                    : isShortest
                    ? 'bg-red-950/30 border-2 border-red-500 shadow-2xl shadow-red-950/40'
                    : 'bg-orange-950/30 border-2 border-orange-500 shadow-2xl shadow-orange-950/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isRecommended
                        ? 'bg-emerald-500 text-slate-950'
                        : isShortest
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-500 text-slate-950'
                    }`}
                  >
                    {opt.label}
                  </span>

                  {isSelected && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      ACTIVE SELECTION
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {opt.statusBadge}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {opt.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Transit Time:</span>
                    <span className={`text-base font-extrabold ${opt.estimatedMinutes > 50 ? 'text-red-400' : 'text-slate-200'}`}>
                      {opt.estimatedMinutes > 50 ? 'Blocked' : `${opt.estimatedMinutes} min`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Distance:</span>
                    <span className="text-base font-extrabold text-slate-200">
                      {opt.distanceKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Risk Exposure:</span>
                    <span
                      className={`text-xs font-bold uppercase ${
                        opt.riskExposure === 'CRITICAL'
                          ? 'text-red-400'
                          : opt.riskExposure === 'HIGH'
                          ? 'text-orange-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {opt.riskExposure}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Elevation Profile:</span>
                    <span className="text-xs text-slate-300 font-bold">
                      {isRecommended ? '+12m to +16m' : '< 3.2m Low'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <button
                className={`w-full py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? isRecommended
                      ? 'bg-emerald-500 text-slate-950'
                      : isShortest
                      ? 'bg-red-600 text-white'
                      : 'bg-orange-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isSelected ? 'CURRENTLY INSPECTING' : 'VIEW ROUTE CORRIDOR'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Turn-by-Turn Waypoints for Selected Route */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Waypoints for {activeRoute.label}
            </span>
          </div>
          <span
            className={`text-xs font-mono font-semibold ${
              activeRoute.id === 'RECOMMENDED_SAFE'
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {activeRoute.statusBadge}
          </span>
        </div>

        {activeRoute.id === 'RECOMMENDED_SAFE' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Depart Harbor Staging Point Northward</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Passable · Elev: 4.8m</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Avoid Lowland Wharf Approach Road (Submerged: 52cm depth). Divert immediately westward toward Interstate 80 On-Ramp.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Merge onto Interstate 80 Corridor (Upland Highway)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Elev: 12.0m · 0cm Inundation</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Maintain speed across the elevated viaduct. Do NOT take Riverwalk Boulevard exit (Underpass is completely submerged and barricaded).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Transit West Ridge High Ground via Foothills Parkway</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Elev: 16.5m · Completely Dry</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Ascend ridge road following emergency LED arrow boards towards Metropolitan General Hospital & Lincoln Heights Shelter A.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Arrive at Destination: Metropolitan General Hospital</span>
                  <span className="text-emerald-300 font-mono text-[11px]">Operational · Level 1 Trauma</span>
                </div>
                <p className="text-emerald-200/90 text-[11px]">
                  Emergency triage reception operational. Backup generators nominal. Clear of all fluvial backwater.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-red-300 font-bold font-mono">
              <AlertOctagon className="w-4 h-4" />
              <span>HAZARD ALERT: THIS ROUTE ENCOUNTERS SUBMERGED INFRASTRUCTURE</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              At Mile 3.4, this path enters Riverwalk Boulevard Underpass where water depth is predicted to exceed 48cm. Vehicles will be immobilized and emergency egress will be impossible. Please use the <strong>RECOMMENDED SAFE ROUTE</strong> via Interstate 80.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
