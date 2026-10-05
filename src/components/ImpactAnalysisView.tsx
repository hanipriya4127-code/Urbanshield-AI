import React from 'react';
import {
  BarChart3,
  Users,
  Building,
  Coins,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingUp,
  MapPin,
  PieChart
} from 'lucide-react';
import { SimulationResult } from '../types';

interface ImpactAnalysisViewProps {
  simulation: SimulationResult;
}

export const ImpactAnalysisView: React.FC<ImpactAnalysisViewProps> = ({ simulation }) => {
  const { zones, populationAtRisk, predictedAffectedAreaKm2, riskScore, riskCategory, blockedRoadsCount, criticalFacilitiesAtRiskCount } =
    simulation;

  // Approximate economic loss model based on affected area, road blockages, and risk score
  const estimatedEconomicLossMillions = Number(
    ((riskScore / 100) * predictedAffectedAreaKm2 * 14.8 + blockedRoadsCount * 2.5).toFixed(1)
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Urban Flood Impact Assessment & Vulnerability Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantitative assessment of municipal population exposure, critical infrastructure vulnerabilities, and economic exposure.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total Surveyed Population:</span>
          <span className="text-white font-bold">309,500</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="text-xs text-slate-400 font-medium">Estimated Population Exposed</div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {populationAtRisk.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 font-mono">
            {((populationAtRisk / 309500) * 100).toFixed(1)}% of Urban Basin
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="text-xs text-slate-400 font-medium">Inundated Urban Area</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono tabular-nums">
            {predictedAffectedAreaKm2} km²
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Concentrated in Estuary Lowlands
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="text-xs text-slate-400 font-medium">Estimated Infrastructure Loss</div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono tabular-nums">
            ${estimatedEconomicLossMillions}M
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Direct & Disruption Cost Model
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="text-xs text-slate-400 font-medium">High / Critical Vulnerable Wards</div>
          <div className="text-2xl font-extrabold text-red-400 font-mono tabular-nums">
            {zones.filter((z) => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL').length} / {zones.length}
          </div>
          <div className="text-[11px] text-red-400 font-mono">
            Immediate Response Priority
          </div>
        </div>
      </div>

      {/* Ward-by-Ward Spatial Vulnerability Breakdown Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Municipal Ward Flood Risk & Vulnerability Matrix
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Ordered by Runoff Susceptibility
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Ward Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Elevation</th>
                <th className="py-2.5 px-3">Base Pop</th>
                <th className="py-2.5 px-3">Water Depth</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Estimated Evacuees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {zones
                .slice()
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((z) => {
                  const evacuees = Math.round(
                    z.riskLevel === 'CRITICAL' ? z.basePopulation * 0.65 :
                    z.riskLevel === 'HIGH' ? z.basePopulation * 0.35 :
                    z.riskLevel === 'MODERATE' ? z.basePopulation * 0.12 : 0
                  );

                  return (
                    <tr key={z.id} className="hover:bg-slate-850/50">
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">
                        {z.name}
                      </td>
                      <td className="py-2 px-3 text-slate-400">{z.category}</td>
                      <td className="py-2 px-3">{z.elevationMeters} m</td>
                      <td className="py-2 px-3">{z.basePopulation.toLocaleString()}</td>
                      <td className="py-2 px-3 text-cyan-300 font-bold">{z.predictedDepthCm} cm</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            z.riskLevel === 'CRITICAL'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : z.riskLevel === 'HIGH'
                              ? 'bg-orange-950 text-orange-300 border border-orange-800'
                              : z.riskLevel === 'MODERATE'
                              ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {z.riskLevel}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-amber-300 font-bold">
                        {evacuees > 0 ? evacuees.toLocaleString() : 'Nominal'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
