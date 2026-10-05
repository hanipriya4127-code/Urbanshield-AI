import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Building2,
  Car,
  Users,
  School,
  Factory,
  Radio,
  Send
} from 'lucide-react';
import { EmergencyPriorityItem, RiskLevel } from '../types';

interface EmergencyPriorityListProps {
  priorities: EmergencyPriorityItem[];
  riskCategory: RiskLevel;
  onNavigateToTab?: (tab: string) => void;
}

export const EmergencyPriorityList: React.FC<EmergencyPriorityListProps> = ({
  priorities,
  riskCategory,
  onNavigateToTab,
}) => {
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, boolean>>({});

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDispatch = (id: string) => {
    setDispatchStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setDispatchStatus((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-red-600 text-white font-extrabold shadow-red-950/50';
      case 2:
        return 'bg-orange-500 text-slate-950 font-bold';
      case 3:
        return 'bg-yellow-500 text-slate-950 font-bold';
      case 4:
        return 'bg-blue-600 text-white font-bold';
      default:
        return 'bg-slate-700 text-slate-200 font-bold';
    }
  };

  const getTierIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return Building2;
      case 2:
        return Car;
      case 3:
        return Users;
      case 4:
        return School;
      default:
        return Factory;
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-500/20 text-red-400 border border-red-500/40">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Dynamic Emergency Response Priority List
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked municipal intervention priorities dynamically calculated from nowcast submersion models.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Posture:</span>
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold uppercase">
            {riskCategory} RESPONSE
          </span>
        </div>
      </div>

      {/* Priority Cards List */}
      <div className="space-y-3">
        {priorities.map((item) => {
          const isAck = acknowledgedIds.includes(item.id);
          const isDispatched = dispatchStatus[item.id];
          const Icon = getTierIcon(item.rank);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isAck
                  ? 'bg-slate-950/60 border-slate-800 opacity-75'
                  : item.rank === 1
                  ? 'bg-red-950/30 border-red-800/80 shadow-md shadow-red-950/20'
                  : item.rank === 2
                  ? 'bg-orange-950/30 border-orange-800/70'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Rank badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shadow-md shrink-0 mt-0.5 ${getRankBadge(
                      item.rank
                    )}`}
                  >
                    P{item.rank}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                        {item.tier}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.location}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item.targetName}</span>
                    </h4>

                    <p className="text-xs text-amber-300/90 font-mono">
                      <span className="text-slate-400">Trigger: </span>
                      {item.triggerCondition}
                    </p>

                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      <span className="text-cyan-400 font-semibold font-mono">Directive: </span>
                      {item.recommendedResponse}
                    </p>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleDispatch(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      isDispatched
                        ? 'bg-emerald-600 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/20'
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DISPATCHED</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>DISPATCH UNITS</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAcknowledge(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                      isAck
                        ? 'bg-slate-800 text-emerald-400 border-emerald-800'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isAck ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
