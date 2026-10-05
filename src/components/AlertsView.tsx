import React, { useState } from 'react';
import {
  AlertOctagon,
  Radio,
  Send,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Volume2,
  AlertTriangle,
  FileCode,
  Info
} from 'lucide-react';
import { ActiveAlert, RiskLevel, SimulationResult } from '../types';

interface AlertsViewProps {
  simulation: SimulationResult;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ simulation }) => {
  const { activeAlerts, riskCategory } = simulation;

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [testBroadcastSent, setTestBroadcastSent] = useState(false);

  const filteredAlerts = activeAlerts.filter((a) => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const handleSimulateBroadcast = () => {
    setTestBroadcastSent(true);
    setTimeout(() => setTestBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            Emergency Warning Broadcast & Common Alerting Protocol (CAP)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Public warning syndication, cellular broadcast integration, and multi-channel siren activation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-mono text-xs flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Simulated / Modeled Output Only</span>
          </span>
        </div>
      </div>

      {/* Broadcast Trigger Panel & Notice */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Emergency Public Broadcast Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Current system posture is ready to syndicate CAP XML payloads to Wireless Emergency Alerts (WEA) and siren networks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MODERATE">Moderate Only</option>
          </select>

          <button
            onClick={handleSimulateBroadcast}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
              testBroadcastSent
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/30'
            }`}
          >
            {testBroadcastSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>SYNDICATED TO CELLS</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>TEST CAP DISPATCH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Alerts Feed + Cellular Alert Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Alerts List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Active Warning Records ({filteredAlerts.length})
            </span>
            <span className="text-xs text-slate-400 font-mono">
              UrbanShield AI Engine
            </span>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/60" />
                No alerts matching the selected filter.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-800 text-red-200'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-950/30 border-amber-800 text-amber-200'
                      : 'bg-cyan-950/30 border-cyan-800 text-cyan-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-white">{alert.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/40 border border-white/20">
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs">
                    {alert.instruction}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono opacity-80">
                    <div>
                      <span className="text-slate-400">Target Area:</span> {alert.affectedArea}
                    </div>
                    <div>
                      <span className="text-slate-400">Issued:</span> {alert.issuedAt}
                    </div>
                    <div>
                      <span className="text-slate-400">Duration:</span> {alert.expiresInMinutes}m window
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Mobile Phone Cellular Preview & CAP Protocol Payload */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Cellular Broadcast Preview (WEA)
              </span>
            </div>

            {/* Mobile Device Screen Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>9:41 AM</span>
                <span>5G · 100%</span>
              </div>

              {/* Push Banner */}
              <div className="p-3 rounded-xl bg-red-950 border border-red-700 text-red-100 space-y-1.5 shadow-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-300">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>EMERGENCY ALERT: FLASH FLOOD</span>
                </div>
                <p className="text-xs font-medium text-white leading-snug">
                  Flash Flood Emergency in East Estuary Lowlands. Submersion approaching 50cm. Avoid underpasses. Evacuate to Lincoln Heights Shelter A via Interstate 80.
                </p>
                <div className="text-[10px] text-red-300 font-mono pt-1">
                  Issued by UrbanShield AI · Municipal Civil Protection
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center font-mono">
                [Simulated Emergency Tone Active]
              </div>
            </div>
          </div>

          {/* CAP XML Snippet */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono tracking-wider">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>CAP v1.2 Payload Header</span>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300/80 font-mono overflow-x-auto">
{`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>URBANSHIELD-${Date.now().toString().slice(-6)}</identifier>
  <sender>civil-defense@metro.gov</sender>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Flash Flood</event>
    <urgency>Immediate</urgency>
    <severity>${riskCategory}</severity>
    <certainty>Observed</certainty>
  </info>
</alert>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
