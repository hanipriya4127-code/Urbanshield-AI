import React from 'react';
import {
  CloudRain,
  Sliders,
  Waves,
  AlertTriangle,
  Car,
  Building2,
  ShieldCheck,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ChainReactionNode, RiskLevel } from '../types';

interface FloodChainReactionProps {
  chain: ChainReactionNode[];
  riskCategory: RiskLevel;
}

export const FloodChainReaction: React.FC<FloodChainReactionProps> = ({
  chain,
  riskCategory,
}) => {
  const getStatusColor = (status: ChainReactionNode['status']) => {
    switch (status) {
      case 'Critical':
        return {
          bg: 'bg-red-950/70',
          border: 'border-red-600',
          badge: 'bg-red-600 text-white',
          text: 'text-red-300',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
          iconColor: 'text-red-400'
        };
      case 'Severe':
        return {
          bg: 'bg-orange-950/60',
          border: 'border-orange-500/80',
          badge: 'bg-orange-500 text-slate-950 font-bold',
          text: 'text-orange-300',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
          iconColor: 'text-orange-400'
        };
      case 'Strained':
        return {
          bg: 'bg-yellow-950/50',
          border: 'border-yellow-500/70',
          badge: 'bg-yellow-500 text-slate-950 font-bold',
          text: 'text-yellow-300',
          glow: 'shadow-[0_0_10px_rgba(234,179,8,0.12)]',
          iconColor: 'text-yellow-400'
        };
      default:
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-600/70',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-300',
          glow: 'shadow-[0_0_10px_rgba(16,185,129,0.1)]',
          iconColor: 'text-emerald-400'
        };
    }
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return CloudRain;
      case 1:
        return Sliders;
      case 2:
        return Waves;
      case 3:
        return AlertTriangle;
      case 4:
        return Car;
      case 5:
        return Building2;
      case 6:
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Flood Chain Reaction Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Causal propagation modeling how meteorological precipitation cascades through urban infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Cascade Impact:</span>
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-slate-800 border border-slate-700 text-cyan-300">
            {chain.length} Interconnected Nodes
          </span>
        </div>
      </div>

      {/* Innovation Quote Banner */}
      <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 font-sans flex items-start gap-2.5">
        <span className="text-cyan-400 font-bold font-mono text-sm leading-none mt-0.5">“</span>
        <p className="italic">
          UrbanShield AI doesn't just predict where flooding may happen. It predicts how the impact may spread and recommends what should happen next.
        </p>
      </div>

      {/* Connected Cascade Sequence (Responsive Grid / Flow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 relative">
        {chain.map((node, idx) => {
          const colors = getStatusColor(node.status);
          const Icon = getStepIcon(idx);
          const isLast = idx === chain.length - 1;

          return (
            <div key={node.id} className="relative flex flex-col justify-between">
              {/* Card Container */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col justify-between h-full transition-all duration-300 ${colors.bg} ${colors.border} ${colors.glow}`}
              >
                <div>
                  {/* Step Number & Status Badge */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      STEP 0{idx + 1}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${colors.badge}`}
                    >
                      {node.status}
                    </span>
                  </div>

                  {/* Icon & Stage Name */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className={`w-4 h-4 shrink-0 ${colors.iconColor}`} />
                    <h4 className="text-xs font-bold text-white leading-tight font-sans">
                      {node.stage}
                    </h4>
                  </div>

                  {/* Quantitative Metric */}
                  <div className="px-2 py-1 rounded bg-black/40 border border-white/10 text-center text-xs font-mono font-bold text-white mb-2">
                    {node.metric}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 leading-snug mb-3">
                    {node.description}
                  </p>
                </div>

                {/* Recommended Action Box */}
                <div className="pt-2 border-t border-white/10 text-[10px]">
                  <span className="text-slate-400 font-mono block mb-0.5">Action:</span>
                  <span className="text-cyan-200 font-medium leading-tight line-clamp-3">
                    {node.recommendedAction}
                  </span>
                </div>
              </div>

              {/* Connecting Chevron on Desktop */}
              {!isLast && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-cyan-400/80 pointer-events-none drop-shadow">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}

              {/* Connecting Chevron on Mobile/Tablet */}
              {!isLast && (
                <div className="flex lg:hidden justify-center my-1 text-cyan-400/80">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
