import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Navigation
} from 'lucide-react';
import { AIInsightData, RiskLevel, SimulationParams } from '../types';

interface AIInsightPanelProps {
  insight: AIInsightData;
  params: SimulationParams;
  riskCategory: RiskLevel;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  insight,
  params,
  riskCategory,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans">
              AI Insight
            </h3>
            <p className="text-xs text-slate-400">
              Scenario nowcast for {params.rainfall}mm rainfall · {params.drainageBlockage}% blockage · {params.waterLevel} baseline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-cyan-400 font-bold">{insight.confidence}%</span>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* 1. Situation Summary */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Situation Summary
          </span>
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            {insight.summary}
          </p>
        </div>

        {/* 2. Main Risk */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Main Risk
          </span>
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            {insight.mainRisk || 'Arterial ponding and underpass submersion across low elevation zones.'}
          </p>
        </div>

        {/* 3. Predicted Consequence */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5" />
            Predicted Consequence
          </span>
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            {insight.predictedConsequence || 'Transit disruption on primary arterials with potential emergency access restriction.'}
          </p>
        </div>

        {/* 4. Recommended Action */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Recommended Action
          </span>
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            {insight.recommendedAction || insight.tacticalAdvice}
          </p>
        </div>
      </div>

      {/* Evacuation Routing Note */}
      <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-sans">
            <strong>Safe Route:</strong> {insight.routingAdvice}
          </span>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 shrink-0 hidden sm:inline">
          Interstate 80 Corridor Active
        </span>
      </div>
    </div>
  );
};
