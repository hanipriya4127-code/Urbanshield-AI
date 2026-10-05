import React, { useState } from 'react';
import {
  TrendingUp,
  CloudRain,
  Waves,
  Activity,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { RiskLevel, SimulationResult } from '../types';

interface ChartsViewProps {
  simulation: SimulationResult;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ simulation }) => {
  const [activeSectorIndex, setActiveSectorIndex] = useState<number | null>(null);

  const { rainfallTimeSeries, riskTimeSeries, waterLevelTimeSeries, riskProgressionBySector } =
    simulation;

  // Max heights and scales for clean SVG rendering
  const maxRain = Math.max(...rainfallTimeSeries.map((d) => Math.max(d.pastMm, d.forecastMm)), 60);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Nowcasting Analytics & Temporal Trends
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal projections across a 120-minute forward window with hydrologic gauge benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Time Resolution: 15-Minute Intervals</span>
        </div>
      </div>

      {/* 2x2 Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CHART 1: Rainfall Trend (Hyetograph) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Rainfall Hyetograph Trend (mm)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span> Recorded
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Forecast Nowcast
              </span>
            </div>
          </div>

          {/* SVG Bar / Area Chart */}
          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(51, 65, 85, 0.4)" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(51, 65, 85, 0.4)" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(71, 85, 105, 0.8)" />

              {/* Y-Axis Labels */}
              <text x="32" y="24" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {Math.round(maxRain)}mm
              </text>
              <text x="32" y="80" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {Math.round(maxRain / 2)}mm
              </text>
              <text x="32" y="140" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                0
              </text>

              {/* Bars */}
              {rainfallTimeSeries.map((pt, i) => {
                const x = 70 + i * 58;
                const pastHeight = (pt.pastMm / maxRain) * 115;
                const forecastHeight = (pt.forecastMm / maxRain) * 115;

                return (
                  <g key={pt.time} className="group cursor-pointer">
                    {/* Past bar */}
                    {pt.pastMm > 0 && (
                      <rect
                        x={x - 12}
                        y={140 - pastHeight}
                        width="11"
                        height={pastHeight}
                        rx="2"
                        fill="#475569"
                        className="group-hover:fill-slate-300 transition-colors"
                      />
                    )}
                    {/* Forecast bar */}
                    {pt.forecastMm > 0 && (
                      <rect
                        x={x + 1}
                        y={140 - forecastHeight}
                        width="11"
                        height={forecastHeight}
                        rx="2"
                        fill="#06b6d4"
                        className="group-hover:fill-cyan-300 transition-colors"
                      />
                    )}

                    {/* Value on hover */}
                    <text
                      x={x}
                      y={140 - Math.max(pastHeight, forecastHeight) - 6}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {pt.pastMm || pt.forecastMm}mm
                    </text>

                    {/* X-axis label */}
                    <text
                      x={x}
                      y="154"
                      fill={pt.time === 'Now' ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={pt.time === 'Now' ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Peak Forecast Intensity: {simulation.params.rainfall} mm/hr</span>
            <span>Convective Front</span>
          </div>
        </div>

        {/* CHART 2: Flood-Risk Trend */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Flood Risk Score Trajectory (0 - 100)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              Current: {simulation.riskScore} · {simulation.riskCategory}
            </span>
          </div>

          {/* SVG Line / Spline Chart */}
          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Background Danger Threshold Band (High & Critical > 55) */}
              <rect x="40" y="20" width="440" height="35" fill="rgba(239, 68, 68, 0.08)" />
              <rect x="40" y="55" width="440" height="35" fill="rgba(249, 115, 22, 0.06)" />

              {/* Threshold lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(239, 68, 68, 0.5)" strokeDasharray="3 3" />
              <text x="475" y="17" fill="#ef4444" fontSize="8" textAnchor="end" fontFamily="monospace">
                CRITICAL THRESHOLD (80)
              </text>

              <line x1="40" y1="55" x2="480" y2="55" stroke="rgba(249, 115, 22, 0.5)" strokeDasharray="3 3" />
              <text x="475" y="52" fill="#f97316" fontSize="8" textAnchor="end" fontFamily="monospace">
                HIGH RISK THRESHOLD (55)
              </text>

              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(71, 85, 105, 0.8)" />

              {/* Construct Line Path */}
              {(() => {
                const points = riskTimeSeries.map((pt, i) => {
                  const x = 70 + i * 58;
                  const y = 140 - (pt.score / 100) * 115;
                  return { x, y, ...pt };
                });

                const pathD = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                return (
                  <>
                    {/* Fill Area Gradient */}
                    <path d={areaD} fill="rgba(245, 158, 11, 0.15)" />
                    {/* Main Line */}
                    <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Points */}
                    {points.map((p) => (
                      <g key={p.time} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={p.time === 'Now' ? 5.5 : 4}
                          fill={p.time === 'Now' ? '#38bdf8' : '#f59e0b'}
                          stroke="#0f172a"
                          strokeWidth="2"
                          className="hover:scale-125 transition-transform"
                        />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {p.score}
                        </text>
                        <text
                          x={p.x}
                          y="154"
                          fill={p.time === 'Now' ? '#38bdf8' : '#94a3b8'}
                          fontSize="9"
                          fontWeight={p.time === 'Now' ? 'bold' : 'normal'}
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {p.time}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Projection Model: +30m ({simulation.predicted30mRisk.score}) · +60m ({simulation.predicted60mRisk.score}) · +120m ({simulation.predicted120mRisk.score})</span>
            <span className="text-amber-400 font-semibold">{simulation.riskCategory}</span>
          </div>
        </div>

        {/* CHART 3: Water-Level Trend (Hydrologic Gauges) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Water Level vs Danger Crest (Meters)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-amber-400">Warning: 4.2m</span>
              <span className="text-red-400">Danger: 5.0m</span>
            </div>
          </div>

          {/* SVG Line / Bar Water Chart */}
          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Max level reference = 6.0m */}
              {/* Danger 5.0m line */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="475" y="36" fill="#ef4444" fontSize="8" textAnchor="end" fontFamily="monospace">
                DANGER CREST (5.0m)
              </text>

              {/* Warning 4.2m line */}
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="475" y="56" fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">
                WARNING STAGE (4.2m)
              </text>

              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(71, 85, 105, 0.8)" />

              {/* Gauge Curve */}
              {(() => {
                const maxLevel = 6.0;
                const points = waterLevelTimeSeries.map((pt, i) => {
                  const x = 70 + i * 70;
                  const y = 140 - (pt.riverLevelM / maxLevel) * 120;
                  return { x, y, ...pt };
                });

                const pathD = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                return (
                  <>
                    <path d={areaD} fill="rgba(14, 165, 233, 0.18)" />
                    <path d={pathD} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />

                    {points.map((p) => {
                      const isDanger = p.riverLevelM >= 5.0;
                      const isWarning = p.riverLevelM >= 4.2;

                      return (
                        <g key={p.time} className="group cursor-pointer">
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="4.5"
                            fill={isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8'}
                            stroke="#0f172a"
                            strokeWidth="2"
                          />
                          <text
                            x={p.x}
                            y={p.y - 8}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {p.riverLevelM.toFixed(2)}m
                          </text>
                          <text
                            x={p.x}
                            y="154"
                            fill={p.time === 'Now' ? '#38bdf8' : '#94a3b8'}
                            fontSize="9"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {p.time}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Primary Sensor: North Fluvial Gauge NF-01</span>
            <span className="text-cyan-400">Peak Surge: +60 min</span>
          </div>
        </div>

        {/* CHART 4: Risk Progression by Municipal Sector */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Sector-by-Sector Inundation Timeline
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Hover row to inspect
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-6 text-[10px] font-mono text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <div className="col-span-2">Ward / Sector</div>
              <div className="text-center">T=0</div>
              <div className="text-center">+15m</div>
              <div className="text-center">+30m</div>
              <div className="text-center">+60m</div>
            </div>

            {riskProgressionBySector.map((sec, idx) => {
              const getColor = (val: number) => {
                if (val >= 80) return 'bg-red-500/80 text-white';
                if (val >= 55) return 'bg-orange-500/80 text-white';
                if (val >= 30) return 'bg-yellow-500/80 text-slate-950';
                return 'bg-emerald-500/60 text-white';
              };

              return (
                <div
                  key={sec.sector}
                  onMouseEnter={() => setActiveSectorIndex(idx)}
                  onMouseLeave={() => setActiveSectorIndex(null)}
                  className={`grid grid-cols-6 items-center py-1.5 px-2 rounded-lg text-xs font-mono transition-colors ${
                    activeSectorIndex === idx ? 'bg-slate-800/80' : 'hover:bg-slate-850'
                  }`}
                >
                  <div className="col-span-2 truncate text-slate-200 font-sans text-[11px]">
                    {sec.sector}
                  </div>
                  <div className="flex justify-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getColor(sec.t0)}`}>
                      {sec.t0}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getColor(sec.t15)}`}>
                      {sec.t15}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getColor(sec.t30)}`}>
                      {sec.t30}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getColor(sec.t60)}`}>
                      {sec.t60}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>East Estuary & South Bay exhibit acute surge</span>
            <span className="text-emerald-400 font-medium">Uplands Remain Clear</span>
          </div>
        </div>
      </div>
    </div>
  );
};
