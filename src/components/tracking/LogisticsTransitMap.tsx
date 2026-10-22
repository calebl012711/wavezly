/**
 * FORMGRID GEOSPATIAL TRANSIT & LOGISTICS TELEMETRY MAP
 * Real-time dual-dispatch avionics & freight monitoring system.
 *
 * Dieter Rams Industrial Functionalism Aesthetic:
 * - High-contrast tactical vector cartography (SVG)
 * - Geodesic transit flight paths & ground priority routes
 * - Animated glowing photon pulse particles traveling along active routes
 * - Real-time avionics telemetry HUD: Airspeed, Ground Speed, Miles Traveled,
 *   Precision Millisecond Delivery Countdown, and Hermetic Climate/Shock Sensors.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navigation,
  Plane,
  Truck,
  MapPin,
  Activity,
  Thermometer,
  ShieldCheck,
  Clock,
  Compass,
  Wifi,
  Radio,
  RotateCcw,
  Maximize2,
  Minimize2,
  Gauge,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

// ============================================================================
// DATA STRUCTURES & DEFINITIONS
// ============================================================================

export type ActiveRouteFilter = 'all' | 'route-a' | 'route-b';
export type TelemetryTab = 'hud' | 'avionics' | 'sensors' | 'manifest';

export interface CustomerDestination {
  id: string;
  city: string;
  state: string;
  code: string;
  coordinates: { x: number; y: number };
  lat: number;
  lon: number;
  postalCode: string;
  zone: string;
}

export interface TransitWaypoint {
  id: string;
  code: string;
  name: string;
  role: 'farm_origin' | 'warehouse_origin' | 'regional_sort_hub' | 'usps_priority_hub' | 'destination';
  route: 'A' | 'B' | 'both';
  coordinates: { x: number; y: number };
  lat: number;
  lon: number;
  elevationFt: number;
  status: string;
  carrier: string;
  facility: string;
  tempC: number;
  humidityPct: number;
  lastScannedTime: string;
}

export interface RouteTelemetry {
  routeId: 'A' | 'B';
  routeName: string;
  carrierName: string;
  carrierVehicle: string;
  trackingNumber: string;
  speedUnit: string;
  currentSpeed: number;
  altitudeFt?: number;
  headingDeg: number;
  headingText: string;
  totalMiles: number;
  milesCompleted: number;
  progressPercent: number;
  etaSeconds: number;
  targetTempC: { min: number; max: number; current: number };
  humidityPct: { max: number; current: number };
  shockG: { maxAllowed: number; peak: number; current: number };
  tamperSeal: 'VERIFIED_SECURE' | 'TAMPER_DETECTED';
}

// Predefined US domestic destinations
export const CUSTOMER_DESTINATIONS: CustomerDestination[] = [
  {
    id: 'nyc',
    city: 'New York / Brooklyn',
    state: 'NY',
    code: 'NYC-04',
    coordinates: { x: 802, y: 215 },
    lat: 40.7128,
    lon: -74.006,
    postalCode: '11201',
    zone: 'US-EAST-01',
  },
  {
    id: 'aus',
    city: 'Austin',
    state: 'TX',
    code: 'AUS-02',
    coordinates: { x: 466, y: 411 },
    lat: 30.2672,
    lon: -97.7431,
    postalCode: '78701',
    zone: 'US-CENTRAL-02',
  },
  {
    id: 'chi',
    city: 'Chicago',
    state: 'IL',
    code: 'ORD-01',
    coordinates: { x: 609, y: 193 },
    lat: 41.8781,
    lon: -87.6298,
    postalCode: '60607',
    zone: 'US-MIDWEST-01',
  },
  {
    id: 'sea',
    city: 'Seattle',
    state: 'WA',
    code: 'SEA-07',
    coordinates: { x: 118, y: 85 },
    lat: 47.6062,
    lon: -122.3321,
    postalCode: '98101',
    zone: 'US-PACIFIC-03',
  },
  {
    id: 'sfo',
    city: 'San Francisco',
    state: 'CA',
    code: 'SFO-03',
    coordinates: { x: 116, y: 270 },
    lat: 37.7749,
    lon: -122.4194,
    postalCode: '94107',
    zone: 'US-PACIFIC-01',
  },
];

// Fixed Transit Hub Waypoints
const BASE_WAYPOINTS: TransitWaypoint[] = [
  {
    id: 'boi-farm',
    code: 'BOI-AM1',
    name: 'Boise Print Farm Cluster Alpha',
    role: 'farm_origin',
    route: 'A',
    coordinates: { x: 204, y: 160 },
    lat: 43.615,
    lon: -116.2023,
    elevationFt: 2730,
    status: 'FABRICATION COMPLETE // FLIGHT CARGO INGEST',
    carrier: 'FedEx Express Air Cargo',
    facility: 'FORMGRID Additive Cluster #01 (Boise, ID)',
    tempC: 21.2,
    humidityPct: 34,
    lastScannedTime: '08:42:10 UTC',
  },
  {
    id: 'den-sort',
    code: 'DEN-SRT',
    name: 'Denver Intermodal Air Sorting Hub',
    role: 'regional_sort_hub',
    route: 'A',
    coordinates: { x: 363, y: 233 },
    lat: 39.7392,
    lon: -104.9903,
    elevationFt: 5280,
    status: 'TRANSIT AIR SCAN // LOADED TO B757 FREIGHTER',
    carrier: 'FedEx Air Logistics Flight FX-1842',
    facility: 'Rocky Mountain Regional Air Hub (Denver, CO)',
    tempC: 19.8,
    humidityPct: 29,
    lastScannedTime: '11:15:44 UTC',
  },
  {
    id: 'slc-hub',
    code: 'SLC-W1',
    name: 'Salt Lake City Domestic Hardware Hub',
    role: 'warehouse_origin',
    route: 'B',
    coordinates: { x: 265, y: 214 },
    lat: 40.7608,
    lon: -111.891,
    elevationFt: 4226,
    status: 'PRECISION HARDWARE MATCHED & PACKAGED',
    carrier: 'USPS Priority Intermodal',
    facility: 'DSers Continental Depot West (Salt Lake City, UT)',
    tempC: 20.6,
    humidityPct: 32,
    lastScannedTime: '06:12:00 UTC',
  },
  {
    id: 'ont-hub',
    code: 'ONT-W2',
    name: 'Ontario Inlay & Anodized Depot',
    role: 'warehouse_origin',
    route: 'B',
    coordinates: { x: 184, y: 340 },
    lat: 34.0633,
    lon: -117.6509,
    elevationFt: 944,
    status: 'ANODIZED BILLET STUDS DISPATCHED',
    carrier: 'USPS Priority Express Transit',
    facility: 'Pacific Logistics Inlay Depot (Ontario, CA)',
    tempC: 22.1,
    humidityPct: 38,
    lastScannedTime: '07:30:22 UTC',
  },
  {
    id: 'ind-usps',
    code: 'IND-USPS',
    name: 'Indianapolis USPS Priority Mega-Hub',
    role: 'usps_priority_hub',
    route: 'B',
    coordinates: { x: 630, y: 232 },
    lat: 39.7684,
    lon: -86.1581,
    elevationFt: 715,
    status: 'AUTOMATED HIGH-SPEED OPTICAL SORT SCAN',
    carrier: 'USPS Logistics Fleet 8421',
    facility: 'Midwest Priority Intermodal Center (Indianapolis, IN)',
    tempC: 20.4,
    humidityPct: 41,
    lastScannedTime: '13:04:19 UTC',
  },
];

interface LogisticsTransitMapProps {
  orderId?: string;
  className?: string;
  onSelectRoute?: (route: 'A' | 'B') => void;
}

export const LogisticsTransitMap: React.FC<LogisticsTransitMapProps> = ({
  orderId = 'FG-849201-B3X',
  className = '',
  onSelectRoute,
}) => {
  // Navigation & telemetry states
  const [activeFilter, setActiveFilter] = useState<ActiveRouteFilter>('all');
  const [activeTab, setActiveTab] = useState<TelemetryTab>('hud');
  const [selectedDestination, setSelectedDestination] = useState<CustomerDestination>(CUSTOMER_DESTINATIONS[0]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<TransitWaypoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [radarSweepDeg, setRadarSweepDeg] = useState(0);

  // SVG Path References for dynamic point computation
  const routeAPathRef1 = useRef<SVGPathElement | null>(null);
  const routeAPathRef2 = useRef<SVGPathElement | null>(null);
  const routeBPathRef1 = useRef<SVGPathElement | null>(null);
  const routeBPathRef2 = useRef<SVGPathElement | null>(null);
  const routeBPathRef3 = useRef<SVGPathElement | null>(null);

  // Real-time animation physics parameters
  const [progressA, setProgressA] = useState(0.68);
  const [progressB, setProgressB] = useState(0.89);
  const [carrierPosA, setCarrierPosA] = useState({ x: 580, y: 195, angle: 12 });
  const [carrierPosB, setCarrierPosB] = useState({ x: 730, y: 220, angle: 8 });

  // Real-time countdown timer states (millisecond accuracy)
  const [countdownA, setCountdownA] = useState({ hours: 38, minutes: 14, seconds: 28, ms: 840 });
  const [countdownB, setCountdownB] = useState({ hours: 6, minutes: 41, seconds: 12, ms: 320 });

  // Environmental sensor jitter (simulated live telemetry stream)
  const [liveTemp, setLiveTemp] = useState(21.4);
  const [liveHumidity, setLiveHumidity] = useState(36.2);
  const [liveShockG, setLiveShockG] = useState(0.12);
  const [liveAirspeed, setLiveAirspeed] = useState(482);
  const [liveGroundSpeed, setLiveGroundSpeed] = useState(68.4);

  // Assemble full list of waypoints including current dynamic customer destination
  const allWaypoints = useMemo<TransitWaypoint[]>(() => {
    const destWaypoint: TransitWaypoint = {
      id: `dest-${selectedDestination.id}`,
      code: selectedDestination.code,
      name: `Customer Delivery Node: ${selectedDestination.city}`,
      role: 'destination',
      route: 'both',
      coordinates: selectedDestination.coordinates,
      lat: selectedDestination.lat,
      lon: selectedDestination.lon,
      elevationFt: 45,
      status: 'LOCAL DISPATCH TERMINAL // FINAL RECEPTACLE',
      carrier: 'Courier Final Mile Ground',
      facility: `Carrier Service Point ${selectedDestination.postalCode}`,
      tempC: 21.0,
      humidityPct: 35,
      lastScannedTime: 'ESTIMATED INGEST',
    };
    return [...BASE_WAYPOINTS, destWaypoint];
  }, [selectedDestination]);

  // Handle tactile switch
  const handleFilterClick = (filter: ActiveRouteFilter) => {
    playClickSound('toggle');
    setActiveFilter(filter);
    if (filter === 'route-a') onSelectRoute?.('A');
    if (filter === 'route-b') onSelectRoute?.('B');
  };

  const handleDestinationSelect = (dest: CustomerDestination) => {
    playClickSound('tick');
    setSelectedDestination(dest);
    setSelectedWaypoint(null);
  };

  const handleTabChange = (tab: TelemetryTab) => {
    playClickSound('tab');
    setActiveTab(tab);
  };

  // Waypoint click
  const handleWaypointClick = (wp: TransitWaypoint) => {
    playClickSound('tick');
    setSelectedWaypoint((prev) => (prev?.id === wp.id ? null : wp));
  };

  // Compute curved geodesic paths based on destination coordinates
  const paths = useMemo(() => {
    const dest = selectedDestination.coordinates;

    // Route A:
    // Leg 1: Boise (204, 160) -> Denver (363, 233)
    const aLeg1 = `M 204,160 Q 280,185 363,233`;
    // Leg 2: Denver (363, 233) -> Destination
    const aControlX = 363 + (dest.x - 363) * 0.5;
    const aControlY = Math.min(233, dest.y) - 60;
    const aLeg2 = `M 363,233 Q ${aControlX},${aControlY} ${dest.x},${dest.y}`;

    // Route B:
    // Branch B1: Salt Lake City (265, 214) -> Indianapolis (630, 232)
    const bBranch1 = `M 265,214 Q 440,190 630,232`;
    // Branch B2: Ontario, CA (184, 340) -> Indianapolis (630, 232)
    const bBranch2 = `M 184,340 Q 400,315 630,232`;
    // Leg B3: Indianapolis (630, 232) -> Destination
    const bControlX = 630 + (dest.x - 630) * 0.5;
    const bControlY = Math.min(232, dest.y) - 30;
    const bLeg3 = `M 630,232 Q ${bControlX},${bControlY} ${dest.x},${dest.y}`;

    return { aLeg1, aLeg2, bBranch1, bBranch2, bLeg3 };
  }, [selectedDestination]);

  // Live animation loop using requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isSimulationPaused) {
        // Radar sweep rotation
        setRadarSweepDeg((prev) => (prev + delta * 35) % 360);

        // Advance route progress
        setProgressA((prev) => {
          const next = prev + delta * 0.025;
          return next > 1 ? 0.05 : next;
        });

        setProgressB((prev) => {
          const next = prev + delta * 0.035;
          return next > 1 ? 0.15 : next;
        });

        // Compute exact position and tangent angle for Route A Carrier along leg 2
        if (routeAPathRef2.current) {
          try {
            const totalLen = routeAPathRef2.current.getTotalLength();
            // Map progressA (0.4 to 1.0) along leg 2
            const localT = Math.max(0, Math.min(1, (progressA - 0.2) / 0.8));
            const point = routeAPathRef2.current.getPointAtLength(localT * totalLen);
            const aheadPoint = routeAPathRef2.current.getPointAtLength(Math.min(totalLen, localT * totalLen + 4));
            const angle = (Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x) * 180) / Math.PI;
            setCarrierPosA({ x: point.x, y: point.y, angle });
          } catch {
            // SVG path not ready
          }
        }

        // Compute exact position and tangent angle for Route B Carrier along leg 3
        if (routeBPathRef3.current) {
          try {
            const totalLen = routeBPathRef3.current.getTotalLength();
            const localT = Math.max(0, Math.min(1, (progressB - 0.5) / 0.5));
            const point = routeBPathRef3.current.getPointAtLength(localT * totalLen);
            const aheadPoint = routeBPathRef3.current.getPointAtLength(Math.min(totalLen, localT * totalLen + 4));
            const angle = (Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x) * 180) / Math.PI;
            setCarrierPosB({ x: point.x, y: point.y, angle });
          } catch {
            // SVG path not ready
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isSimulationPaused, progressA, progressB]);

  // Countdown timer & sensor telemetry jitter interval
  useEffect(() => {
    const timer = setInterval(() => {
      // Countdown A decrement
      setCountdownA((prev) => {
        let ms = prev.ms - 85;
        let sec = prev.seconds;
        let min = prev.minutes;
        let hr = prev.hours;
        if (ms < 0) {
          ms += 1000;
          sec -= 1;
        }
        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        return { hours: Math.max(0, hr), minutes: Math.max(0, min), seconds: Math.max(0, sec), ms };
      });

      // Countdown B decrement
      setCountdownB((prev) => {
        let ms = prev.ms - 85;
        let sec = prev.seconds;
        let min = prev.minutes;
        let hr = prev.hours;
        if (ms < 0) {
          ms += 1000;
          sec -= 1;
        }
        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        return { hours: Math.max(0, hr), minutes: Math.max(0, min), seconds: Math.max(0, sec), ms };
      });

      // Jitter sensors realistically
      setLiveTemp(() => +(21.3 + Math.sin(Date.now() / 2500) * 0.3).toFixed(1));
      setLiveHumidity(() => +(36.0 + Math.cos(Date.now() / 3200) * 0.8).toFixed(1));
      setLiveShockG(() => +(0.11 + Math.abs(Math.sin(Date.now() / 1800)) * 0.05).toFixed(2));
      setLiveAirspeed(() => 480 + Math.floor(Math.sin(Date.now() / 4000) * 6));
      setLiveGroundSpeed(() => +(68.0 + Math.sin(Date.now() / 2200) * 1.2).toFixed(1));
    }, 85);

    return () => clearInterval(timer);
  }, []);

  // Distance calculation based on destination
  const distanceA = useMemo(() => {
    const base = 2180;
    const offset = (selectedDestination.coordinates.x - 802) * 1.8;
    const total = Math.round(base + offset);
    const completed = Math.round(total * progressA);
    return { total, completed, pct: Math.round(progressA * 100) };
  }, [selectedDestination, progressA]);

  const distanceB = useMemo(() => {
    const base = 2050;
    const offset = (selectedDestination.coordinates.x - 802) * 1.5;
    const total = Math.round(base + offset);
    const completed = Math.round(total * progressB);
    return { total, completed, pct: Math.round(progressB * 100) };
  }, [selectedDestination, progressB]);

  return (
    <div
      className={`relative w-full rounded-2xl bg-background border border-surface-border overflow-hidden font-mono text-xs transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-background/98 shadow-2xl backdrop-blur-xl' : ''
      } ${className}`}
    >
      {/* ==================================================================== */}
      {/* TOP CONTROLS & TELEMETRY BEZEL BAR */}
      {/* ==================================================================== */}
      <div className="p-4 bg-surface/90 border-b border-surface-border flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Tactical System Indicator */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-black border border-surface-border">
            <Radio className="w-4 h-4 text-signal-orange animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-signal-lime animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-precision-white tracking-wider text-xs sm:text-sm font-sans">
                TRANSIT TELEMETRY RADAR
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-signal-orange/10 text-signal-orange border border-signal-orange/30">
                DUAL DISPATCH
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center space-x-2">
              <span>SYSTEM ID: {orderId}</span>
              <span>•</span>
              <span className="text-signal-lime flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5" /> 14 SATS LOCKED
              </span>
            </div>
          </div>
        </div>

        {/* Center: Route Filtering Switches (Dieter Rams Industrial Selector) */}
        <div className="inline-flex rounded-lg bg-black/60 p-1 border border-surface-border">
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1.5 ${
              activeFilter === 'all'
                ? 'bg-zinc-800 text-precision-white shadow-tactile border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>CONCURRENT (2)</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('route-a')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1.5 ${
              activeFilter === 'route-a'
                ? 'bg-signal-orange/20 text-signal-orange border border-signal-orange/50 shadow-tactile'
                : 'text-zinc-400 hover:text-signal-orange'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span>ROUTE A: 3D FARM</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('route-b')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1.5 ${
              activeFilter === 'route-b'
                ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/50 shadow-tactile'
                : 'text-zinc-400 hover:text-signal-cyan'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
            <span>ROUTE B: HARDWARE</span>
          </button>
        </div>

        {/* Right: Destination Quick Select & Auxiliary Controls */}
        <div className="flex items-center space-x-2">
          {/* Destination Selector */}
          <div className="flex items-center space-x-1.5 bg-black/40 px-2 py-1 rounded-lg border border-surface-border">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <select
              aria-label="Select Customer Delivery Destination"
              value={selectedDestination.id}
              onChange={(e) => {
                const target = CUSTOMER_DESTINATIONS.find((d) => d.id === e.target.value);
                if (target) handleDestinationSelect(target);
              }}
              className="bg-transparent text-[11px] text-precision-white font-mono focus:outline-none cursor-pointer"
            >
              {CUSTOMER_DESTINATIONS.map((dest) => (
                <option key={dest.id} value={dest.id} className="bg-zinc-900 text-zinc-100">
                  {dest.city}, {dest.state} ({dest.code})
                </option>
              ))}
            </select>
          </div>

          {/* Pause / Resume */}
          <button
            type="button"
            title={isSimulationPaused ? 'Resume Pulse Simulation' : 'Pause Pulse Simulation'}
            onClick={() => {
              playClickSound('toggle');
              setIsSimulationPaused((p) => !p);
            }}
            className="p-1.5 rounded-lg bg-surface border border-surface-border text-zinc-400 hover:text-precision-white transition"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSimulationPaused ? 'text-signal-amber' : ''}`} />
          </button>

          {/* Fullscreen Expand */}
          <button
            type="button"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Radar'}
            onClick={() => {
              playClickSound('toggle');
              setIsFullscreen((f) => !f);
            }}
            className="p-1.5 rounded-lg bg-surface border border-surface-border text-zinc-400 hover:text-precision-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN VECTOR MAP SVG CANVAS */}
      {/* ==================================================================== */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-[#070709] overflow-hidden select-none">
        {/* Subtle Radial Radar Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.03)_0%,rgba(255,85,0,0.02)_50%,transparent_80%)] pointer-events-none" />

        {/* Ambient CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,20,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Tactical Crosshairs & Corner Calibrations */}
        <div className="absolute top-2 left-2 text-[9px] text-zinc-600 pointer-events-none font-mono">
          GRID 48°N 125°W // PROJECTION: MERCATOR_TACTICAL_V3
        </div>
        <div className="absolute top-2 right-2 text-[9px] text-zinc-600 pointer-events-none font-mono">
          ALT REF: MSL WGS-84 // RECEPTOR #09
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] text-zinc-600 pointer-events-none font-mono">
          SCALE: 1:1,250,000 // UTC SYNC ACTIVE
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] text-zinc-600 pointer-events-none font-mono">
          STATUS: IN_TRANSIT_CONCURRENT
        </div>

        {/* The Master SVG Canvas */}
        <svg
          viewBox="0 0 1000 580"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glowing Neon Filters */}
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-lime" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients for Transit Arcs */}
            <linearGradient id="grad-route-a" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff5500" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff7733" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffa066" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="grad-route-b" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
            </linearGradient>

            {/* Radar Sweep Radial Gradient */}
            <radialGradient id="radar-beam" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Tactical Coordinate Grid & Lat/Lon Parallels */}
          <g className="opacity-20" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="2,4">
            {/* Latitude parallels */}
            <line x1="60" y1="90" x2="940" y2="90" />
            <line x1="60" y1="180" x2="940" y2="180" />
            <line x1="60" y1="270" x2="940" y2="270" />
            <line x1="60" y1="360" x2="940" y2="360" />
            <line x1="60" y1="450" x2="940" y2="450" />
            {/* Longitude meridians */}
            <line x1="120" y1="60" x2="120" y2="520" />
            <line x1="260" y1="60" x2="260" y2="520" />
            <line x1="400" y1="60" x2="400" y2="520" />
            <line x1="540" y1="60" x2="540" y2="520" />
            <line x1="680" y1="60" x2="680" y2="520" />
            <line x1="820" y1="60" x2="820" y2="520" />
          </g>

          {/* 2. Precision Continental United States Landmass Contour */}
          <path
            d="
              M 115,78
              L 190,80 L 320,82 L 450,84 L 530,86
              L 545,74 L 570,95 L 600,105 L 640,115 L 665,140
              L 645,155 L 635,185 L 655,215 L 680,195 L 715,175
              L 735,190 L 770,180 L 805,170 L 835,140
              L 860,100 L 885,115 L 870,150 L 855,165
              L 840,185 L 848,198 L 825,212 L 812,218
              L 795,230 L 775,255 L 760,290 L 775,330
              L 755,365 L 735,395 L 715,435 L 720,480
              L 722,510 L 716,545 L 700,550 L 685,520
              L 680,480 L 645,465 L 585,465 L 565,485
              L 540,470 L 505,465 L 485,495 L 465,535
              L 445,545 L 420,515 L 385,480 L 350,455
              L 315,440 L 280,430 L 220,420 L 190,410
              L 185,370 L 165,345 L 140,310 L 115,265
              L 100,210 L 95,160 L 100,125 L 108,90
              Z
            "
            fill="#121215"
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* 3. Internal Regional State Borders (Subtle Technical Divisions) */}
          <g stroke="#1e1e24" strokeWidth="0.8" fill="none">
            {/* Pacific division */}
            <path d="M 190,80 L 190,210 L 140,310" />
            <path d="M 100,125 L 190,135" />
            <path d="M 100,210 L 265,214" />
            {/* Mountain division */}
            <path d="M 320,82 L 315,260 L 315,440" />
            <path d="M 190,210 L 320,210" />
            <path d="M 220,420 L 220,310 L 315,310" />
            {/* Central division & Texas border */}
            <path d="M 450,84 L 450,340 L 385,480" />
            <path d="M 350,455 L 450,455 L 465,535" />
            <path d="M 315,370 L 450,370" />
            {/* Mississippi / Midwest line */}
            <path d="M 545,74 L 540,260 L 575,320 L 565,485" />
            <path d="M 450,240 L 600,240" />
            {/* Ohio / East coast */}
            <path d="M 680,195 L 680,360 L 755,365" />
            <path d="M 770,180 L 760,290" />
            <path d="M 735,395 L 680,395" />
          </g>

          {/* 4. Radar Sweep Beam centered over Geographic Center */}
          <g transform={`rotate(${radarSweepDeg} 500 270)`} className="pointer-events-none opacity-30">
            <line x1="500" y1="270" x2="850" y2="270" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="500" cy="270" r="350" fill="url(#radar-beam)" />
          </g>

          {/* 5. Range Distance Rings centered at Main Hubs */}
          <circle
            cx="363"
            cy="233"
            r="80"
            fill="none"
            stroke="#ff5500"
            strokeWidth="0.5"
            strokeDasharray="2,5"
            strokeOpacity="0.25"
          />
          <circle
            cx="630"
            cy="232"
            r="90"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="0.5"
            strokeDasharray="2,5"
            strokeOpacity="0.25"
          />

          {/* ================================================================ */}
          {/* 6. ROUTE A: 3D PRINT FARM (BOISE -> DENVER -> DESTINATION) */}
          {/* ================================================================ */}
          {(activeFilter === 'all' || activeFilter === 'route-a') && (
            <g id="group-route-a">
              {/* Route A Path - Leg 1 (Boise -> Denver) */}
              <path
                ref={routeAPathRef1}
                d={paths.aLeg1}
                fill="none"
                stroke="#ff5500"
                strokeWidth="2.2"
                strokeDasharray="4,4"
                strokeOpacity="0.75"
                filter="url(#glow-orange)"
              />
              {/* Route A Path - Leg 2 (Denver -> Destination) */}
              <path
                ref={routeAPathRef2}
                d={paths.aLeg2}
                fill="none"
                stroke="url(#grad-route-a)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#glow-orange)"
              />
              {/* Secondary decorative flight path shadow */}
              <path
                d={paths.aLeg2}
                fill="none"
                stroke="#ff5500"
                strokeWidth="1"
                strokeDasharray="2,6"
                strokeOpacity="0.4"
                transform="translate(0, 10)"
              />

              {/* Animated Glowing Pulse Particles traveling along Route A Leg 2 */}
              <circle
                cx={carrierPosA.x}
                cy={carrierPosA.y}
                r="6"
                fill="#ff5500"
                filter="url(#glow-orange)"
                className="animate-pulse"
              />
              <circle
                cx={carrierPosA.x}
                cy={carrierPosA.y}
                r="14"
                fill="none"
                stroke="#ff5500"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              >
                <animate attributeName="r" values="6;22" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
              </circle>

              {/* Avionics Flight Vector Chevron */}
              <g
                transform={`translate(${carrierPosA.x}, ${carrierPosA.y}) rotate(${carrierPosA.angle})`}
                className="pointer-events-none"
              >
                <polygon points="8,0 -6,-5 -3,0 -6,5" fill="#f4f4f5" />
              </g>

              {/* Live Carrier Avionics Tag */}
              <g
                transform={`translate(${carrierPosA.x + 12}, ${carrierPosA.y - 12})`}
                className="pointer-events-none font-mono"
              >
                <rect
                  x="-2"
                  y="-11"
                  width="112"
                  height="16"
                  rx="3"
                  fill="#09090b"
                  fillOpacity="0.9"
                  stroke="#ff5500"
                  strokeWidth="0.7"
                />
                <text x="3" y="0" fill="#f4f4f5" fontSize="8" fontWeight="bold">
                  FX-1842 • {liveAirspeed} KTS
                </text>
              </g>
            </g>
          )}

          {/* ================================================================ */}
          {/* 7. ROUTE B: DOMESTIC HARDWARE (SLC / ONTARIO -> INDY -> DEST) */}
          {/* ================================================================ */}
          {(activeFilter === 'all' || activeFilter === 'route-b') && (
            <g id="group-route-b">
              {/* Branch B1 (SLC -> Indianapolis) */}
              <path
                ref={routeBPathRef1}
                d={paths.bBranch1}
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.0"
                strokeDasharray="4,4"
                strokeOpacity="0.7"
                filter="url(#glow-cyan)"
              />
              {/* Branch B2 (Ontario CA -> Indianapolis) */}
              <path
                ref={routeBPathRef2}
                d={paths.bBranch2}
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.0"
                strokeDasharray="3,5"
                strokeOpacity="0.6"
                filter="url(#glow-cyan)"
              />
              {/* Leg B3 (Indianapolis -> Destination) */}
              <path
                ref={routeBPathRef3}
                d={paths.bLeg3}
                fill="none"
                stroke="url(#grad-route-b)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#glow-cyan)"
              />

              {/* Animated Glowing Pulse Particles traveling along Route B Leg 3 */}
              <circle
                cx={carrierPosB.x}
                cy={carrierPosB.y}
                r="5.5"
                fill="#00e5ff"
                filter="url(#glow-cyan)"
                className="animate-pulse"
              />
              <circle
                cx={carrierPosB.x}
                cy={carrierPosB.y}
                r="12"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              >
                <animate attributeName="r" values="5;18" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
              </circle>

              {/* Ground Transit Vector Chevron */}
              <g
                transform={`translate(${carrierPosB.x}, ${carrierPosB.y}) rotate(${carrierPosB.angle})`}
                className="pointer-events-none"
              >
                <polygon points="7,0 -5,-4 -2,0 -5,4" fill="#f4f4f5" />
              </g>

              {/* Live Ground Carrier Tag */}
              <g
                transform={`translate(${carrierPosB.x + 12}, ${carrierPosB.y + 12})`}
                className="pointer-events-none font-mono"
              >
                <rect
                  x="-2"
                  y="-11"
                  width="118"
                  height="16"
                  rx="3"
                  fill="#09090b"
                  fillOpacity="0.9"
                  stroke="#00e5ff"
                  strokeWidth="0.7"
                />
                <text x="3" y="0" fill="#f4f4f5" fontSize="8" fontWeight="bold">
                  USPS-84 • {liveGroundSpeed} MPH
                </text>
              </g>
            </g>
          )}

          {/* ================================================================ */}
          {/* 8. WAYPOINT RADAR NODES & PING HALOS */}
          {/* ================================================================ */}
          {allWaypoints.map((wp) => {
            const isSelected = selectedWaypoint?.id === wp.id;
            const isDestination = wp.role === 'destination';
            const isRouteA = wp.route === 'A';
            const isRouteB = wp.route === 'B';

            // Filter visibility
            if (activeFilter === 'route-a' && isRouteB && !isDestination) return null;
            if (activeFilter === 'route-b' && isRouteA && !isDestination) return null;

            const markerColor = isDestination
              ? '#a3e635'
              : isRouteA
              ? '#ff5500'
              : isRouteB
              ? '#00e5ff'
              : '#f4f4f5';

            return (
              <g
                key={wp.id}
                transform={`translate(${wp.coordinates.x}, ${wp.coordinates.y})`}
                onClick={() => handleWaypointClick(wp)}
                className="cursor-pointer group"
              >
                {/* Sonar Ping Ring on Active/Destination Nodes */}
                {(isDestination || isSelected) && (
                  <circle cx="0" cy="0" r="14" fill="none" stroke={markerColor} strokeWidth="1" strokeOpacity="0.6">
                    <animate attributeName="r" values="6;24" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Outer Reticle on Selected */}
                {isSelected && (
                  <g stroke={markerColor} strokeWidth="1.2" fill="none">
                    <circle cx="0" cy="0" r="12" strokeDasharray="3,3" />
                    <line x1="-16" y1="0" x2="-10" y2="0" />
                    <line x1="10" y1="0" x2="16" y2="0" />
                    <line x1="0" y1="-16" x2="0" y2="-10" />
                    <line x1="0" y1="10" x2="0" y2="16" />
                  </g>
                )}

                {/* Core Marker Node */}
                <circle
                  cx="0"
                  cy="0"
                  r={isDestination ? '6.5' : isSelected ? '5.5' : '4'}
                  fill={markerColor}
                  stroke="#09090b"
                  strokeWidth="1.8"
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Node Label Tag */}
                <g className="pointer-events-none select-none font-mono">
                  <text
                    x="8"
                    y="3"
                    fill={isSelected ? '#ffffff' : '#d4d4d8'}
                    fontSize={isDestination ? '9.5' : '8'}
                    fontWeight={isDestination ? 'bold' : 'normal'}
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {wp.code}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* ================================================================ */}
        {/* WAYPOINT INSPECTOR OVERLAY POPUP */}
        {/* ================================================================ */}
        {selectedWaypoint && (
          <div className="absolute top-4 right-4 z-20 w-72 sm:w-80 rounded-xl bg-surface/95 border border-surface-border p-4 shadow-2xl backdrop-blur-md space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      selectedWaypoint.role === 'destination'
                        ? '#a3e635'
                        : selectedWaypoint.route === 'A'
                        ? '#ff5500'
                        : '#00e5ff',
                  }}
                />
                <span className="font-bold text-precision-white text-xs">{selectedWaypoint.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWaypoint(null)}
                className="text-zinc-500 hover:text-zinc-200 font-mono text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">FACILITY CODE:</span>
                <span className="text-precision-white font-bold">{selectedWaypoint.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CARRIER SERVICE:</span>
                <span className="text-zinc-200">{selectedWaypoint.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">COORDINATES:</span>
                <span className="text-zinc-300">
                  {selectedWaypoint.lat.toFixed(3)}°N, {Math.abs(selectedWaypoint.lon).toFixed(3)}°W
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ELEVATION:</span>
                <span className="text-zinc-300">{selectedWaypoint.elevationFt.toLocaleString()} FT MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">FACILITY AMBIENT:</span>
                <span className="text-signal-lime">
                  {selectedWaypoint.tempC}°C // {selectedWaypoint.humidityPct}% RH
                </span>
              </div>
            </div>

            <div className="p-2 rounded bg-black/60 border border-zinc-800 text-[10px] space-y-1">
              <div className="text-zinc-400 font-bold">LATEST SCAN TELEMETRY:</div>
              <div className="text-zinc-300">{selectedWaypoint.status}</div>
              <div className="text-zinc-500">TIMESTAMP: {selectedWaypoint.lastScannedTime}</div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* LIVE TRANSIT TELEMETRY HUD (DIETER RAMS MODULAR INSTRUMENTATION) */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-surface border-t border-surface-border space-y-4">
        {/* HUD Sub-Tabs */}
        <div className="flex items-center justify-between border-b border-surface-border/70 pb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => handleTabChange('hud')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'hud'
                  ? 'bg-zinc-800 text-precision-white shadow-tactile border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-signal-lime" />
              <span>LIVE TRANSIT HUD</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('avionics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'avionics'
                  ? 'bg-zinc-800 text-precision-white shadow-tactile border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-signal-orange" />
              <span>AVIONICS & VELOCITY</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('sensors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'sensors'
                  ? 'bg-zinc-800 text-precision-white shadow-tactile border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-signal-cyan" />
              <span>CLIMATE & SHOCK</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'manifest'
                  ? 'bg-zinc-800 text-precision-white shadow-tactile border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-zinc-400" />
              <span>MANIFEST AUDIT</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-signal-lime animate-pulse" />
            <span>ENCRYPTED SENSOR FEED // REFRESH 85ms</span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: MAIN LIVE TRANSIT HUD (SPEED, MILES, COUNTDOWN, FREIGHT) */}
        {/* ================================================================== */}
        {activeTab === 'hud' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Miles Traveled & Progress */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-signal-cyan" />
                  <span className="font-bold text-zinc-300">TRANSIT ODOMETER</span>
                </div>
                <span className="text-[10px] text-zinc-500">DOMESTIC</span>
              </div>

              {/* Route A Miles */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-signal-orange font-bold">ROUTE A (3D FARM)</span>
                  <span className="text-zinc-200">
                    {distanceA.completed.toLocaleString()} / {distanceA.total.toLocaleString()} MI
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-signal-orange transition-all duration-300"
                    style={{ width: `${distanceA.pct}%` }}
                  />
                </div>
              </div>

              {/* Route B Miles */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-signal-cyan font-bold">ROUTE B (HARDWARE)</span>
                  <span className="text-zinc-200">
                    {distanceB.completed.toLocaleString()} / {distanceB.total.toLocaleString()} MI
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-signal-cyan transition-all duration-300"
                    style={{ width: `${distanceB.pct}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800 flex justify-between">
                <span>DEST: {selectedDestination.city}</span>
                <span className="text-signal-lime font-bold">CONCURRENT DISPATCH</span>
              </div>
            </div>

            {/* 2. Carrier Airspeed & Ground Speed */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Gauge className="w-3.5 h-3.5 text-signal-orange" />
                  <span className="font-bold text-zinc-300">CARRIER VELOCITY</span>
                </div>
                <span className="text-[10px] text-zinc-500">LIVE SENSORS</span>
              </div>

              <div className="space-y-2">
                {/* Route A Airspeed */}
                <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-3.5 h-3.5 text-signal-orange" />
                    <div>
                      <div className="text-[10px] text-zinc-400">FEDEX AIR FX-1842</div>
                      <div className="text-xs font-bold text-precision-white">B757-200F</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-signal-orange">{liveAirspeed} KTS</div>
                    <div className="text-[10px] text-zinc-500">FL320 • 32,000 FT</div>
                  </div>
                </div>

                {/* Route B Ground Speed */}
                <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-3.5 h-3.5 text-signal-cyan" />
                    <div>
                      <div className="text-[10px] text-zinc-400">USPS INTERMODAL</div>
                      <div className="text-xs font-bold text-precision-white">eCascadia Class 8</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-signal-cyan">{liveGroundSpeed} MPH</div>
                    <div className="text-[10px] text-zinc-500">I-80 E • MILE 389</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Estimated Delivery Countdown Timers (Milliseconds) */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-signal-lime" />
                  <span className="font-bold text-zinc-300">ETA COUNTDOWN</span>
                </div>
                <span className="text-[10px] text-signal-lime">PRECISION</span>
              </div>

              {/* Route A Timer */}
              <div className="p-2 rounded bg-black/50 border border-zinc-800 space-y-0.5">
                <div className="text-[10px] text-signal-orange flex justify-between font-bold">
                  <span>PACKAGE A (3D PRINT):</span>
                  <span>STAGE 2/4</span>
                </div>
                <div className="text-base font-bold text-precision-white tracking-wider flex items-baseline space-x-1 font-mono">
                  <span>{String(countdownA.hours).padStart(2, '0')}h</span>
                  <span>{String(countdownA.minutes).padStart(2, '0')}m</span>
                  <span>{String(countdownA.seconds).padStart(2, '0')}s</span>
                  <span className="text-xs text-signal-orange font-normal">
                    .{String(Math.floor(countdownA.ms / 10)).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Route B Timer */}
              <div className="p-2 rounded bg-black/50 border border-zinc-800 space-y-0.5">
                <div className="text-[10px] text-signal-cyan flex justify-between font-bold">
                  <span>PACKAGE B (HARDWARE):</span>
                  <span>STAGE 3/4</span>
                </div>
                <div className="text-base font-bold text-precision-white tracking-wider flex items-baseline space-x-1 font-mono">
                  <span>{String(countdownB.hours).padStart(2, '0')}h</span>
                  <span>{String(countdownB.minutes).padStart(2, '0')}m</span>
                  <span>{String(countdownB.seconds).padStart(2, '0')}s</span>
                  <span className="text-xs text-signal-cyan font-normal">
                    .{String(Math.floor(countdownB.ms / 10)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Temperature-Controlled Freight Status */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-signal-lime" />
                  <span className="font-bold text-zinc-300">CLIMATE ENVELOPE</span>
                </div>
                <span className="text-[10px] text-signal-lime flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-signal-lime" /> NOMINAL
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">CORE TEMPERATURE:</span>
                  <span className="text-precision-white font-bold font-mono">
                    {liveTemp}°C{' '}
                    <span className="text-[10px] text-zinc-500 font-normal">[18.0 - 24.0°C]</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">RELATIVE HUMIDITY:</span>
                  <span className="text-precision-white font-bold font-mono">
                    {liveHumidity}% <span className="text-[10px] text-zinc-500 font-normal">[&lt;45%]</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">SHOCK SENSOR:</span>
                  <span className="text-signal-lime font-bold font-mono">
                    {liveShockG} G <span className="text-[10px] text-zinc-500 font-normal">[PASS &lt;2.0G]</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                  <span className="text-zinc-500">RFID TAMPER SEAL:</span>
                  <span className="text-signal-lime text-[10px] font-bold">LOCKED // VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: AVIONICS & DETAILED VECTOR TELEMETRY */}
        {/* ================================================================== */}
        {activeTab === 'avionics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center space-x-2 text-signal-orange font-bold text-xs">
                  <Plane className="w-4 h-4" />
                  <span>ROUTE A: FEDEX AIR FREIGHTER FX-1842</span>
                </div>
                <span className="text-[10px] text-zinc-400">BOEING 757-200F // N948FD</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">INDICATED AIRSPEED</div>
                  <div className="text-precision-white font-bold font-mono">{liveAirspeed} KTS (555 MPH)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">PRESSURE ALTITUDE</div>
                  <div className="text-precision-white font-bold font-mono">32,150 FT MSL</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">TRUE HEADING</div>
                  <div className="text-precision-white font-bold font-mono">084° ENE (MAGNETIC)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">TRANSPONDER SQUAWK</div>
                  <div className="text-signal-lime font-bold font-mono">4271 (MODE S / ADS-B OUT)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">FLIGHT LEG</div>
                  <div className="text-zinc-200 font-mono">DEN (DENVER) ➔ {selectedDestination.code}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">SCHEDULE DELTA</div>
                  <div className="text-signal-lime font-mono">-00:04m (AHEAD OF SCHEDULE)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center space-x-2 text-signal-cyan font-bold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>ROUTE B: USPS PRIORITY INTERMODAL TRUCK</span>
                </div>
                <span className="text-[10px] text-zinc-400">FREIGHTLINER eCASCADIA // #8421</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">HIGHWAY GROUND SPEED</div>
                  <div className="text-precision-white font-bold font-mono">{liveGroundSpeed} MPH (110 KM/H)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">CORRIDOR / ROUTE</div>
                  <div className="text-precision-white font-bold font-mono">INTERSTATE 80 EASTBOUND</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">CURRENT MILEMARKER</div>
                  <div className="text-precision-white font-bold font-mono">MP 389.4 (OH/PA CORRIDOR)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">TELEMATICS BEACON</div>
                  <div className="text-signal-lime font-bold font-mono">USPS-SAT-FLEET-902</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">DISPATCH LEG</div>
                  <div className="text-zinc-200 font-mono">IND (INDIANAPOLIS) ➔ {selectedDestination.code}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">TRAILER BRAKE TELEMETRY</div>
                  <div className="text-signal-lime font-mono">REGENERATIVE // 98% HEALTH</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: CLIMATE & SHOCK FORENSICS */}
        {/* ================================================================== */}
        {activeTab === 'sensors' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="font-bold text-zinc-300">THERMAL STABILITY</span>
                <span className="text-signal-lime font-bold">NOMINAL</span>
              </div>
              <div className="text-2xl font-bold text-precision-white font-mono">{liveTemp}°C</div>
              <p className="text-[11px] text-zinc-400">
                Expanded Polypropylene (EPP) thermal liner maintains PLA-CF composite and optical resin stability
                between 18°C and 24°C across all domestic flight altitudes.
              </p>
              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-signal-lime h-full rounded-full transition-all duration-300"
                  style={{ width: `${((liveTemp - 16) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="font-bold text-zinc-300">DESICCANT BARRIER</span>
                <span className="text-signal-cyan font-bold">HERMETIC</span>
              </div>
              <div className="text-2xl font-bold text-precision-white font-mono">{liveHumidity}% RH</div>
              <p className="text-[11px] text-zinc-400">
                Dual clay desiccant sachets prevent ambient moisture uptake during pressurized cargo bay decompression,
                preserving mechanical tolerances of interlocking grids.
              </p>
              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-signal-cyan h-full rounded-full transition-all duration-300"
                  style={{ width: `${(liveHumidity / 50) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span className="font-bold text-zinc-300">TRIAXIAL ACCELEROMETER</span>
                <span className="text-signal-lime font-bold">PASS (0.12 G)</span>
              </div>
              <div className="text-2xl font-bold text-precision-white font-mono">{liveShockG} G</div>
              <p className="text-[11px] text-zinc-400">
                Calibrated Drop & Vibration logger records G-forces across X, Y, and Z axes. Peak event recorded: 0.38 G
                during runway touchdown (within 2.0 G safe limit).
              </p>
              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-signal-lime h-full rounded-full transition-all duration-300"
                  style={{ width: `${(liveShockG / 1.5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: MANIFEST AUDIT & DISPATCH LOG */}
        {/* ================================================================== */}
        {activeTab === 'manifest' && (
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-precision-white text-xs">
                CONCURRENT SPLIT-DISPATCH MANIFEST: {orderId}
              </span>
              <span className="text-zinc-500 text-[10px]">DIGITAL AUDIT TRAIL</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-zinc-800/80">
                <div className="space-y-0.5">
                  <div className="font-bold text-signal-orange">PACKAGE A // ON-DEMAND ADDITIVE SYSTEM</div>
                  <div className="text-[10px] text-zinc-400">
                    Custom Baseplate (12x8) + Dual Valet Trays • Carbon Fiber Matte Black
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300 font-mono">0.684 KG</div>
                  <div className="text-signal-orange text-[10px]">FEDEX 784201994821</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-zinc-800/80">
                <div className="space-y-0.5">
                  <div className="font-bold text-signal-cyan">PACKAGE B // DOMESTIC FAST-SHIP HARDWARE</div>
                  <div className="text-[10px] text-zinc-400">
                    High-Grip Silicone Baseline Gaskets + Anodized Aluminum Alignment Studs
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300 font-mono">0.312 KG</div>
                  <div className="text-signal-cyan text-[10px]">USPS 940011189922384102</div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1">
              <span>DESTINATION ADDRESS: {selectedDestination.city}, {selectedDestination.state} {selectedDestination.postalCode}</span>
              <span className="text-signal-lime flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3 text-signal-lime" /> AUTOMATED PARCEL COMBINATION AT FINAL CARRIER HUB
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
