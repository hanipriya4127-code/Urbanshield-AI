import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  CloudRain,
  Percent,
  Waves,
  Clock,
  Check,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { SimulationParams, WaterLevelState } from '../types';

interface SimulationPanelProps {
  currentParams: SimulationParams;
  onRunSimulation: (params: SimulationParams) => void;
  isRunning?: boolean;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  currentParams,
  onRunSimulation,
  isRunning = false,
}) => {
  const [params, setParams] = useState<SimulationParams>(currentParams);
  const [justRan, setJustRan] = useState(false);

  const rainfallOptions: SimulationParams['rainfall'][] = [20, 50, 80, 120, 160];
  const blockageOptions: SimulationParams['drainageBlockage'][] = [0, 20, 40, 60];
  const waterLevelOptions: WaterLevelState[] = ['Normal', 'Rising', 'High', 'Critical'];
  const durationOptions: SimulationParams['duration'][] = [15, 30, 60, 120];

  const handleApplyBenchmark = () => {
    const benchmarkParams: SimulationParams = {
      rainfall: 120,
      drainageBlockage: 40,
      waterLevel: 'High',
      duration: 60,
    };
    setParams(benchmarkParams);
    onRunSimulation(benchmarkParams);
    setJustRan(true);
    setTimeout(() => setJustRan(false), 2000);
  };

  const handleRun = () => {
    onRunSimulation(params);
    setJustRan(true);
    setTimeout(() => setJustRan(false), 2000);
  };

  const handleResetToDefault = () => {
    const defaultParams: SimulationParams = {
      rainfall: 50,
      drainageBlockage: 20,
      waterLevel: 'Rising',
      duration: 30,
    };
    setParams(defaultParams);
    onRunSimulation(defaultParams);
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Flood Simulation & Nowcast Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure meteorological precipitation, drainage obstruction, and hydrographic parameters.
          </p>
        </div>

        {/* Benchmark Preset Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyBenchmark}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset: 120mm / 40% / High / 60m</span>
          </button>
          <button
            onClick={handleResetToDefault}
            className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset parameters to baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Simulation Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Rainfall Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Precipitation (Rainfall)</span>
            </span>
            <span className="font-mono font-bold text-cyan-400">{params.rainfall} mm</span>
          </div>

          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            {rainfallOptions.map((val) => (
              <button
                key={val}
                onClick={() => setParams({ ...params, rainfall: val })}
                className={`py-1.5 text-xs font-mono font-medium rounded transition-all ${
                  params.rainfall === val
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {params.rainfall >= 120
              ? 'Extreme storm / Cloudburst event'
              : params.rainfall >= 80
              ? 'Heavy torrential downpour'
              : 'Moderate rain accumulation'}
          </p>
        </div>

        {/* 2. Drainage Blockage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>Drainage Blockage</span>
            </span>
            <span className="font-mono font-bold text-amber-400">{params.drainageBlockage}%</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            {blockageOptions.map((val) => (
              <button
                key={val}
                onClick={() => setParams({ ...params, drainageBlockage: val })}
                className={`py-1.5 text-xs font-mono font-medium rounded transition-all ${
                  params.drainageBlockage === val
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {params.drainageBlockage >= 40
              ? 'Critical storm trunk conduit choke'
              : params.drainageBlockage > 0
              ? 'Partial trash/debris restriction'
              : 'Clear hydraulic throughput'}
          </p>
        </div>

        {/* 3. Antecedent Water Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Waves className="w-4 h-4 text-blue-400" />
              <span>Baseline Water Level</span>
            </span>
            <span className={`font-mono font-bold ${
              params.waterLevel === 'Critical' ? 'text-red-400' :
              params.waterLevel === 'High' ? 'text-orange-400' :
              params.waterLevel === 'Rising' ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {params.waterLevel}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            {waterLevelOptions.map((val) => (
              <button
                key={val}
                onClick={() => setParams({ ...params, waterLevel: val })}
                className={`py-1.5 text-[11px] font-sans font-medium rounded transition-all ${
                  params.waterLevel === val
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Catchment saturation & river level
          </p>
        </div>

        {/* 4. Simulation Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Nowcast Duration</span>
            </span>
            <span className="font-mono font-bold text-indigo-300">{params.duration} min</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            {durationOptions.map((val) => (
              <button
                key={val}
                onClick={() => setParams({ ...params, duration: val })}
                className={`py-1.5 text-xs font-mono font-medium rounded transition-all ${
                  params.duration === val
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {val}m
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Forward projection window
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Hydrological calculation based on rational runoff $Q = C \cdot I \cdot A$ with drainage attenuation.
          </span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg ${
            justRan
              ? 'bg-emerald-600 text-white shadow-emerald-900/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-950/40 active:scale-[0.99]'
          }`}
        >
          {justRan ? (
            <>
              <Check className="w-4 h-4" />
              <span>Model Updated</span>
            </>
          ) : isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
