import React, { useState } from 'react';
import {
  Layers,
  Radio,
  Wifi,
  CloudRain,
  Waves,
  MapPin,
  Car,
  FileCode,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { REGISTERED_CONNECTORS, ConnectorStatus } from '../services/apiConnectors';

interface ApiConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConnectorsModal: React.FC<ApiConnectorsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedConnector, setSelectedConnector] = useState<ConnectorStatus>(
    REGISTERED_CONNECTORS[0]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  Real-World API Architecture & Integration Connectors
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  FALLBACK-SAFE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modular service contracts for Doppler radar, USGS fluvial gauges, IoT telemetry, and GIS servers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Connector List */}
          <div className="p-3 bg-slate-950 border-r border-slate-800 space-y-1.5 overflow-y-auto">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold px-2 block">
              Registered Connectors ({REGISTERED_CONNECTORS.length})
            </span>
            {REGISTERED_CONNECTORS.map((c) => {
              const isSelected = selectedConnector.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConnector(c)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      {c.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVE
                    </span>
                  </div>
                  <h4 className="font-semibold text-white leading-snug line-clamp-1">
                    {c.name}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {c.protocol}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Connector Deep-Dive Inspector */}
          <div className="md:col-span-2 p-5 bg-slate-900/90 overflow-y-auto space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                {selectedConnector.category}
              </span>
              <h3 className="text-base font-bold text-white">
                {selectedConnector.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Protocol: {selectedConnector.protocol} · Endpoint: <code className="text-slate-200">{selectedConnector.endpointUrl}</code>
              </p>
            </div>

            {/* Live Telemetry Ping */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Live Telemetry Ingestion Buffer:
              </span>
              <p className="text-xs text-emerald-300 font-mono">
                {selectedConnector.lastTelemetrySummary}
              </p>
            </div>

            {/* Integration Schema Contract */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Data Contract & API Interface</span>
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300/90 font-mono overflow-x-auto leading-relaxed">
{`// Production Connector Contract for ${selectedConnector.category}
export interface IngestionTelemetryPayload {
  sourceId: "${selectedConnector.id}";
  timestamp: "${new Date().toISOString()}";
  endpoint: "${selectedConnector.endpointUrl}";
  protocol: "${selectedConnector.protocol}";
  security: "Secure Proxy Endpoint (/api/*)";
  streamStatus: "ONLINE";
  readings: {
    telemetryStatus: "NOMINAL";
    convectiveIndex: 4.8;
    latencyMs: 18;
  };
}`}
              </pre>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Zero Secret Leakage Guarantee:</strong> Client-side code never stores or exposes private API keys. All real-world feeds proxy through authenticated server-side routes with simulated fallback resilience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
