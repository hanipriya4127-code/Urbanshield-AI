import React, { useState, useId, useEffect } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Shield,
  Building2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Compass,
  Waves,
  MapPin,
  X,
  Play,
  Pause,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  CriticalFacility,
  RiskLevel,
  RoadSegment,
  TimelineStep,
  ZoneRisk
} from '../types';

interface InteractiveMapProps {
  zones: ZoneRisk[];
  roads: RoadSegment[];
  facilities: CriticalFacility[];
  safeRouteIds: string[];
  peakDepthCm: number;
  externalStep?: TimelineStep;
  onStepChange?: (step: TimelineStep) => void;
  rerouteReason?: string;
}

type BasemapStyle = 'dark' | 'hydro' | 'satellite';
type ActiveRouteOption = 'CURRENT_SHORTEST' | 'PREDICTED_RISK' | 'RECOMMENDED_SAFE';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  zones,
  roads,
  facilities,
  safeRouteIds,
  peakDepthCm,
  externalStep = 'NOW',
  onStepChange,
  rerouteReason = 'Route changed because Riverwalk Boulevard & Underpass is predicted to become high risk with water depth exceeding 48 cm within 45 minutes.',
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [basemap, setBasemap] = useState<BasemapStyle>('dark');

  // Active time-lapse step (NOW, 15m, 30m, 45m, 60m, 120m)
  const [currentStep, setCurrentStep] = useState<TimelineStep>(externalStep);
  const [isPlayingTimelapse, setIsPlayingTimelapse] = useState(false);

  // Active Evacuation Route Choice on Map
  const [activeRoute, setActiveRoute] = useState<ActiveRouteOption>('RECOMMENDED_SAFE');

  // Layer Visibility (Useful Controls: Risk, Flood Spread, Roads, Facilities, Safe Route)
  const [showRisk, setShowRisk] = useState(true);
  const [showFloodSpread, setShowFloodSpread] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(true);

  // Inspector Selection
  const [selectedZone, setSelectedZone] = useState<ZoneRisk | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<CriticalFacility | null>(null);

  const patternId = useId();

  // Sync external step if provided
  useEffect(() => {
    if (externalStep) {
      setCurrentStep(externalStep);
    }
  }, [externalStep]);

  // Automated time-lapse player
  const timelineSteps: TimelineStep[] = ['NOW', '15m', '30m', '45m', '60m', '120m'];
  useEffect(() => {
    if (!isPlayingTimelapse) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextIdx = timelineSteps.indexOf(prev) + 1;
        if (nextIdx < timelineSteps.length) {
          const nextStep = timelineSteps[nextIdx];
          onStepChange?.(nextStep);
          return nextStep;
        } else {
          setIsPlayingTimelapse(false);
          return 'NOW';
        }
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlayingTimelapse, onStepChange]);

  const handleStepSelect = (step: TimelineStep) => {
    setIsPlayingTimelapse(false);
    setCurrentStep(step);
    onStepChange?.(step);
  };

  // Pan and drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setZoom((z) => Math.min(2.4, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, z - 0.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedZone(null);
    setSelectedRoad(null);
    setSelectedFacility(null);
  };

  // Water movement & expansion factor by time step
  const getStepScale = () => {
    switch (currentStep) {
      case 'NOW':
        return 0.45;
      case '15m':
        return 0.65;
      case '30m':
        return 0.82;
      case '45m':
        return 0.94;
      case '60m':
        return 1.0;
      case '120m':
      default:
        return 1.15;
    }
  };

  const stepScale = getStepScale();

  const getZoneFill = (level: RiskLevel) => {
    const alpha = (base: number) => Math.min(0.85, Number((base * stepScale).toFixed(2)));
    switch (level) {
      case 'CRITICAL':
        return `rgba(239, 68, 68, ${alpha(0.65)})`;
      case 'HIGH':
        return `rgba(249, 115, 22, ${alpha(0.55)})`;
      case 'MODERATE':
        return `rgba(234, 179, 8, ${alpha(0.40)})`;
      case 'LOW':
        return `rgba(16, 185, 129, ${alpha(0.25)})`;
    }
  };

  const getZoneStroke = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#EF4444';
      case 'HIGH':
        return '#F97316';
      case 'MODERATE':
        return '#EAB308';
      case 'LOW':
        return '#10B981';
    }
  };

  const getRoadColor = (road: RoadSegment) => {
    if (currentStep === 'NOW') {
      return road.elevationMeters <= 3 ? '#EAB308' : '#38BDF8';
    }
    if (currentStep === '15m') {
      return road.elevationMeters <= 2.5 ? '#F97316' : '#38BDF8';
    }
    switch (road.status) {
      case 'Blocked':
        return '#EF4444';
      case 'High Risk':
        return '#F97316';
      case 'Caution':
        return '#EAB308';
      case 'Passable':
        return '#38BDF8';
    }
  };

  // Coordinates for the 3 routes
  const shortestRoutePoints = '720,390 660,320 580,260 440,280 350,340 280,270 140,290';
  const predictedRiskRoutePoints = '720,390 630,260 440,280 310,210 220,200 140,290';
  const recommendedSafeRoutePoints = '750,75 640,75 420,90 220,110 90,140 110,240 140,290';

  return (
    <div className="relative w-full h-[660px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 select-none shadow-2xl flex flex-col">
      {/* 1. Top Map Toolbar - Keep only useful controls: Risk, Flood Spread, Roads, Facilities, Safe Route */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg text-xs">
          <span className="px-2 py-1 text-slate-400 font-mono text-[11px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Controls:
          </span>
          <button
            onClick={() => setShowRisk(!showRisk)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              showRisk
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk
          </button>
          <button
            onClick={() => setShowFloodSpread(!showFloodSpread)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              showFloodSpread
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flood Spread
          </button>
          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              showRoads
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Roads
          </button>
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              showFacilities
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Facilities
          </button>
          <button
            onClick={() => setShowSafeRoute(!showSafeRoute)}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              showSafeRoute
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Safe Route
          </button>
        </div>
      </div>

      {/* 2. Floating Time-Lapse Scrubber & Water-Movement Progression (Top Center/Left) */}
      <div className="absolute top-16 left-3 right-3 sm:right-auto z-20 pointer-events-auto flex flex-col gap-2">
        <div className="p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-2xl flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 pr-2 border-r border-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>WATER SPREAD NOWCAST:</span>
          </div>

          {/* Step buttons */}
          <div className="flex items-center gap-1">
            {timelineSteps.map((st) => (
              <button
                key={st}
                onClick={() => handleStepSelect(st)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  currentStep === st
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Timelapse toggle */}
          <button
            onClick={() => setIsPlayingTimelapse(!isPlayingTimelapse)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
              isPlayingTimelapse
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
            }`}
          >
            {isPlayingTimelapse ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>ANIMATE SPREAD</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Route Switcher Pill (Interactive Route State Selector) */}
        {showSafeRoute && (
          <div className="p-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-2xl flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-slate-400 pl-1 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Safe Route Mode:
            </span>
            <button
              onClick={() => setActiveRoute('CURRENT_SHORTEST')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                activeRoute === 'CURRENT_SHORTEST'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              1. Current Shortest (At Risk)
            </button>
            <button
              onClick={() => setActiveRoute('PREDICTED_RISK')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                activeRoute === 'PREDICTED_RISK'
                  ? 'bg-orange-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              2. Predicted-Risk Route
            </button>
            <button
              onClick={() => setActiveRoute('RECOMMENDED_SAFE')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                activeRoute === 'RECOMMENDED_SAFE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              3. Recommended Safe Route
            </button>
          </div>
        )}
      </div>

      {/* 3. Floating Re-route Reason Banner (Top Center/Right) */}
      {showSafeRoute && (
        <div className="absolute top-36 left-3 right-3 sm:right-auto sm:max-w-md z-20 pointer-events-auto p-3 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-600/70 shadow-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>AI NOWCAST REROUTING DIRECTIVE</span>
          </div>
          <p className="text-white font-semibold text-xs leading-snug">
            “Route changed due to predicted flood risk.”
          </p>
          <p className="text-slate-300 leading-snug text-[11px]">
            {rerouteReason}
          </p>
        </div>
      )}

      {/* Floating Zoom & Reset Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Reset map view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:block p-3 rounded-lg bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl max-w-xs text-xs space-y-2">
        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between border-b border-slate-800 pb-1">
          <span>GIS Map Legend</span>
          <span className="text-[10px] text-cyan-400">Step: {currentStep}</span>
        </div>

        {/* Risk Levels */}
        <div>
          <div className="text-[10px] text-slate-400 mb-1">Flood Inundation Risk:</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500/70 border border-red-400"></span>
              <span className="text-slate-300">CRITICAL (&gt;50cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-500/70 border border-orange-400"></span>
              <span className="text-slate-300">HIGH (25-50cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-yellow-500/70 border border-yellow-400"></span>
              <span className="text-slate-300">MODERATE (10-25cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/70 border border-emerald-400"></span>
              <span className="text-slate-300">LOW (&lt;10cm)</span>
            </div>
          </div>
        </div>

        {/* Routes & Evacuation */}
        <div className="pt-1 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-400 mb-1">Route Network & States:</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 bg-red-500 border border-red-300"></span>
              <span className="text-red-300 font-mono">1. Shortest (Flooded)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 bg-orange-400 border border-orange-200"></span>
              <span className="text-orange-300 font-mono">2. Predicted Risk</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="w-4 h-1.5 bg-emerald-400 border border-emerald-200 animate-pulse"></span>
              <span className="text-emerald-300 font-bold font-mono">3. Recommended Safe Corridor (I-80)</span>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 text-[9px] flex items-center justify-center font-bold text-white">H</span>
            Hospital
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-amber-600 text-[9px] flex items-center justify-center font-bold text-white">S</span>
            School/Shelter
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-red-600 text-[9px] flex items-center justify-center font-bold text-white">F</span>
            Fire
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-indigo-600 text-[9px] flex items-center justify-center font-bold text-white">P</span>
            Police
          </span>
        </div>
      </div>

      {/* SVG Canvas Interactive Area */}
      <div
        className="w-full flex-1 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
            </pattern>

            {/* Inundation Glow Filters */}
            <filter id="critical-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* River Gradient */}
            <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0369a1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
            </linearGradient>

            {/* Risk Heatmap Gradients */}
            <radialGradient id="heat-critical" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="65%" stopColor="#eab308" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>

            {/* Directional Flow Markers */}
            <marker id="water-vector" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" opacity="0.9" />
            </marker>

            <marker id="urgent-flow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#F97316" opacity="0.9" />
            </marker>
          </defs>

          {/* Basemap Fill & Grid */}
          <rect
            width="800"
            height="600"
            fill={
              basemap === 'dark'
                ? '#090e17'
                : basemap === 'hydro'
                ? '#061325'
                : '#0b1622'
            }
          />
          <rect width="800" height="600" fill={`url(#${patternId})`} />

          {/* Elevation Contours (West Ridge Uplands) */}
          {showFloodSpread && (
            <g opacity="0.4" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" fill="none">
              <ellipse cx="120" cy="220" rx="90" ry="160" strokeDasharray="3 3" />
              <ellipse cx="110" cy="220" rx="65" ry="120" strokeDasharray="4 2" />
              <ellipse cx="100" cy="220" rx="40" ry="70" />
              <text x="75" y="150" fill="rgba(148, 163, 184, 0.6)" fontSize="9" fontFamily="monospace">
                +18m Elevation Ridge
              </text>
            </g>
          )}

          {/* Natural River Course & Lowland Estuary */}
          <path
            d="M 280,0 C 310,120 340,240 370,360 C 410,480 620,530 800,550 L 800,600 L 520,600 C 400,580 320,440 280,310 C 250,200 230,80 220,0 Z"
            fill="url(#river-gradient)"
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          <path
            d="M 680,180 C 720,240 750,380 770,540 L 800,540 L 800,180 Z"
            fill="url(#river-gradient)"
            opacity="0.8"
          />

          {/* Risk Heatmap / Flood Spread Overlay */}
          {showFloodSpread && (
            <g className="pointer-events-none mix-blend-screen opacity-70 transition-all duration-500">
              <ellipse cx="680" cy="220" rx={140 * stepScale} ry={100 * stepScale} fill="url(#heat-critical)" />
              <ellipse cx="670" cy="420" rx={160 * stepScale} ry={120 * stepScale} fill="url(#heat-critical)" />
              <ellipse cx="480" cy="360" rx={130 * stepScale} ry={90 * stepScale} fill="url(#heat-high)" />
              <ellipse cx="260" cy="110" rx={110 * stepScale} ry={70 * stepScale} fill="url(#heat-high)" />
            </g>
          )}

          {/* 1. FLOOD-RISK ZONES (Animated Gradual Spread by 15m -> 30m -> 45m -> 60m) */}
          {showRisk &&
            zones.map((zone) => {
              const pointsStr = zone.polygon.map((p) => p.join(',')).join(' ');
              const isSelected = selectedZone?.id === zone.id;
              const isCritical = zone.riskLevel === 'CRITICAL';
              const fill = getZoneFill(zone.riskLevel);
              const stroke = getZoneStroke(zone.riskLevel);

              return (
                <g key={zone.id} className="cursor-pointer group">
                  <polygon
                    points={pointsStr}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : isCritical ? 2.2 : 1.2}
                    filter={isCritical ? 'url(#critical-glow)' : undefined}
                    onClick={() => {
                      setSelectedZone(zone);
                      setSelectedRoad(null);
                      setSelectedFacility(null);
                    }}
                    className="transition-all duration-500 hover:brightness-125"
                  />
                  <text
                    x={zone.polygon[0][0] + 20}
                    y={zone.polygon[0][1] + 35}
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow-md"
                  >
                    {zone.name}
                  </text>
                  <text
                    x={zone.polygon[0][0] + 20}
                    y={zone.polygon[0][1] + 48}
                    fill={stroke}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {zone.riskLevel} · {Math.round(zone.predictedDepthCm * stepScale)}cm
                  </text>
                </g>
              );
            })}

          {/* 2. DIRECTIONAL WATER MOVEMENT VECTORS (Speed & pulse depend on time step) */}
          {showFloodSpread && (
            <g className="pointer-events-none">
              {/* Fluvial Surge along the main river channel */}
              <line x1="260" y1="60" x2="290" y2="150" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#water-vector)" className="animate-pulse" />
              <line x1="320" y1="220" x2="350" y2="320" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#water-vector)" className="animate-pulse" />
              <line x1="390" y1="410" x2="520" y2="490" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="8 4" markerEnd="url(#water-vector)" className="animate-pulse" />
              <line x1="560" y1="510" x2="710" y2="540" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="8 4" markerEnd="url(#water-vector)" className="animate-pulse" />

              {/* Surface runoff from upland foothills down into urban basin */}
              <line x1="160" y1="240" x2="240" y2="280" stroke="#60A5FA" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#water-vector)" />
              <line x1="180" y1="360" x2="260" y2="410" stroke="#60A5FA" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#water-vector)" />
              <line x1="480" y1="210" x2="410" y2="290" stroke="#60A5FA" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#water-vector)" />

              {/* Acute surcharge into East Estuary & South Bay Lowlands */}
              <line x1="620" y1="240" x2="680" y2="340" stroke="#F97316" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#urgent-flow)" />
              <line x1="600" y1="380" x2="650" y2="460" stroke="#EF4444" strokeWidth="2.8" strokeDasharray="6 3" markerEnd="url(#urgent-flow)" />
            </g>
          )}

          {/* 3. ROADS NETWORK */}
          {showRoads &&
            roads.map((road) => {
              const pathD = road.points.reduce((acc, curr, idx) => {
                return idx === 0 ? `M ${curr[0]} ${curr[1]}` : `${acc} L ${curr[0]} ${curr[1]}`;
              }, '');
              const isSelected = selectedRoad?.id === road.id;
              const strokeColor = getRoadColor(road);
              const isBlocked = road.status === 'Blocked' && currentStep !== 'NOW';

              return (
                <g key={road.id} className="cursor-pointer group">
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#020617"
                    strokeWidth={road.type === 'Highway' ? 8 : road.type === 'Bridge' ? 7 : 5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={road.type === 'Highway' ? 5 : road.type === 'Bridge' ? 4 : 2.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={isBlocked ? '8 4' : undefined}
                    onClick={() => {
                      setSelectedRoad(road);
                      setSelectedZone(null);
                      setSelectedFacility(null);
                    }}
                    className="hover:stroke-white transition-colors"
                  />

                  {/* Impassable Barricade Marker */}
                  {isBlocked && (
                    <g transform={`translate(${road.points[Math.floor(road.points.length / 2)][0]}, ${road.points[Math.floor(road.points.length / 2)][1]})`}>
                      <circle r="9" fill="#EF4444" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="2" />
                      <line x1="5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  )}
                </g>
              );
            })}

          {/* 4. DYNAMIC SAFE ROUTE RENDERING (3 STATES TOGGLEABLE) */}
          {showSafeRoute && (
            <g className="pointer-events-none">
              {/* STATE 1: CURRENT SHORTEST ROUTE (Red / Flooded at 350,340) */}
              {activeRoute === 'CURRENT_SHORTEST' && (
                <g>
                  <path
                    d={`M ${shortestRoutePoints}`}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8 6"
                    className="animate-pulse"
                  />
                  {/* Danger spot on underpass */}
                  <circle cx="350" cy="340" r="14" fill="rgba(239, 68, 68, 0.4)" stroke="#EF4444" strokeWidth="2" className="animate-ping" />
                  <text x="365" y="335" fill="#F87171" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    RIVERWALK UNDERPASS SUBMERGED (52cm)
                  </text>
                </g>
              )}

              {/* STATE 2: PREDICTED-RISK ROUTE (Orange / Rapidly Degrading) */}
              {activeRoute === 'PREDICTED_RISK' && (
                <g>
                  <path
                    d={`M ${predictedRiskRoutePoints}`}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="10 5"
                    className="animate-pulse"
                  />
                  <circle cx="310" cy="210" r="12" fill="none" stroke="#F97316" strokeWidth="2" className="animate-ping" />
                  <text x="325" y="205" fill="#FB923C" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    PREDICTED IMPASSABLE AT T+35M
                  </text>
                </g>
              )}

              {/* STATE 3: RECOMMENDED SAFE ROUTE (Neon Emerald / I-80 Elevated) */}
              {activeRoute === 'RECOMMENDED_SAFE' && (
                <g>
                  <path
                    d={`M ${recommendedSafeRoutePoints}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="10 6"
                    className="animate-pulse"
                  />
                  <circle cx="140" cy="290" r="14" fill="none" stroke="#10B981" strokeWidth="2" className="animate-ping" />
                  <text x="160" y="275" fill="#34D399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    RECOMMENDED SAFE EVACUATION CORRIDOR
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 5. CRITICAL FACILITIES */}
          {showFacilities &&
            facilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              const isCompromised = fac.status === 'Compromised';
              const isAtRisk = fac.status === 'At Risk';

              let badgeBg = '#2563EB';
              let letter = 'H';
              if (fac.type === 'School') {
                badgeBg = '#D97706';
                letter = 'S';
              } else if (fac.type === 'Fire Station') {
                badgeBg = '#DC2626';
                letter = 'F';
              } else if (fac.type === 'Police Station') {
                badgeBg = '#4F46E5';
                letter = 'P';
              }

              return (
                <g
                  key={fac.id}
                  transform={`translate(${fac.coordinates[0]}, ${fac.coordinates[1]})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedFacility(fac);
                    setSelectedZone(null);
                    setSelectedRoad(null);
                  }}
                >
                  {(isCompromised || isAtRisk) && (
                    <circle
                      r="16"
                      fill="none"
                      stroke={isCompromised ? '#EF4444' : '#F97316'}
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.8"
                    />
                  )}

                  <rect
                    x="-9"
                    y="-9"
                    width="18"
                    height="18"
                    rx="4"
                    fill={badgeBg}
                    stroke={isSelected ? '#38BDF8' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="group-hover:scale-125 transition-transform origin-center"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    {letter}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Floating Interactive Inspector Panel (Right Drawer) */}
      {(selectedZone || selectedRoad || selectedFacility) && (
        <div className="absolute top-16 right-4 z-30 w-80 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-xs space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white uppercase font-mono tracking-wider">
                Feature Telemetry Inspector
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedZone(null);
                setSelectedRoad(null);
                setSelectedFacility(null);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedZone && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{selectedZone.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedZone.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                  selectedZone.riskLevel === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  selectedZone.riskLevel === 'MODERATE' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {selectedZone.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Risk Score</div>
                  <div className="text-base font-bold text-cyan-300">{selectedZone.riskScore} / 100</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Water Depth</div>
                  <div className="text-base font-bold text-cyan-300">{Math.round(selectedZone.predictedDepthCm * stepScale)} cm</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Base Elevation</div>
                  <div className="text-slate-200">{selectedZone.elevationMeters} m ASL</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Ward Population</div>
                  <div className="text-slate-200">{selectedZone.basePopulation.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                <span className="text-slate-200 font-semibold">Directional Vector: </span>
                Water discharging {selectedZone.flowDirection} toward coastal estuary.
              </div>
            </div>
          )}

          {selectedRoad && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{selectedRoad.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedRoad.status === 'Blocked' ? 'bg-red-950 text-red-300 border border-red-800' :
                  selectedRoad.status === 'High Risk' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {selectedRoad.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Water Depth</div>
                  <div className="text-base font-bold text-cyan-300">{selectedRoad.waterDepthCm} cm</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Segment Type</div>
                  <div className="text-slate-200">{selectedRoad.type}</div>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/50 text-[11px] text-slate-300 border border-slate-700/60 font-sans">
                {selectedRoad.status === 'Blocked'
                  ? 'Impassable — Submersion exceeds 35cm threshold. Heavy vehicle clearance denied. Diversion active via Interstate 80.'
                  : 'Passable — Transit clear. Obey temporary cautionary speed restriction.'}
              </div>
            </div>
          )}

          {selectedFacility && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{selectedFacility.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedFacility.status === 'Compromised' ? 'bg-red-950 text-red-300 border border-red-800' :
                  selectedFacility.status === 'At Risk' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {selectedFacility.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Type</div>
                  <div className="text-slate-200">{selectedFacility.type}</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Backup Gen</div>
                  <div className="text-emerald-400 font-semibold">{selectedFacility.backupPower}</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Inundation</div>
                  <div className="text-cyan-300 font-bold">{selectedFacility.inundationDepthCm} cm</div>
                </div>
                <div className="p-2 rounded bg-slate-800/80">
                  <div className="text-slate-400">Elevation</div>
                  <div className="text-slate-200">{selectedFacility.elevationMeters} m ASL</div>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/50 text-[11px] text-slate-300 border border-slate-700/60">
                <span className="text-slate-400">Role: </span>
                {selectedFacility.capacity}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
