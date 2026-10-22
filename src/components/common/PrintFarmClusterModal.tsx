/**
 * FORMGRID PRINT FARM CLUSTER TELEMETRY MODAL
 * Real-time monitoring dashboard for the 34-node automated additive manufacturing cluster.
 * Dieter Rams industrial functionalism aesthetic: high-contrast telemetry, procedural CRT scanline
 * webcam simulator, real-time nozzle/bed thermal gauges, and live slicing queue.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Cpu,
  Flame,
  Activity,
  Video,
  RefreshCw,
  Clock,
  Layers,
  Crosshair,
  Zap,
  CheckCircle2,
  Radio,
  Terminal,
} from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

export type NodeStatus = 'extruding' | 'laser_scanning' | 'preheating' | 'idle';

export interface FarmNode {
  id: number;
  name: string;
  status: NodeStatus;
  jobName: string;
  material: string;
  currentLayer: number;
  totalLayers: number;
  progressPercent: number;
  nozzleTemp: number;
  targetNozzleTemp: number;
  bedTemp: number;
  targetBedTemp: number;
  chamberTemp: number;
  fanSpeedRpm: number;
  flowRate: number;
  etaMinutes: number;
  headX: number;
  headY: number;
  headZ: number;
}

export interface SlicingQueueItem {
  id: string;
  jobName: string;
  sku: string;
  material: string;
  color: string;
  layerHeightMm: number;
  infillType: string;
  infillPercent: number;
  status: 'slicing' | 'gcode_ready' | 'queued' | 'dispatching';
  progressPercent: number;
  estimatedMinutes: number;
  assignedNodeId?: number;
}

interface PrintFarmClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate initial 34 crafting printers with realistic studio distribution
const INITIAL_NODES: FarmNode[] = Array.from({ length: 34 }, (_, i) => {
  const id = i + 1;
  const statusCycle: NodeStatus[] = [
    'extruding', 'extruding', 'extruding', 'laser_scanning',
    'extruding', 'preheating', 'extruding', 'idle'
  ];
  const status = id === 12 ? 'extruding' : statusCycle[i % statusCycle.length];

  const jobNames = [
    'IKEA Alex Tray',
    'Desk Valet Pro Dock',
    'Modular Hexagon Organizer',
    'Wide Desk Pad Station',
    'Segmented Cable Spine',
    'Ergonomic Keyboard Rest',
    'Dual Riser Tray',
    'Precision Pen Trough',
  ];
  const materials = [
    'Matte Charcoal',
    'Terracotta Sand',
    'Slate Gray',
    'Olive Clay',
    'Chalk White',
  ];

  const totalLayers = 380 + ((id * 37) % 240);
  const progressPercent = id === 12 ? 64 : status === 'extruding' ? (15 + ((id * 23) % 75)) : status === 'laser_scanning' ? 6 : 0;
  const currentLayer = Math.floor((progressPercent / 100) * totalLayers);

  const jobName = id === 12
    ? 'IKEA Alex Tray'
    : status === 'idle'
    ? 'Ready for Next Order'
    : jobNames[i % jobNames.length];

  const material = id === 12
    ? 'Matte Charcoal'
    : materials[i % materials.length];

  return {
    id,
    name: `Printer #${id.toString().padStart(2, '0')}`,
    status,
    jobName,
    material,
    currentLayer,
    totalLayers,
    progressPercent,
    nozzleTemp: status === 'extruding' ? 215 + ((id % 3) * 1.5) : status === 'preheating' ? 142 : status === 'laser_scanning' ? 160 : 26,
    targetNozzleTemp: status === 'idle' ? 0 : 220,
    bedTemp: status === 'idle' ? 24 : 55 + (id % 5),
    targetBedTemp: status === 'idle' ? 0 : 60,
    chamberTemp: 34 + (id % 6),
    fanSpeedRpm: status === 'extruding' ? 2400 : 0,
    flowRate: status === 'extruding' ? 14.2 + ((id % 5) * 0.4) : 0,
    etaMinutes: status === 'extruding' ? Math.max(8, 120 - Math.floor((progressPercent / 100) * 110)) : 0,
    headX: 45 + ((id * 17) % 160),
    headY: 30 + ((id * 19) % 150),
    headZ: (currentLayer * 0.20),
  };
});

const INITIAL_QUEUE: SlicingQueueItem[] = [
  {
    id: 'JOB-FG-9821',
    jobName: 'IKEA Alex Deep Tray // Matte Charcoal',
    sku: 'FG-IAT-01',
    material: 'Matte Charcoal Biopolymer',
    color: '#1a1a1a',
    layerHeightMm: 0.20,
    infillType: 'Gyroid',
    infillPercent: 18,
    status: 'slicing',
    progressPercent: 88,
    estimatedMinutes: 84,
    assignedNodeId: 12,
  },
  {
    id: 'JOB-FG-9822',
    jobName: 'Valet Pro Desk Dock // Terracotta Sand',
    sku: 'FG-VPD-02',
    material: 'Terracotta Sand Biopolymer',
    color: '#9a4e32',
    layerHeightMm: 0.16,
    infillType: 'Gyroid',
    infillPercent: 24,
    status: 'gcode_ready',
    progressPercent: 100,
    estimatedMinutes: 62,
    assignedNodeId: 8,
  },
  {
    id: 'JOB-FG-9823',
    jobName: 'Modular Hexagon Desk Tidy // Slate Gray',
    sku: 'FG-HEX-03',
    material: 'Slate Gray Biopolymer',
    color: '#27272a',
    layerHeightMm: 0.20,
    infillType: 'Honeycomb',
    infillPercent: 20,
    status: 'queued',
    progressPercent: 0,
    estimatedMinutes: 115,
  },
  {
    id: 'JOB-FG-9824',
    jobName: 'Precision Pen & Ruler Tray // Olive Clay',
    sku: 'FG-PEN-04',
    material: 'Olive Clay Biopolymer',
    color: '#555e4e',
    layerHeightMm: 0.12,
    infillType: 'Adaptive Cubic',
    infillPercent: 30,
    status: 'queued',
    progressPercent: 0,
    estimatedMinutes: 145,
  },
  {
    id: 'JOB-FG-9825',
    jobName: 'Dual Slot Organizer // Chalk White',
    sku: 'FG-DSO-05',
    material: 'Chalk White Biopolymer',
    color: '#e4e4e7',
    layerHeightMm: 0.20,
    infillType: 'Gyroid',
    infillPercent: 18,
    status: 'queued',
    progressPercent: 0,
    estimatedMinutes: 92,
  },
];

export const PrintFarmClusterModal: React.FC<PrintFarmClusterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [nodes, setNodes] = useState<FarmNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<number>(12);
  const [filter, setFilter] = useState<'all' | NodeStatus>('all');
  const [queue] = useState<SlicingQueueItem[]>(INITIAL_QUEUE);
  const [isSimPaused, setIsSimPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'webcam' | 'queue'>('telemetry');
  const [diagnosticsLog, setDiagnosticsLog] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Esc key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live simulation tick: jitter temperatures, advance layer progress, animate coordinates
  useEffect(() => {
    if (!isOpen || isSimPaused) return;

    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.status === 'idle') return node;

          // Tiny thermal flutter (±0.3°C)
          const nozzleJitter = (Math.random() - 0.48) * 0.6;
          const bedJitter = (Math.random() - 0.5) * 0.2;
          const newNozzle = Math.min(225, Math.max(205, Number((node.nozzleTemp + nozzleJitter).toFixed(1))));
          const newBed = Math.min(65, Math.max(50, Number((node.bedTemp + bedJitter).toFixed(1))));

          // Coordinates wander along toolpath
          const dx = (Math.random() - 0.5) * 12;
          const dy = (Math.random() - 0.5) * 12;
          const newX = Math.min(210, Math.max(20, Number((node.headX + dx).toFixed(2))));
          const newY = Math.min(210, Math.max(20, Number((node.headY + dy).toFixed(2))));

          // Slowly advance progress
          const progressInc = node.status === 'extruding' ? 0.05 : 0;
          const newProgress = Math.min(100, Number((node.progressPercent + progressInc).toFixed(2)));
          const newLayer = Math.floor((newProgress / 100) * node.totalLayers);

          return {
            ...node,
            nozzleTemp: newNozzle,
            bedTemp: newBed,
            headX: newX,
            headY: newY,
            headZ: Number((newLayer * 0.20).toFixed(2)),
            progressPercent: newProgress >= 100 ? 0 : newProgress,
            currentLayer: newProgress >= 100 ? 0 : newLayer,
          };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, isSimPaused]);

  // Selected node reference
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  // Status counts for telemetry header
  const counts = useMemo(() => {
    const res = { extruding: 0, laser_scanning: 0, preheating: 0, idle: 0 };
    nodes.forEach((n) => {
      res[n.status]++;
    });
    return res;
  }, [nodes]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (filter === 'all') return nodes;
    return nodes.filter((n) => n.status === filter);
  }, [nodes, filter]);

  // Procedural Canvas Webcam Simulator
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark industrial camera grain
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);

      // 1. Isometric Print Bed Grid
      const originX = width / 2;
      const originY = height / 2 + 35;
      const gridScale = 3.2;
      const gridSize = 32;

      ctx.save();
      ctx.strokeStyle = 'rgba(70, 70, 85, 0.35)';
      ctx.lineWidth = 1;

      // Draw isometric grid lines
      for (let i = -gridSize; i <= gridSize; i += 8) {
        // Line along U axis
        const x1 = originX + (i - gridSize) * gridScale * 1.4;
        const y1 = originY + (i + gridSize) * gridScale * 0.7;
        const x2 = originX + (i + gridSize) * gridScale * 1.4;
        const y2 = originY + (i - gridSize) * gridScale * 0.7;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Line along V axis
        const x3 = originX + (-gridSize - i) * gridScale * 1.4;
        const y3 = originY + (gridSize - i) * gridScale * 0.7;
        const x4 = originX + (gridSize - i) * gridScale * 1.4;
        const y4 = originY + (-gridSize - i) * gridScale * 0.7;

        ctx.beginPath();
        ctx.moveTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.stroke();
      }

      // Outer build plate border with chamfered corners
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX - gridSize * gridScale * 1.4, originY);
      ctx.lineTo(originX, originY + gridSize * gridScale * 0.7);
      ctx.lineTo(originX + gridSize * gridScale * 1.4, originY);
      ctx.lineTo(originX, originY - gridSize * gridScale * 0.7);
      ctx.closePath();
      ctx.stroke();

      // 2. Printed Part Representation (Valet Tray contour building up)
      const partLayers = Math.max(4, Math.floor((selectedNode.currentLayer / selectedNode.totalLayers) * 22));
      const partW = 38;
      const partH = 26;

      for (let l = 0; l < partLayers; l++) {
        const layerZ = l * 1.8;
        ctx.strokeStyle = l === partLayers - 1 ? '#ff5500' : 'rgba(161, 161, 170, 0.45)';
        ctx.lineWidth = l === partLayers - 1 ? 2.5 : 1.5;

        const bx = originX;
        const by = originY - layerZ;

        ctx.beginPath();
        ctx.moveTo(bx - partW, by);
        ctx.lineTo(bx, by + partH);
        ctx.lineTo(bx + partW, by);
        ctx.lineTo(bx, by - partH);
        ctx.closePath();
        ctx.stroke();

        // Inner organizer pocket
        if (l % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(bx - partW * 0.65, by);
          ctx.lineTo(bx, by + partH * 0.65);
          ctx.lineTo(bx + partW * 0.65, by);
          ctx.lineTo(bx, by - partH * 0.65);
          ctx.closePath();
          ctx.stroke();
        }
      }

      // 3. Gantry Hotend Extruder Head
      const headIsoX = originX + Math.sin(t * 1.8) * 32;
      const headIsoY = originY - partLayers * 1.8 + Math.cos(t * 2.2) * 14;

      // Extruder body
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(headIsoX - 12, headIsoY - 38, 24, 28);
      ctx.fill();
      ctx.stroke();

      // Hotend heatsink ribs
      ctx.strokeStyle = '#71717a';
      ctx.beginPath();
      ctx.moveTo(headIsoX - 8, headIsoY - 24);
      ctx.lineTo(headIsoX + 8, headIsoY - 24);
      ctx.moveTo(headIsoX - 8, headIsoY - 20);
      ctx.lineTo(headIsoX + 8, headIsoY - 20);
      ctx.moveTo(headIsoX - 8, headIsoY - 16);
      ctx.lineTo(headIsoX + 8, headIsoY - 16);
      ctx.stroke();

      // Brass Nozzle Tip
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(headIsoX - 4, headIsoY - 10);
      ctx.lineTo(headIsoX + 4, headIsoY - 10);
      ctx.lineTo(headIsoX, headIsoY);
      ctx.closePath();
      ctx.fill();

      // Extrusion Glow / Spark if extruding
      if (selectedNode.status === 'extruding') {
        const glowRad = 6 + Math.sin(t * 8) * 2;
        const grad = ctx.createRadialGradient(headIsoX, headIsoY, 1, headIsoX, headIsoY, glowRad);
        grad.addColorStop(0, 'rgba(255, 85, 0, 1)');
        grad.addColorStop(0.5, 'rgba(255, 85, 0, 0.4)');
        grad.addColorStop(1, 'rgba(255, 85, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(headIsoX, headIsoY, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. LiDAR Laser Scanning Beam if laser_scanning
      if (selectedNode.status === 'laser_scanning') {
        const scanY = (Math.sin(t * 1.5) * 0.5 + 0.5) * height;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // LiDAR Point Cloud Dots
        ctx.fillStyle = '#00e5ff';
        for (let p = 0; p < 18; p++) {
          const px = (width / 18) * p + ((p * 13) % 15);
          const py = scanY + Math.sin(t * 4 + p) * 8;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Preheating Heat Map Glow
      if (selectedNode.status === 'preheating') {
        ctx.fillStyle = `rgba(245, 158, 11, ${0.12 + Math.sin(t * 3) * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(originX - gridSize * gridScale * 1.4, originY);
        ctx.lineTo(originX, originY + gridSize * gridScale * 0.7);
        ctx.lineTo(originX + gridSize * gridScale * 1.4, originY);
        ctx.lineTo(originX, originY - gridSize * gridScale * 0.7);
        ctx.closePath();
        ctx.fill();
      }

      // 6. Crosshair HUD
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headIsoX - 16, headIsoY);
      ctx.lineTo(headIsoX - 6, headIsoY);
      ctx.moveTo(headIsoX + 6, headIsoY);
      ctx.lineTo(headIsoX + 16, headIsoY);
      ctx.moveTo(headIsoX, headIsoY - 16);
      ctx.lineTo(headIsoX, headIsoY - 6);
      ctx.moveTo(headIsoX, headIsoY + 6);
      ctx.lineTo(headIsoX, headIsoY + 16);
      ctx.stroke();

      // 7. CRT Raster Scanline Sweep & Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      // Vertical sweeping raster glow
      const sweepY = ((t * 45) % (height + 60)) - 30;
      const sweepGrad = ctx.createLinearGradient(0, sweepY - 20, 0, sweepY + 20);
      sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      sweepGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
      sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, sweepY - 20, width, 40);

      // 8. OSD Technical Telemetry Text
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`CAM // ${selectedNode.name} - OVERHEAD 3D AXIS`, 12, 18);

      ctx.fillStyle = '#71717a';
      ctx.fillText(`TOOL: G1 X${selectedNode.headX.toFixed(2)} Y${selectedNode.headY.toFixed(2)} Z${selectedNode.headZ.toFixed(2)}`, 12, height - 12);

      // Live timestamp & recording badge
      const now = new Date();
      const timecode = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`;

      ctx.fillStyle = '#ff5500';
      ctx.beginPath();
      ctx.arc(width - 92, 14, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f4f4f5';
      ctx.fillText(`LIVE ${timecode}`, width - 82, 18);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, selectedNode]);

  if (!isOpen) return null;

  const triggerDiagnostic = () => {
    playClickSound('snap');
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticsLog((prev) => [
      `[${timestamp}] PRECISION FIT CHECK: Printer #${selectedNode.id} calibrated and running at peak quality`,
      `[${timestamp}] MATERIAL SENSOR: Continuous flow rate 100% nominal (Silky Matte Finish)`,
      `[${timestamp}] BED MESH: 36-point micro-matrix calibrated to ±0.03mm (100% Guaranteed Fit)`,
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-3 sm:px-6 py-6 flex items-center justify-center font-mono">
        <div className="relative w-full max-w-6xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
          
          {/* Top Crafting Studio Header */}
          <div className="px-5 py-4 bg-surface-subtle border-b border-surface-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-signal-orange" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold tracking-tight text-white uppercase font-sans">
                    LOOK INSIDE OUR CRAFTING STUDIO
                  </h2>
                  <span className="px-1.5 py-0.5 rounded bg-signal-lime/10 text-signal-lime text-[10px] font-mono border border-signal-lime/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-lime animate-pulse" />
                    <span>34 PRINTERS CRAFTING LIVE</span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Real 3D crafting printers building customer trays right now in Boise, Idaho • Made in USA
                </p>
              </div>
            </div>

            {/* Quick Metrics & Close Button */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="hidden md:flex items-center space-x-3 text-[11px] text-zinc-400 border-r border-surface-border pr-4">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-signal-lime" />
                  <span>{counts.extruding} CRAFTING</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-signal-cyan" />
                  <span>{counts.laser_scanning} LEVELING</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-signal-amber" />
                  <span>{counts.preheating} WARMING UP</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span>{counts.idle} READY</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound('toggle');
                  setIsSimPaused((p) => !p);
                }}
                className="px-2.5 py-1 text-[11px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center space-x-1 transition"
              >
                <Activity className="w-3 h-3 text-signal-cyan" />
                <span>{isSimPaused ? 'RESUME STREAM' : 'PAUSE TICK'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound('snap');
                  onClose();
                }}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-5 py-2.5 bg-surface border-b border-surface-border flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('telemetry');
                }}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'telemetry'
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold shadow-tactile'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-signal-orange" />
                <span>OUR CRAFTING PRINTERS (34)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('webcam');
                }}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'webcam'
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold shadow-tactile'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-signal-cyan" />
                <span>LIVE PRINTER WEBCAM</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('queue');
                }}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'queue'
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold shadow-tactile'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-signal-lime" />
                <span>UPCOMING ORDERS QUEUE</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
                  {queue.length}
                </span>
              </button>
            </div>

            {/* Filter Pills for the Printers */}
            {activeTab === 'telemetry' && (
              <div className="hidden sm:flex items-center space-x-1.5 text-[11px]">
                <span className="text-zinc-500 mr-1">FILTER:</span>
                {(['all', 'extruding', 'laser_scanning', 'preheating', 'idle'] as const).map((mode) => {
                  const filterLabels: Record<string, string> = {
                    all: 'ALL',
                    extruding: 'CRAFTING',
                    laser_scanning: 'LEVELING',
                    preheating: 'WARMING UP',
                    idle: 'READY',
                  };
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        playClickSound('toggle');
                        setFilter(mode);
                      }}
                      className={`px-2 py-0.5 rounded uppercase transition ${
                        filter === mode
                          ? 'bg-signal-orange/15 text-signal-orange border border-signal-orange/40 font-bold'
                          : 'text-zinc-400 hover:text-zinc-200 bg-surface-subtle'
                      }`}
                    >
                      {filterLabels[mode]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* SECTION 1: Active Inspected Node HUD Bar & Thermal Gauges */}
            <div className="bg-surface-subtle border border-surface-border rounded-xl p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-surface-border pb-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-signal-orange font-bold uppercase tracking-widest">
                      Active Printer #{selectedNode.id}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs text-zinc-100 font-semibold">
                      {selectedNode.status === 'idle'
                        ? 'is ready for the next customer order'
                        : `is crafting an ${selectedNode.jobName} in ${selectedNode.material}`}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      selectedNode.status === 'extruding'
                        ? 'bg-signal-lime/10 text-signal-lime border-signal-lime/30'
                        : selectedNode.status === 'laser_scanning'
                        ? 'bg-signal-cyan/10 text-signal-cyan border-signal-cyan/30'
                        : selectedNode.status === 'preheating'
                        ? 'bg-signal-amber/10 text-signal-amber border-signal-amber/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {selectedNode.status === 'extruding'
                        ? 'Crafting Live'
                        : selectedNode.status === 'laser_scanning'
                        ? 'Laser Leveling'
                        : selectedNode.status === 'preheating'
                        ? 'Warming Up'
                        : 'Ready'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 mt-1">
                    <span>Material: {selectedNode.material}</span>
                    <span>•</span>
                    <span>Studio: Boise, Idaho Workshop</span>
                    <span>•</span>
                    <span>Est. Time Left: {selectedNode.etaMinutes > 0 ? `${selectedNode.etaMinutes} min` : 'Next up'}</span>
                    <span>•</span>
                    <span>Quality: 100% Guaranteed Fit</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
                  <button
                    type="button"
                    onClick={triggerDiagnostic}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-zinc-700 hover:border-signal-cyan text-xs text-zinc-200 flex items-center space-x-1.5 transition"
                  >
                    <Terminal className="w-3.5 h-3.5 text-signal-cyan" />
                    <span>PRECISION FIT CHECK</span>
                  </button>
                </div>
              </div>

              {/* Dieter Rams Analog/Digital Precision Temperature Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Gauge 1: Nozzle Temperature */}
                <div className="bg-surface border border-surface-border rounded-lg p-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase mb-1">
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-signal-orange" />
                      <span>NOZZLE TEMPERATURE</span>
                    </span>
                    <span className="text-zinc-500">TARGET: {selectedNode.targetNozzleTemp}°C</span>
                  </div>

                  <div className="flex items-baseline space-x-1.5 my-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {selectedNode.nozzleTemp.toFixed(1)}
                    </span>
                    <span className="text-xs text-signal-orange font-bold">°C</span>
                  </div>

                  {/* Progress bar gauge */}
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="bg-signal-orange h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (selectedNode.nozzleTemp / 260) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                    <span>0°C</span>
                    <span>260°C MAX</span>
                  </div>
                </div>

                {/* Gauge 2: Bed Temperature */}
                <div className="bg-surface border border-surface-border rounded-lg p-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase mb-1">
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-signal-cyan" />
                      <span>BED TEMPERATURE</span>
                    </span>
                    <span className="text-zinc-500">TARGET: {selectedNode.targetBedTemp}°C</span>
                  </div>

                  <div className="flex items-baseline space-x-1.5 my-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {selectedNode.bedTemp.toFixed(1)}
                    </span>
                    <span className="text-xs text-signal-cyan font-bold">°C</span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="bg-signal-cyan h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (selectedNode.bedTemp / 100) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                    <span>20°C</span>
                    <span>100°C MAX</span>
                  </div>
                </div>

                {/* Gauge 3: Layer Progress */}
                <div className="bg-surface border border-surface-border rounded-lg p-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase mb-1">
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-signal-lime" />
                      <span>LAYER PROGRESS</span>
                    </span>
                    <span className="text-zinc-500">
                      {selectedNode.currentLayer} / {selectedNode.totalLayers}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-1.5 my-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {selectedNode.progressPercent.toFixed(1)}
                    </span>
                    <span className="text-xs text-signal-lime font-bold">%</span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="bg-signal-lime h-full rounded-full transition-all duration-300"
                      style={{ width: `${selectedNode.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                    <span>Z: {selectedNode.headZ} mm</span>
                    <span>{selectedNode.etaMinutes}M REMAINING</span>
                  </div>
                </div>

                {/* Gauge 4: Extrusion Flow & Coordinate Toolhead */}
                <div className="bg-surface border border-surface-border rounded-lg p-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase mb-1">
                    <span className="flex items-center space-x-1">
                      <Crosshair className="w-3 h-3 text-precision-zinc" />
                      <span>TOOLHEAD XYZ</span>
                    </span>
                    <span className="text-zinc-500">OPTICAL ENCODER</span>
                  </div>

                  <div className="text-xs font-mono space-y-0.5 my-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>X-AXIS:</span>
                      <span className="font-bold text-white">{selectedNode.headX.toFixed(2)} mm</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Y-AXIS:</span>
                      <span className="font-bold text-white">{selectedNode.headY.toFixed(2)} mm</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[9px] text-zinc-500 mt-2 border-t border-zinc-800 pt-1">
                    <span>ACCEL: 20,000 mm/s²</span>
                    <span>JERK: 9.0</span>
                  </div>
                </div>

              </div>

              {/* Diagnostic output readout if present */}
              {diagnosticsLog.length > 0 && (
                <div className="mt-3 bg-black/50 border border-zinc-800 rounded p-2 text-[10px] text-zinc-400 font-mono space-y-0.5">
                  {diagnosticsLog.slice(0, 3).map((line, idx) => (
                    <div key={idx} className="text-signal-cyan/90 font-mono">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAB 1: 34-PRINTER STATUS MATRIX */}
            {activeTab === 'telemetry' && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white uppercase tracking-wider">
                      34 STUDIO CRAFTING PRINTERS
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      (Click any printer to watch live crafting progress and webcam feed)
                    </span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">
                    SHOWING {filteredNodes.length} OF 34 PRINTERS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {filteredNodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          playClickSound('tick');
                          setSelectedNodeId(node.id);
                        }}
                        className={`text-left p-2.5 rounded-lg border transition text-xs font-mono relative overflow-hidden group ${
                          isSelected
                            ? 'bg-zinc-800/90 border-signal-orange ring-1 ring-signal-orange shadow-tactile'
                            : 'bg-surface hover:bg-surface-subtle border-surface-border hover:border-zinc-700'
                        }`}
                      >
                        {/* Top Node Header */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-bold ${isSelected ? 'text-signal-orange' : 'text-zinc-200'}`}>
                            {node.name}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            node.status === 'extruding'
                              ? 'bg-signal-lime animate-pulse'
                              : node.status === 'laser_scanning'
                              ? 'bg-signal-cyan animate-pulse'
                              : node.status === 'preheating'
                              ? 'bg-signal-amber animate-pulse'
                              : 'bg-zinc-600'
                          }`} />
                        </div>

                        {/* Status Label */}
                        <div className="text-[10px] text-zinc-400 truncate mb-1">
                          {node.status === 'idle' ? 'Ready for Order' : node.jobName}
                        </div>

                        {/* Progress or Status Readout */}
                        {node.status === 'extruding' ? (
                          <div className="space-y-1">
                            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                              <div
                                className="bg-signal-lime h-full rounded-full"
                                style={{ width: `${node.progressPercent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-zinc-500">
                              <span>{node.progressPercent.toFixed(0)}% crafted</span>
                              <span>{node.nozzleTemp.toFixed(0)}°C</span>
                            </div>
                          </div>
                        ) : node.status === 'laser_scanning' ? (
                          <div className="text-[9px] text-signal-cyan font-mono flex items-center justify-between">
                            <span>LEVELING BED</span>
                            <span>{node.bedTemp.toFixed(0)}°C</span>
                          </div>
                        ) : node.status === 'preheating' ? (
                          <div className="text-[9px] text-signal-amber font-mono flex items-center justify-between">
                            <span>WARMING UP</span>
                            <span>{node.nozzleTemp.toFixed(0)}°C</span>
                          </div>
                        ) : (
                          <div className="text-[9px] text-zinc-500 font-mono">
                            READY FOR QUEUE
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: IN-SITU WEBCAM SIMULATION */}
            {activeTab === 'webcam' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-signal-cyan" />
                    <span className="font-bold text-white uppercase">
                      LIVE WORKSHOP CAMERA // {selectedNode.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700">
                      BOISE WORKSHOP FEED
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    REAL-TIME 3D CRAFTING IN PROGRESS
                  </span>
                </div>

                {/* Procedural Canvas Box */}
                <div className="relative rounded-xl overflow-hidden border border-surface-border bg-black shadow-tactile aspect-video max-h-[480px] w-full flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={854}
                    height={480}
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle Corner Caliper Targets */}
                  <div className="absolute top-3 left-3 pointer-events-none text-[9px] font-mono text-zinc-500">
                    FORMGRID CRAFTING STUDIO // BOISE, IDAHO
                  </div>
                  <div className="absolute top-3 right-3 pointer-events-none text-[9px] font-mono text-signal-orange">
                    ● LIVE [30 FPS]
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-surface border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                      STUDIO CAMERA SPEC
                    </span>
                    <div className="text-zinc-300 text-[11px] space-y-0.5">
                      <div>SENSOR: High-Definition In-Chamber Optical</div>
                      <div>RESOLUTION: 1080p Live Workshop Stream</div>
                      <div>LOCATION: Boise, Idaho Additive Workshop</div>
                    </div>
                  </div>

                  <div className="bg-surface border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                      AUTOMATED QUALITY INSPECTION
                    </span>
                    <div className="text-zinc-300 text-[11px] space-y-0.5">
                      <div className="text-signal-lime font-bold">100% PERFECT FIT GUARANTEE</div>
                      <div>SURFACE CHECK: Flawless layer-by-layer optical audit</div>
                      <div>BUILD BED: Textured PEI for crisp, clean bottoms</div>
                    </div>
                  </div>

                  <div className="bg-surface border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                      PRECISION CRAFTING GANTRY
                    </span>
                    <div className="text-zinc-300 text-[11px] space-y-0.5">
                      <div>MOTION TUNING: Active Vibration Compensation</div>
                      <div>TOLERANCE: Precision within ±0.03mm</div>
                      <div>EXTRUDER: Continuous micro-stepping flow</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SLICING DISPATCH QUEUE */}
            {activeTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider">
                      UPCOMING CUSTOMER ORDERS IN QUEUE
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Trays prepared by our digital craftsmen, awaiting printer assignment in Boise, Idaho
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-surface border border-zinc-700 text-zinc-300 text-[11px]">
                    STUDIO WORKSHOP: BOISE HUB
                  </span>
                </div>

                <div className="border border-surface-border rounded-xl overflow-hidden bg-surface">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-subtle text-zinc-400 text-[10px] uppercase border-b border-surface-border">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">POS</th>
                        <th className="py-2.5 px-4 font-semibold">JOB ID & PRODUCT</th>
                        <th className="py-2.5 px-4 font-semibold">MATERIAL / SPECS</th>
                        <th className="py-2.5 px-4 font-semibold">STATUS</th>
                        <th className="py-2.5 px-4 font-semibold">EST. TIME</th>
                        <th className="py-2.5 px-4 font-semibold text-right">ASSIGNED PRINTER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border text-zinc-300">
                      {queue.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-surface-subtle/50 transition">
                          <td className="py-3 px-4 font-mono text-zinc-500">
                            #{String(idx + 1).padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{item.jobName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{item.id} • SKU: {item.sku}</div>
                          </td>
                          <td className="py-3 px-4 text-[11px]">
                            <div className="flex items-center space-x-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-zinc-600"
                                style={{ backgroundColor: item.color }}
                              />
                              <span>{item.material}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {item.layerHeightMm}mm finish • {item.infillType} {item.infillPercent}% core
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {item.status === 'slicing' ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center space-x-1 text-signal-orange text-[11px] font-semibold">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>PREPARING {item.progressPercent}%</span>
                                </span>
                                <div className="w-24 bg-zinc-800 h-1 rounded-full overflow-hidden">
                                  <div
                                    className="bg-signal-orange h-full rounded-full"
                                    style={{ width: `${item.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            ) : item.status === 'gcode_ready' ? (
                              <span className="inline-flex items-center space-x-1 text-signal-lime text-[11px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>READY TO CRAFT</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-zinc-400 text-[11px]">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                <span>IN WORKSHOP PIPELINE</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {item.estimatedMinutes}m
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.assignedNodeId ? (
                              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-signal-orange font-mono text-[10px] font-bold">
                                PRINTER #{String(item.assignedNodeId).padStart(2, '0')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">
                                AUTO-ROUTING
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls & Telemetry Stats */}
          <div className="px-5 py-3 bg-surface-subtle border-t border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 text-zinc-400 text-[11px]">
              <span className="flex items-center space-x-1">
                <Radio className="w-3 h-3 text-signal-lime" />
                <span>BOISE CRAFTING STUDIO: LIVE & CONNECTED</span>
              </span>
              <span>•</span>
              <span>100% PERFECT FIT GUARANTEE</span>
              <span>•</span>
              <span>MADE IN USA</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs transition cursor-pointer"
              >
                CLOSE WORKSHOP VIEW
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
