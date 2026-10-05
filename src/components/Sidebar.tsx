import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Waves,
  BarChart3,
  Navigation,
  Building2,
  AlertOctagon,
  GitCompare,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { RiskLevel } from '../types';

export type NavTab =
  | 'overview'
  | 'live-map'
  | 'flood-simulation'
  | 'impact-analysis'
  | 'safe-routes'
  | 'critical-facilities'
  | 'alerts'
  | 'scenario-comparison';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  riskCategory: RiskLevel;
  activeAlertsCount: number;
  blockedRoadsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  riskCategory,
  activeAlertsCount,
  blockedRoadsCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-map', label: 'Risk Map', icon: MapPin },
    { id: 'flood-simulation', label: 'Simulation', icon: Waves },
    { id: 'impact-analysis', label: 'Impact', icon: BarChart3 },
    {
      id: 'safe-routes',
      label: 'Routes',
      icon: Navigation,
      badge: blockedRoadsCount > 0 ? `${blockedRoadsCount} Blocked` : undefined,
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
    },
    { id: 'critical-facilities', label: 'Facilities', icon: Building2 },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertOctagon,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'text-red-400 bg-red-950/60 border-red-800/80',
    },
    { id: 'scenario-comparison', label: 'Comparison', icon: GitCompare },
  ];

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/60 border-red-800/80';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-800/80';
      case 'LOW':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
    }
  };

  const content = (
    <div className="flex flex-col h-full justify-between py-4 px-3 bg-slate-950 border-r border-slate-800/80">
      <div className="space-y-6">
        {/* Risk Status Indicator */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Urban Risk State</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${getRiskBadge(riskCategory)}`}>
              {riskCategory}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                riskCategory === 'CRITICAL'
                  ? 'bg-red-500 w-[92%]'
                  : riskCategory === 'HIGH'
                  ? 'bg-amber-500 w-[72%]'
                  : riskCategory === 'MODERATE'
                  ? 'bg-yellow-500 w-[45%]'
                  : 'bg-emerald-500 w-[20%]'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span>Nowcast Mode</span>
            <span>Spatial Model v2.4</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            Operations & Planning
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      item.badgeColor || 'text-slate-300 bg-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Disclaimer Footer Card */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
          <Info className="w-3.5 h-3.5" />
          <span>Decision Support</span>
        </div>
        <p className="leading-tight text-slate-400 text-[11px]">
          Hydrological nowcasting for municipal operations and emergency routing.
        </p>
        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
          Runoff Rational: Q = C · I · A
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 z-50 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
