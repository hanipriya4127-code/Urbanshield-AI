import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Waves,
  Car,
  Building2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { PredictedTimelineEvent, TimelineStep } from '../types';

interface PredictedImpactTimelineProps {
  timelineEvents: PredictedTimelineEvent[];
  selectedStep: TimelineStep;
  onSelectStep: (step: TimelineStep) => void;
  peakDepthCm: number;
}

export const PredictedImpactTimeline: React.FC<PredictedImpactTimelineProps> = ({
  timelineEvents,
  selectedStep,
  onSelectStep,
  peakDepthCm,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: TimelineStep[] = ['NOW', '15m', '30m', '45m', '60m'];

  // Time-lapse auto progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentIndex = steps.indexOf(selectedStep);
      if (currentIndex < steps.length - 1) {
        onSelectStep(steps[currentIndex + 1]);
      } else {
        setIsPlaying(false);
        onSelectStep('NOW');
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlaying, selectedStep, onSelectStep]);

  const getStepProgress = (step: TimelineStep): number => {
    switch (step) {
      case 'NOW':
        return 0;
      case '15m':
        return 20;
      case '30m':
        return 40;
      case '45m':
        return 60;
      case '60m':
        return 80;
      case '120m':
      default:
        return 100;
    }
  };

  const getEventForStep = (step: TimelineStep) => {
    if (step === 'NOW') {
      return {
        title: 'Initial Precipitation & Runoff Ingress',
        description: 'Atmospheric front moving across the river catchment. Runoff begins entering urban retention ponds.',
        category: 'Baseline Condition',
        location: 'North River Basin & Catchment High Grounds',
        severity: 'LOW' as const
      };
    }

    const minutesMap: Record<string, 15 | 30 | 45 | 60> = {
      '15m': 15,
      '30m': 30,
      '45m': 45,
      '60m': 60,
    };
    const targetMin = minutesMap[step];
    return timelineEvents.find((e) => e.minutes === targetMin) || timelineEvents[0];
  };

  const activeEvent = getEventForStep(selectedStep);

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
      {/* Header with Play/Pause Time-lapse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Predicted Impact Timeline (Nowcast 0m → 60m)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Scenario-driven temporal projection showing the exact sequence of urban inundation, arterial closures, and facility threats.
          </p>
        </div>

        {/* Time-lapse Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE TIMELAPSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY TIMELAPSE</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectStep('NOW');
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
            title="Reset to current baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          {steps.map((st) => (
            <button
              key={st}
              onClick={() => {
                setIsPlaying(false);
                onSelectStep(st);
              }}
              className={`flex-1 py-2 px-1 text-center rounded-lg transition-all border ${
                selectedStep === st
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              {st === 'NOW' ? 'NOW (T=0)' : `${st.toUpperCase()}`}
            </button>
          ))}
        </div>

        {/* Continuous Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${Math.max(5, getStepProgress(selectedStep))}%` }}
          />
        </div>
      </div>

      {/* Selected Timeline Step Spotlight Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-300 uppercase">
              {selectedStep === 'NOW' ? 'CURRENT BASELINE' : `PROJECTED AT +${selectedStep}`}
            </span>
            <h4 className="text-sm font-bold text-white">{activeEvent.title}</h4>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto ${
              activeEvent.severity === 'CRITICAL'
                ? 'bg-red-950 text-red-300 border border-red-800'
                : activeEvent.severity === 'HIGH'
                ? 'bg-orange-950 text-orange-300 border border-orange-800'
                : activeEvent.severity === 'MODERATE'
                ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}
          >
            {activeEvent.severity} THREAT
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {activeEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <div>
            <span className="text-slate-500">Target Location: </span>
            <span className="text-slate-200">{activeEvent.location}</span>
          </div>
          <div>
            <span className="text-slate-500">Category: </span>
            <span className="text-cyan-300">{activeEvent.category}</span>
          </div>
          <div>
            <span className="text-slate-500">Model Depth Factor: </span>
            <span className="text-amber-300 font-bold">
              {selectedStep === 'NOW'
                ? '12 cm Initial'
                : selectedStep === '15m'
                ? '24 cm Pooling'
                : selectedStep === '30m'
                ? '38 cm Arterial Surcharge'
                : selectedStep === '45m'
                ? '50 cm Underpass Breach'
                : `${peakDepthCm} cm Peak Flood Crest`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
