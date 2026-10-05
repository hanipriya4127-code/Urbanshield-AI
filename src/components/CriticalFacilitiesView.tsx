import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  AlertTriangle,
  Zap,
  Phone,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  ShieldAlert,
  Navigation
} from 'lucide-react';
import { FacilityDecisionSupport, FacilityType, SimulationResult } from '../types';

interface CriticalFacilitiesViewProps {
  simulation: SimulationResult;
}

export const CriticalFacilitiesView: React.FC<CriticalFacilitiesViewProps> = ({
  simulation,
}) => {
  const { facilityDecisionList } = simulation;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const filteredFacilities = facilityDecisionList.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.capacity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.recommendedAction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || fac.type === selectedType;
    const matchesPriority =
      selectedPriority === 'ALL' || fac.priority.startsWith(selectedPriority);
    return matchesSearch && matchesType && matchesPriority;
  });

  const getPriorityBadge = (priority: FacilityDecisionSupport['priority']) => {
    if (priority.startsWith('Priority 1')) {
      return 'bg-red-600 text-white font-extrabold shadow-red-950/40';
    }
    if (priority.startsWith('Priority 2')) {
      return 'bg-orange-500 text-slate-950 font-bold';
    }
    if (priority.startsWith('Priority 3')) {
      return 'bg-yellow-500 text-slate-950 font-bold';
    }
    return 'bg-slate-700 text-slate-200 font-bold';
  };

  const getAccessibilityBadge = (acc: FacilityDecisionSupport['accessibility']) => {
    switch (acc) {
      case 'Cut Off / Inaccessible':
        return 'text-red-400 bg-red-950/70 border-red-800';
      case 'Severe Detour Required':
        return 'text-orange-400 bg-orange-950/70 border-orange-800';
      case 'Restricted / Caution':
        return 'text-yellow-400 bg-yellow-950/70 border-yellow-800';
      case 'Direct Access Clear':
      default:
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Critical Facility Impact & Decision Support
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational triage evaluating Current Risk, Predicted Risk, Ingress Accessibility, Response Priority, and Recommended Actions.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Total Monitored:</span>
          <span className="text-white font-bold">{facilityDecisionList.length} Facilities</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search facility, role, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Facility Types</option>
            <option value="Hospital">Hospitals</option>
            <option value="School">Schools / Shelters</option>
            <option value="Fire Station">Fire Rescue Stations</option>
            <option value="Police Station">Police Stations</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="Priority 1">Priority 1 (Critical)</option>
            <option value="Priority 2">Priority 2 (High)</option>
            <option value="Priority 3">Priority 3 (Moderate)</option>
            <option value="Priority 4">Priority 4 (Stable)</option>
          </select>
        </div>
      </div>

      {/* Facilities Cards Grid displaying all 5 required elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacilities.map((fac) => {
          const isHighPriority = fac.priority.startsWith('Priority 1') || fac.priority.startsWith('Priority 2');

          return (
            <div
              key={fac.facilityId}
              className={`p-4 rounded-xl border bg-slate-900/90 space-y-3.5 transition-all shadow-lg ${
                isHighPriority
                  ? 'border-red-700/80 shadow-red-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Name, Type, and Priority Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      {fac.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Elev: {fac.elevationMeters}m ASL
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {fac.name}
                  </h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${getPriorityBadge(
                    fac.priority
                  )}`}
                >
                  {fac.priority}
                </span>
              </div>

              {/* 4 Metric Boxes: Current Risk, Predicted Risk, Accessibility, Doorstep Depth */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {/* 1. Current Risk */}
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Current Risk</span>
                  <span
                    className={`font-bold uppercase ${
                      fac.currentRisk === 'CRITICAL'
                        ? 'text-red-400'
                        : fac.currentRisk === 'HIGH'
                        ? 'text-orange-400'
                        : fac.currentRisk === 'MODERATE'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {fac.currentRisk}
                  </span>
                </div>

                {/* 2. Predicted Risk */}
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Predicted Risk (+60m)</span>
                  <span
                    className={`font-bold uppercase ${
                      fac.predictedRisk === 'CRITICAL'
                        ? 'text-red-400'
                        : fac.predictedRisk === 'HIGH'
                        ? 'text-orange-400'
                        : fac.predictedRisk === 'MODERATE'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {fac.predictedRisk}
                  </span>
                </div>

                {/* 3. Accessibility */}
                <div className="col-span-2 p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Accessibility</span>
                  <span className={`text-[11px] font-bold border px-1.5 py-0.5 rounded inline-block mt-0.5 ${getAccessibilityBadge(fac.accessibility)}`}>
                    {fac.accessibility}
                  </span>
                </div>
              </div>

              {/* 5. Recommended Action Directive Box */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Recommended Action
                </span>
                <p className="text-xs text-slate-200 leading-snug">
                  {fac.recommendedAction}
                </p>
              </div>

              {/* Capacity & Dispatch Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Role: {fac.capacity}</span>
                <span className="text-slate-300">Hotline: {fac.contact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
