import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Sparkles,
  Waves,
  Car,
  Building2,
  Users,
  Navigation,
  BellRing,
  Lightbulb,
  X,
  FastForward
} from 'lucide-react';
import { SimulationParams, SimulationResult } from '../types';

interface LiveSimulationModalProps {
  isOpen: boolean;
  params: SimulationParams;
  onComplete: () => void;
  result: SimulationResult;
}

interface SimStep {
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const LiveSimulationModal: React.FC<LiveSimulationModalProps> = ({
  isOpen,
  params,
  onComplete,
  result,
}) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps: SimStep[] = [
    { number: 1, label: 'Analyze rainfall, drainage blockage and water level', icon: Cpu, description: `Parsing ${params.rainfall}mm rainfall, ${params.drainageBlockage}% blockage, ${params.waterLevel} baseline water stage` },
    { number: 2, label: 'Calculate simulated flood-risk score', icon: Sparkles, description: `Hydrologic runoff rational equation Q = C · I · A generates risk score ${result.riskScore}/100 (${result.riskCategory})` },
    { number: 3, label: 'Generate predicted flood zones', icon: Waves, description: `Hydrodynamic routing computes inundation polygons across urban catchments` },
    { number: 4, label: 'Display flood expansion on the map', icon: Waves, description: `Vector flow velocities animate water movement down West Ridge into Estuary Lowlands` },
    { number: 5, label: 'Update road risk', icon: Car, description: `Water surface elevation cross-referenced with road profiles: ${result.blockedRoadsCount} arterials impassable` },
    { number: 6, label: 'Update critical facility risk', icon: Building2, description: `Doorstep inundation evaluated across hospitals, shelters, fire, and police stations (${result.criticalFacilitiesAtRiskCount} at risk)` },
    { number: 7, label: 'Generate a recommended safe route', icon: Navigation, description: `Dynamic A* pathfinder avoids submerged underpasses, engaging Interstate 80 elevated corridor` },
    { number: 8, label: 'Update dashboard statistics', icon: Users, description: `Recalculating affected population (${result.populationAtRisk.toLocaleString()} citizens) and peak depth (${result.peakInundationDepthCm} cm)` },
    { number: 9, label: 'Generate alerts', icon: BellRing, description: `CAP v1.2 emergency advisories and cellular push broadcasts synthesized` },
    { number: 10, label: 'Generate a short AI Insight', icon: Lightbulb, description: `Synthesizing deterministic causal analysis and tactical response directive` },
  ];

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      return;
    }

    // Step progression animation (each step ~180ms -> total ~1.8 seconds)
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 10) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 10;
        }
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const currentStepObj = steps[activeStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6">
        {/* Modal Top Lockup */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live Flood Simulation Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 animate-pulse">
                  STEP {activeStep} OF 10
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Executing 10-step urban impact propagation nowcast sequence
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            title="Skip sequence"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SKIP</span>
          </button>
        </div>

        {/* Current Active Step Spotlight */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(currentStepObj.icon, {
                className: 'w-5 h-5 text-cyan-400 animate-bounce'
              })}
              <span className="text-sm font-bold text-white font-mono uppercase">
                Step {currentStepObj.number}: {currentStepObj.label}
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {Math.round((activeStep / 10) * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStepObj.description}
          </p>
        </div>

        {/* 9-Step Sequence Checklist */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {steps.map((st) => {
            const isDone = st.number < activeStep;
            const isCurrent = st.number === activeStep;
            const Icon = st.icon;

            return (
              <div
                key={st.number}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : isDone
                    ? 'bg-slate-900/60 text-slate-400 border border-slate-800'
                    : 'bg-slate-950/40 text-slate-600 border border-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-cyan-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.number}
                  </div>
                  <span className={isCurrent ? 'font-bold text-white' : ''}>
                    Step {st.number}: {st.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  {isDone ? (
                    <span className="text-emerald-400 font-bold">PROCESSED</span>
                  ) : isCurrent ? (
                    <span className="text-cyan-400 font-bold animate-pulse">COMPUTING...</span>
                  ) : (
                    <span className="text-slate-600">PENDING</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-200"
            style={{ width: `${(activeStep / 9) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
