/**
 * WAVEZLY AUGMENTED REALITY (AR) DRAWER QUICK LOOK MODAL
 * Enables desktop-to-mobile QR handoff and native iOS USDZ AR Quick Look.
 * Allows users to place their custom 3D organizer inside their physical desk drawer!
 */

import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  Smartphone,
  QrCode,
  Sparkles,
  X,
  Check,
  Copy,
  ExternalLink,
  Download,
  Box,
  Eye,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';
import {
  exportMeshToUSDZ,
  exportMeshToGLTF,
  launchAppleARQuickLook,
  triggerGltfDownload,
  isAppleARQuickLookSupported,
} from '../../lib/stlExporter';
import { playClickSound } from '../../lib/soundEffects';

interface ARViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  meshRef: THREE.Group | null;
}

export const ARViewModal: React.FC<ARViewModalProps> = ({
  isOpen,
  onClose,
  dimensions,
  material,
  meshRef,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingAR, setIsGeneratingAR] = useState(false);
  const [isExportingGlb, setIsExportingGlb] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Check iOS / Safari environment on mount
  useEffect(() => {
    setIsIOS(isAppleARQuickLookSupported());
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Construct mobile deep-link URL carrying the live parametric specs
  const mobileShareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('len', String(dimensions.length));
    url.searchParams.set('wid', String(dimensions.width));
    url.searchParams.set('hgt', String(dimensions.height));
    url.searchParams.set('rows', String(dimensions.rows));
    url.searchParams.set('cols', String(dimensions.cols));
    url.searchParams.set('mat', material.id);
    url.searchParams.set('ar', '1');
    return url.toString();
  }, [dimensions, material]);

  // High-res QR code URL via qrserver
  const qrCodeImageUrl = useMemo(() => {
    if (!mobileShareUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      mobileShareUrl
    )}&margin=8&color=18-18-27&bgcolor=ffffff`;
  }, [mobileShareUrl]);

  // Copy shareable link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(mobileShareUrl);
      setIsCopied(true);
      playClickSound('tick');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Launch Native Apple AR Quick Look
  const handleLaunchARQuickLook = async () => {
    if (!meshRef) {
      alert('3D Mesh is initializing. Please wait a moment.');
      return;
    }

    try {
      setIsGeneratingAR(true);
      playClickSound('tick');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([15, 30, 15]);
      }

      const { objectUrl } = await exportMeshToUSDZ(meshRef);
      playClickSound('download');
      launchAppleARQuickLook(objectUrl, `wavezly-${dimensions.length}x${dimensions.width}mm.usdz`);
    } catch (err) {
      console.error('Failed to generate USDZ AR model:', err);
      alert('Could not compile AR USDZ geometry. Please try again.');
    } finally {
      setIsGeneratingAR(false);
    }
  };

  // Download GLB for Android Scene Viewer or 3D tools
  const handleDownloadGLB = async () => {
    if (!meshRef) return;
    try {
      setIsExportingGlb(true);
      playClickSound('tick');
      const { blob } = await exportMeshToGLTF(meshRef, { binary: true });
      triggerGltfDownload(blob, `wavezly-${dimensions.length}x${dimensions.width}mm.glb`);
      playClickSound('download');
    } catch (err) {
      console.error('Failed to export GLB:', err);
    } finally {
      setIsExportingGlb(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ar-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AR Quick Look modal"
          className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/50 text-[#FF6B00] border border-orange-200/80 dark:border-orange-800/60">
            <Sparkles className="w-3 h-3" />
            Apple Quick Look & AR
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">True 1:1 Scale</span>
        </div>

        <h3 id="ar-modal-title" className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
          View in Your Physical Drawer
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Place this bespoke {dimensions.length}×{dimensions.width}mm organizer inside your actual desk drawer before ordering to verify millimeter glide clearance.
        </p>

        {/* Main Content: Conditional Mobile iOS Quick Look vs Desktop QR Code */}
        <div className="mt-5 space-y-4">
          {/* iOS Direct AR Button (If in iOS Safari) */}
          {isIOS ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/80 dark:border-orange-900/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Box className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Apple AR Quick Look Ready
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Point your camera into your desk drawer to see the exact millimeter fit.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLaunchARQuickLook}
                disabled={isGeneratingAR}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm bg-[#FF6B00] hover:bg-[#ea5f00] text-white transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isGeneratingAR ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling 1:1 USDZ Model...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Open AR View in Drawer (USDZ)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Desktop / Non-iOS: Interactive QR Code Handoff */
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* QR Code Container */}
              <div className="relative shrink-0 p-2.5 bg-white rounded-2xl shadow-sm border border-zinc-200/80">
                {qrCodeImageUrl ? (
                  <img
                    src={qrCodeImageUrl}
                    alt="Scan QR code for Wavezly mobile AR"
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain"
                    width={160}
                    height={160}
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center text-zinc-400">
                    <QrCode className="w-10 h-10 animate-pulse" />
                  </div>
                )}
                {/* Floating Apple / Android badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                  iOS & Android Handoff
                </div>
              </div>

              {/* Instructions */}
              <div className="flex-1 space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <Smartphone className="w-4 h-4 text-[#FF6B00]" />
                  <span>Scan with Your Phone Camera</span>
                </div>

                <ol className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-decimal list-inside pl-0.5">
                  <li>
                    Open the <strong>Camera app</strong> on your iPhone or iPad.
                  </li>
                  <li>
                    Point at the QR code and tap the <strong>Yellow Link</strong>.
                  </li>
                  <li>
                    Tap <strong>"View in your Drawer"</strong> to place at 1:1 scale!
                  </li>
                </ol>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Mobile Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={mobileShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs flex items-center gap-1 transition"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Scale & Dimensions Indicator */}
          <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                1:1 Calibrated Physical Footprint:
              </span>
            </div>
            <span className="font-mono font-bold text-[#FF6B00]">
              {dimensions.length} × {dimensions.width} × {dimensions.height} mm
            </span>
          </div>

          {/* Direct Model Export Downloads (USDZ & GLB) */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-zinc-400">Direct 3D Formats:</span>

            <div className="flex items-center gap-2">
              {/* USDZ direct export */}
              <button
                type="button"
                onClick={handleLaunchARQuickLook}
                disabled={isGeneratingAR}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Download Apple USDZ model"
              >
                {isGeneratingAR ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span>.USDZ (Apple Quick Look)</span>
              </button>

              {/* GLB direct export */}
              <button
                type="button"
                onClick={handleDownloadGLB}
                disabled={isExportingGlb}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Download binary GLTF .GLB model"
              >
                {isExportingGlb ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span>.GLB (Scene Viewer)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
