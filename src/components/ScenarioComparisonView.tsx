import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Percent,
  CloudRain,
  Building2,
  Users,
  Car,
  Waves,
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SimulationParams, SimulationResult } from '../types';
import { runFloodSimulation } from '../services/simulationEngine';

interface ScenarioComparisonViewProps {
  currentSimulation: SimulationResult;
  onApplyScenario: (params: SimulationParams) => void;
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  currentSimulation,
  onApplyScenario,
}) => {
  // Configurable Scenario A
  const [paramsA, setParamsA] = useState<SimulationParams>({
    rainfall: 80,
    drainageBlockage: 20,
    waterLevel: 'Rising',
    duration: 60,
  });

  // Configurable Scenario B
  const [paramsB, setParamsB] = useState<SimulationParams>({
    rainfall: 120,
    drainageBlockage: 40,
    waterLevel: 'High',
    duration: 60,
  });

  const scenarioA = runFloodSimulation(paramsA);
  const scenarioB = runFloodSimulation(paramsB);

  const handleApplyPresetPair = (rainA: 50 | 80 | 120, blockA: 0 | 20 | 40, rainB: 80 | 120 | 160, blockB: 20 | 40 | 60) => {
    setParamsA({
      rainfall: rainA,
      drainageBlockage: blockA,
      waterLevel: rainA >= 120 ? 'High' : 'Rising',
      duration: 60,
    });
    setParamsB({
      rainfall: rainB,
      drainageBlockage: blockB,
      waterLevel: rainB >= 120 ? 'High' : 'Critical',
      duration: 60,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-800';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/80 border-orange-800';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-950/80 border-yellow-800';
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            What-If Scenario Comparison Matrix (Scenario A vs Scenario B)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate marginal delta in road failure, facility inundation, and required emergency responses under varied meteorological and drainage constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApplyPresetPair(80, 20, 120, 40)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Load Benchmark: 80mm/20% vs 120mm/40%
          </button>
        </div>
      </div>

      {/* Innovation Quote Banner */}
      <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 font-sans flex items-start gap-2.5">
        <span className="text-cyan-400 font-bold font-mono text-sm leading-none mt-0.5">“</span>
        <p className="italic">
          UrbanShield AI doesn't just predict where flooding may happen. It predicts how the impact may spread and recommends what should happen next.
        </p>
      </div>

      {/* Scenario A & B Tuners & Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= SCENARIO A ================= */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                SCENARIO A
              </span>
              <h3 className="text-base font-bold text-white">
                {paramsA.rainfall} mm Rainfall + {paramsA.drainageBlockage}% Blockage
              </h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getRiskColor(scenarioA.riskCategory)}`}>
              {scenarioA.riskCategory} ({scenarioA.riskScore}/100)
            </span>
          </div>

          {/* Scenario A Quick Tuner */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Precipitation (mm):</label>
              <select
                value={paramsA.rainfall}
                onChange={(e) => setParamsA({ ...paramsA, rainfall: Number(e.target.value) as any })}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
              >
                <option value={20}>20 mm</option>
                <option value={50}>50 mm</option>
                <option value={80}>80 mm</option>
                <option value={120}>120 mm</option>
                <option value={160}>160 mm</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Drain Blockage (%):</label>
              <select
                value={paramsA.drainageBlockage}
                onChange={(e) => setParamsA({ ...paramsA, drainageBlockage: Number(e.target.value) as any })}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
              >
                <option value={0}>0% (Clear)</option>
                <option value={20}>20% Choke</option>
                <option value={40}>40% Choke</option>
                <option value={60}>60% Choke</option>
              </select>
            </div>
          </div>

          {/* 6 Required Comparison Metrics */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* 1. Risk */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">1. Overall Flood Risk:</span>
              <span className="font-bold text-cyan-300">{scenarioA.riskScore} / 100 ({scenarioA.riskCategory})</span>
            </div>

            {/* 2. Affected Roads */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">2. Affected Roads:</span>
              <span className="font-bold text-white">
                {scenarioA.affectedRoadsCount} affected ({scenarioA.blockedRoadsCount} blocked)
              </span>
            </div>

            {/* 3. Facilities */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">3. Facilities Threatened:</span>
              <span className="font-bold text-white">
                {scenarioA.criticalFacilitiesAtRiskCount} critical facilities at risk
              </span>
            </div>

            {/* 4. Population at Risk */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">4. Population at Risk:</span>
              <span className="font-bold text-white">
                {scenarioA.populationAtRisk.toLocaleString()} citizens
              </span>
            </div>

            {/* 5. Flooded Area */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">5. Flooded Urban Area:</span>
              <span className="font-bold text-cyan-300">
                {scenarioA.predictedAffectedAreaKm2} km² (Peak {scenarioA.peakInundationDepthCm} cm)
              </span>
            </div>

            {/* 6. Recommended Response */}
            <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-1">
              <span className="text-slate-400 block font-bold text-[10px] text-cyan-400 uppercase">
                6. Recommended Response Directive:
              </span>
              <p className="text-slate-200 leading-snug font-sans text-xs">
                {scenarioA.aiInsight.tacticalAdvice}
              </p>
            </div>
          </div>

          <button
            onClick={() => onApplyScenario(paramsA)}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 transition-colors border border-slate-700"
          >
            ACTIVATE SCENARIO A IN COMMAND CENTER
          </button>
        </div>

        {/* ================= SCENARIO B ================= */}
        <div className="p-5 rounded-xl bg-slate-900/90 border-2 border-cyan-500/70 space-y-4 shadow-2xl shadow-cyan-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                SCENARIO B (SEVERE / COMPOUND)
              </span>
              <h3 className="text-base font-bold text-white">
                {paramsB.rainfall} mm Rainfall + {paramsB.drainageBlockage}% Blockage
              </h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getRiskColor(scenarioB.riskCategory)}`}>
              {scenarioB.riskCategory} ({scenarioB.riskScore}/100)
            </span>
          </div>

          {/* Scenario B Quick Tuner */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Precipitation (mm):</label>
              <select
                value={paramsB.rainfall}
                onChange={(e) => setParamsB({ ...paramsB, rainfall: Number(e.target.value) as any })}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
              >
                <option value={20}>20 mm</option>
                <option value={50}>50 mm</option>
                <option value={80}>80 mm</option>
                <option value={120}>120 mm</option>
                <option value={160}>160 mm</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Drain Blockage (%):</label>
              <select
                value={paramsB.drainageBlockage}
                onChange={(e) => setParamsB({ ...paramsB, drainageBlockage: Number(e.target.value) as any })}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
              >
                <option value={0}>0% (Clear)</option>
                <option value={20}>20% Choke</option>
                <option value={40}>40% Choke</option>
                <option value={60}>60% Choke</option>
              </select>
            </div>
          </div>

          {/* 6 Required Comparison Metrics */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* 1. Risk */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">1. Overall Flood Risk:</span>
              <span className="font-bold text-amber-300">{scenarioB.riskScore} / 100 ({scenarioB.riskCategory})</span>
            </div>

            {/* 2. Affected Roads */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">2. Affected Roads:</span>
              <span className="font-bold text-white">
                {scenarioB.affectedRoadsCount} affected ({scenarioB.blockedRoadsCount} blocked)
              </span>
            </div>

            {/* 3. Facilities */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">3. Facilities Threatened:</span>
              <span className="font-bold text-white">
                {scenarioB.criticalFacilitiesAtRiskCount} critical facilities at risk
              </span>
            </div>

            {/* 4. Population at Risk */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">4. Population at Risk:</span>
              <span className="font-bold text-amber-300">
                {scenarioB.populationAtRisk.toLocaleString()} citizens
              </span>
            </div>

            {/* 5. Flooded Area */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">5. Flooded Urban Area:</span>
              <span className="font-bold text-amber-300">
                {scenarioB.predictedAffectedAreaKm2} km² (Peak {scenarioB.peakInundationDepthCm} cm)
              </span>
            </div>

            {/* 6. Recommended Response */}
            <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-1">
              <span className="text-slate-400 block font-bold text-[10px] text-cyan-400 uppercase">
                6. Recommended Response Directive:
              </span>
              <p className="text-slate-200 leading-snug font-sans text-xs">
                {scenarioB.aiInsight.tacticalAdvice}
              </p>
            </div>
          </div>

          <button
            onClick={() => onApplyScenario(paramsB)}
            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-colors shadow-lg shadow-cyan-950/30"
          >
            ACTIVATE SCENARIO B IN COMMAND CENTER
          </button>
        </div>
      </div>

      {/* Delta Comparison Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Marginal Impact Delta (Scenario B vs Scenario A)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Risk Score Delta:</span>
            <span className="text-base font-extrabold text-amber-400">
              +{scenarioB.riskScore - scenarioA.riskScore} pts
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Additional Impassable Roads:</span>
            <span className="text-base font-extrabold text-red-400">
              +{scenarioB.blockedRoadsCount - scenarioA.blockedRoadsCount} roads
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Extra Citizens Exposed:</span>
            <span className="text-base font-extrabold text-amber-400">
              +{(scenarioB.populationAtRisk - scenarioA.populationAtRisk).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Expanded Inundation:</span>
            <span className="text-base font-extrabold text-cyan-300">
              +{(scenarioB.predictedAffectedAreaKm2 - scenarioA.predictedAffectedAreaKm2).toFixed(1)} km²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
