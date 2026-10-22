/**
 * FORMGRID CANVAS PROGRESSIVE INDUSTRIAL LOADER
 * Renders animated telemetry coordinates while Three.js WebGL shaders and geometries compile
 */

import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

export const CanvasLoader: React.FC = () => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicks((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black/90 backdrop-blur-md px-6 py-4 rounded-xl border border-surface-border font-mono shadow-2xl text-center space-y-2">
        <Loader2 className="w-5 h-5 text-signal-orange animate-spin" />
        <div className="text-xs font-semibold text-white tracking-widest uppercase">
          PREPARING 3D PREVIEW
        </div>
        <div className="text-[10px] text-zinc-400">
          CALIBRATING PRECISION GRID // {ticks.toString().padStart(2, '0')}%
        </div>
      </div>
    </Html>
  );
};
