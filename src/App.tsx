/**
 * UrbanShield AI
 * Urban Flood Nowcasting & Decision Support Platform
 * 
 * PREDICT → SIMULATE → ANALYZE → PROTECT → RESPOND
 */

import React, { useState, useTransition } from 'react';
import { Header } from './components/Header';
import { NavTab, Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { InteractiveMap } from './components/InteractiveMap';
import { SimulationPanel } from './components/SimulationPanel';
import { ChartsView } from './components/ChartsView';
import { FloodChainReaction } from './components/FloodChainReaction';
import { PredictedImpactTimeline } from './components/PredictedImpactTimeline';
import { AIInsightPanel } from './components/AIInsightPanel';
import { ImpactAnalysisView } from './components/ImpactAnalysisView';
import { SafeRoutesView } from './components/SafeRoutesView';
import { CriticalFacilitiesView } from './components/CriticalFacilitiesView';
import { AlertsView } from './components/AlertsView';
import { ScenarioComparisonView } from './components/ScenarioComparisonView';
import { OperationsCommandCenter } from './components/OperationsCommandCenter';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { LiveSimulationModal } from './components/LiveSimulationModal';
import { ApiConnectorsModal } from './components/ApiConnectorsModal';
import { SimulationParams, SimulationResult } from './types';
import { runFloodSimulation } from './services/simulationEngine';
import {
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';

export default function App() {
  // Standard benchmark parameters:
  // Rainfall = 120 mm, Drainage blockage = 40%, Water level = High, Duration = 60 minutes
  const [params, setParams] = useState<SimulationParams>({
    rainfall: 120,
    drainageBlockage: 40,
    waterLevel: 'High',
    duration: 60,
  });

  const [simulation, setSimulation] = useState<SimulationResult>(() =>
    runFloodSimulation({
      rainfall: 120,
      drainageBlockage: 40,
      waterLevel: 'High',
      duration: 60,
    })
  );

  const [pendingSimulation, setPendingSimulation] = useState<SimulationResult>(simulation);
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [lastUpdated, setLastUpdated] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [showLiveSimModal, setShowLiveSimModal] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleRunSimulation = (newParams: SimulationParams) => {
    setParams(newParams);
    const result = runFloodSimulation(newParams);
    setPendingSimulation(result);
    setShowLiveSimModal(true);
  };

  const handleLiveSimComplete = () => {
    startTransition(() => {
      setSimulation(pendingSimulation);
      setLastUpdated(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setShowLiveSimModal(false);
    });
  };

  const handleLoadBenchmarkPreset = () => {
    const benchmarkParams: SimulationParams = {
      rainfall: 120,
      drainageBlockage: 40,
      waterLevel: 'High',
      duration: 60,
    };
    handleRunSimulation(benchmarkParams);
  };

  const handleRefresh = () => {
    handleRunSimulation(params);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        alerts={simulation.activeAlerts}
        onLoadBenchmarkPreset={handleLoadBenchmarkPreset}
        currentParams={params}
        onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenConnectors={() => setIsConnectorsOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          riskCategory={simulation.riskCategory}
          activeAlertsCount={simulation.activeAlerts.length}
          blockedRoadsCount={simulation.blockedRoadsCount}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <OverviewDashboard
                simulation={simulation}
                onNavigateToTab={(tab) => setCurrentTab(tab as NavTab)}
                onLoadBenchmarkPreset={handleLoadBenchmarkPreset}
              />

              {/* Simulation Configuration Bar */}
              <div className="pt-2">
                <SimulationPanel
                  currentParams={params}
                  onRunSimulation={handleRunSimulation}
                  isRunning={isSimulating}
                />
              </div>

              {/* Charts Section */}
              <div className="pt-2">
                <ChartsView simulation={simulation} />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE RISK MAP */}
          {currentTab === 'live-map' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    Live GIS Hydrological Inundation & Routing Map
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Multi-layer spatial cartography showing flood-risk polygons, submerged roads, critical facilities, and safe evacuation corridors.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>Peak Inundation:</span>
                  <span className="text-cyan-400 font-bold">{simulation.peakInundationDepthCm} cm</span>
                </div>
              </div>

              <InteractiveMap
                zones={simulation.zones}
                roads={simulation.roads}
                facilities={simulation.facilities}
                safeRouteIds={simulation.safeRouteIds}
                peakDepthCm={simulation.peakInundationDepthCm}
                rerouteReason={simulation.dynamicRoutes.rerouteReason}
              />

              {/* Map Context Bar */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Click any zone, road line, or facility marker to inspect elevation and depth telemetry.
                  </span>
                </div>
                <button
                  onClick={() => setCurrentTab('safe-routes')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono font-medium"
                >
                  <span>Open Safe Evacuation Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FLOOD SIMULATION */}
          {currentTab === 'flood-simulation' && (
            <div className="space-y-6">
              <SimulationPanel
                currentParams={params}
                onRunSimulation={handleRunSimulation}
                isRunning={isSimulating}
              />

              <AIInsightPanel
                insight={simulation.aiInsight}
                params={params}
                riskCategory={simulation.riskCategory}
              />

              <FloodChainReaction
                chain={simulation.chainReaction}
                riskCategory={simulation.riskCategory}
              />

              <PredictedImpactTimeline
                timelineEvents={simulation.impactTimeline}
                selectedStep="NOW"
                onSelectStep={() => {}}
                peakDepthCm={simulation.peakInundationDepthCm}
              />

              <ChartsView simulation={simulation} />
            </div>
          )}

          {/* TAB 4: IMPACT ANALYSIS */}
          {currentTab === 'impact-analysis' && (
            <ImpactAnalysisView simulation={simulation} />
          )}

          {/* TAB 5: SAFE ROUTES */}
          {currentTab === 'safe-routes' && (
            <SafeRoutesView simulation={simulation} />
          )}

          {/* TAB 6: CRITICAL FACILITIES */}
          {currentTab === 'critical-facilities' && (
            <CriticalFacilitiesView simulation={simulation} />
          )}

          {/* TAB 7: ALERTS */}
          {currentTab === 'alerts' && (
            <AlertsView simulation={simulation} />
          )}

          {/* TAB 8: SCENARIO COMPARISON */}
          {currentTab === 'scenario-comparison' && (
            <ScenarioComparisonView
              currentSimulation={simulation}
              onApplyScenario={handleRunSimulation}
            />
          )}
        </main>
      </div>

      {/* 9-Step Live Simulation Sequence Modal (Requirement 4) */}
      <LiveSimulationModal
        isOpen={showLiveSimModal}
        params={params}
        result={pendingSimulation}
        onComplete={handleLiveSimComplete}
      />

      {/* Conversational AI Assistant Drawer with Voice (Requirements 2 & 3) */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        simulation={simulation}
      />

      {/* API Integration & IoT Architecture Modal (Requirement 5) */}
      <ApiConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
      />

      {/* Emergency Operations Command Center Fullscreen View */}
      {isCommandCenterOpen && (
        <OperationsCommandCenter
          simulation={simulation}
          onExit={() => setIsCommandCenterOpen(false)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}
    </div>
  );
}
