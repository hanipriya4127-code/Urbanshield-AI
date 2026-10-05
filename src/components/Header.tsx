import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  Bot,
  Maximize2,
  Wifi,
  Sparkles
} from 'lucide-react';
import { ActiveAlert, SimulationParams } from '../types';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  alerts: ActiveAlert[];
  onLoadBenchmarkPreset: () => void;
  currentParams: SimulationParams;
  onToggleMobileMenu?: () => void;
  onOpenCommandCenter?: () => void;
  onOpenAssistant?: () => void;
  onOpenConnectors?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  onRefresh,
  alerts,
  onLoadBenchmarkPreset,
  currentParams,
  onToggleMobileMenu,
  onOpenCommandCenter,
  onOpenAssistant,
  onOpenConnectors,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isBenchmarkActive =
    currentParams.rainfall === 120 &&
    currentParams.drainageBlockage === 40 &&
    currentParams.waterLevel === 'High' &&
    currentParams.duration === 60;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              UrbanShield AI
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              TELEMETRY LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Urban Flood Nowcasting & Decision Support
          </p>
        </div>
      </div>

      {/* Middle Status & Interactive Actions */}
      <div className="hidden lg:flex items-center gap-2.5">
        <button
          onClick={onLoadBenchmarkPreset}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isBenchmarkActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
          }`}
          title="Load standard benchmark event: 120mm rainfall with 40% blockage"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Benchmark Event</span>
          {isBenchmarkActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          )}
        </button>

        {/* Data Feeds Modal trigger */}
        <button
          onClick={onOpenConnectors}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          title="Telemetry and sensor feeds"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sensor Feeds</span>
        </button>

        {/* Command Center View trigger */}
        <button
          onClick={onOpenCommandCenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-xs font-medium text-cyan-300 transition-all"
          title="Expand Command Center Overview"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Command View</span>
        </button>
      </div>

      {/* Right Controls, Assistant & Notifications */}
      <div className="flex items-center gap-2">
        {/* Assistant button */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all"
          title="Open Decision Assistant"
        >
          <Bot className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Assistant</span>
        </button>

        {/* Last updated indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Updated:</span>
          <span className="text-slate-200 tabular-nums">{lastUpdated}</span>
          <button
            onClick={handleManualRefresh}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Re-sync telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg border transition-all ${
              showNotifications
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold font-mono text-white bg-red-600 rounded-full">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Emergency Broadcasts ({alerts.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Simulated Feed
                </span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/60" />
                    No active emergency warnings currently triggered.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-950/40 border-red-800/80 text-red-200'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                          : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-1">{alert.title}</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/40">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 line-clamp-2 mb-1.5">
                        {alert.instruction}
                      </p>
                      <div className="flex items-center justify-between text-[10px] opacity-60 font-mono">
                        <span>Zone: {alert.affectedArea}</span>
                        <span>{alert.issuedAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                <span>Model Output · Decision Support Only</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-cyan-400 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
