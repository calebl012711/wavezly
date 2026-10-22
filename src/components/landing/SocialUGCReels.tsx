/**
 * FORMGRID SOCIAL PROOF & UGC REEL EXPERIENCE
 * "As Seen on TikTok & Instagram" interactive video reel cards.
 * Features simulated vertical video playback, ambient glow, engagement counters,
 * tactile audio haptics via playClickSound, and one-click "Get This Setup" bundle cart dispatch.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { playClickSound } from '../../lib/soundEffects';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Eye,
  Sparkles,
  ShoppingBag,
  Check,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Music,
  Award,
  Layers,
  Flame,
} from 'lucide-react';

export interface UGCReelItem {
  id: string;
  title: string;
  viewsText: string;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  platform: 'tiktok' | 'instagram';
  quote: string;
  caption: string;
  audioTrack: string;
  duration: string;
  accentBadge: string;
  backgroundImage: string;
  productIds: string[];
  setupHighlights: string[];
}

export const UGC_REELS_DATA: UGCReelItem[] = [
  {
    id: 'reel_drop_test',
    title: 'The 3-Second Drop Test (Satisfying ASMR)',
    viewsText: '2.8M Views',
    viewsCount: 2840000,
    likesCount: 248600,
    sharesCount: 41200,
    commentsCount: 1420,
    creatorName: 'Jess Lindqvist',
    creatorHandle: '@jess_spaces',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    quote: 'It drops right into the drawer with zero gap.',
    caption:
      'Tested Formgrid’s custom 3D parametric drawer matrix against the Alex drawer. Literally zero rattle and dropped in with that hydraulic air cushion whoosh 🤤',
    audioTrack: 'Formgrid ASMR • Zero-Tolerance Snap (Original Audio)',
    duration: '0:18',
    accentBadge: 'Satisfying ASMR • 0.2mm Fit',
    backgroundImage: '/assets/products/drawer-matrix-real.jpg',
    productIds: ['prod_drawer_matrix', 'prod_valet_pro'],
    setupHighlights: ['Precision Fillet Radii', 'Zero Shifting or Rattling', 'Obsidian Matte Finish'],
  },
  {
    id: 'reel_ikea_hack',
    title: 'IKEA Alex Drawer Hack Nobody Talks About',
    viewsText: '1.9M Views',
    viewsCount: 1920000,
    likesCount: 182400,
    sharesCount: 36800,
    commentsCount: 984,
    creatorName: 'Marcus Vance',
    creatorHandle: '@marcus_tech',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    quote: 'Throwing away all those cheap sliding plastic bins.',
    caption:
      'Stop using flimsy plastic bins that slide backward every time you open your desk. Formgrid’s parametric grid divider locks into place mechanically. Night and day difference.',
    audioTrack: 'Marcus Vance • IKEA Alex Hack Part 2',
    duration: '0:24',
    accentBadge: 'IKEA Alex Hack • Modular Grid',
    backgroundImage: '/assets/workspaces/workspace-berlin.jpg',
    productIds: ['prod_drawer_matrix', 'prod_hex_bit_tray'],
    setupHighlights: ['Drop-In Drawer Lock', 'Modular Swappable Inserts', 'Hex Bit Magnetic Retention'],
  },
  {
    id: 'reel_desk_reset',
    title: 'Sunday Desk Reset & Deep Clean',
    viewsText: '940K Views',
    viewsCount: 940000,
    likesCount: 89300,
    sharesCount: 12700,
    commentsCount: 632,
    creatorName: 'Clara Vane',
    creatorHandle: '@studio_clara',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    platform: 'instagram',
    quote: 'The matte finish feels like velvet stone.',
    caption:
      'Complete Sunday workspace reset. Replaced my wobbly headphone stand with Formgrid’s heavy cast basalt plinth and merino felt desk mat. The texture absorbs light like an art piece.',
    audioTrack: 'Studio Clara • Sunday Chill Ambient (432Hz)',
    duration: '0:32',
    accentBadge: 'Acoustic Isolation • Cast Basalt',
    backgroundImage: '/assets/products/headphone-plinth-real.jpg',
    productIds: ['prod_headphone_plinth', 'prod_felt_mat'],
    setupHighlights: ['Resonance-Dampened Base', 'Ultra-Dense Merino Wool', 'Velvet Stone Tactile Touch'],
  },
  {
    id: 'reel_edc_plinth',
    title: 'Why your EDC gear needs a custom plinth',
    viewsText: '720K Views',
    viewsCount: 720000,
    likesCount: 64100,
    sharesCount: 9500,
    commentsCount: 419,
    creatorName: 'Dan Rostova',
    creatorHandle: '@everyday_dan',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    quote: 'No more scratching my watch on bare wood.',
    caption:
      'Tired of banging your automatic watch or titanium pens on hard desktop timber? The Valet Pro has microfiber recessed wells and dedicated bays for your daily carry gear.',
    audioTrack: 'Dan Rostova • Precision EDC Audio',
    duration: '0:21',
    accentBadge: 'Precision EDC • Zero Scratch',
    backgroundImage: '/assets/products/valet-pro-real.jpg',
    productIds: ['prod_valet_pro', 'prod_titanium_pen_stand', 'prod_magnetic_dock'],
    setupHighlights: ['Recessed Watch Valet Well', 'Solid Grade 5 Titanium Anchor', 'Neodymium N52 MagSafe Dock'],
  },
];

export interface SocialUGCReelsProps {
  onCustomizeProduct?: (product: Product) => void;
  onNavigateToCustomizer?: () => void;
}

export const SocialUGCReels: React.FC<SocialUGCReelsProps> = ({
  onCustomizeProduct,
  onNavigateToCustomizer,
}) => {
  const [activeReel, setActiveReel] = useState<UGCReelItem | null>(null);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [bookmarkedReels, setBookmarkedReels] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Modal simulated video states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(15);
  const [bundleAdded, setBundleAdded] = useState<boolean>(false);
  const [individualAddedId, setIndividualAddedId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { addStandardItem, openCart } = useCartStore();
  const { setProduct } = useCustomizerStore();

  // Map products for fast resolution
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    SEED_PRODUCTS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Format large numbers cleanly (e.g. 248.6K)
  const formatCount = (count: number, isLiked: boolean) => {
    const effective = isLiked ? count + 1 : count;
    if (effective >= 1000000) {
      return (effective / 1000000).toFixed(1) + 'M';
    }
    if (effective >= 1000) {
      return (effective / 1000).toFixed(1) + 'K';
    }
    return effective.toString();
  };

  // Video progress simulation ticker
  useEffect(() => {
    if (activeReel && isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            // Auto loop
            return 0;
          }
          return prev + 1.25;
        });
      }, 200);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeReel, isPlaying]);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeReel) return;
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReel, isPlaying, isMuted]);

  // Carousel scroll controls
  const handleScrollLeft = () => {
    playClickSound('tick');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    playClickSound('tick');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Open modal
  const handleOpenReel = (reel: UGCReelItem) => {
    playClickSound('snap');
    setActiveReel(reel);
    setIsPlaying(true);
    setPlaybackProgress(0);
    setBundleAdded(false);
  };

  // Close modal
  const handleCloseModal = () => {
    playClickSound('snap');
    setActiveReel(null);
    setIsPlaying(false);
    setBundleAdded(false);
  };

  // Play/pause toggle
  const handleTogglePlay = () => {
    playClickSound('toggle');
    setIsPlaying((prev) => !prev);
  };

  // Mute toggle with ASMR tactile feedback
  const handleToggleMute = () => {
    playClickSound('toggle');
    setIsMuted((prev) => !prev);
  };

  // Toggle Like with haptic feedback
  const handleToggleLike = (e: React.MouseEvent, reelId: string) => {
    e.stopPropagation();
    playClickSound('toggle');
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  // Toggle Bookmark
  const handleToggleBookmark = (e: React.MouseEvent, reelId: string) => {
    e.stopPropagation();
    playClickSound('toggle');
    setBookmarkedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  // Share link copy
  const handleShareLink = (e: React.MouseEvent, reel: UGCReelItem) => {
    e.stopPropagation();
    playClickSound('success');
    setCopiedLink(reel.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `https://formgrid.io/reels/${reel.id}?creator=${encodeURIComponent(reel.creatorHandle)}`
      );
    }
    setTimeout(() => {
      setCopiedLink(null);
    }, 2400);
  };

  // Add entire bundle setup to cart
  const handleAddBundleToCart = (reel: UGCReelItem) => {
    playClickSound('cart');
    playClickSound('success');
    const items = reel.productIds
      .map((id) => productsMap.get(id))
      .filter((p): p is Product => Boolean(p));

    items.forEach((item) => {
      addStandardItem(item, 1);
    });

    setBundleAdded(true);
    setTimeout(() => {
      openCart();
    }, 450);
  };

  // Add individual product to cart
  const handleAddIndividualItem = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playClickSound('cart');
    addStandardItem(product, 1);
    setIndividualAddedId(product.id);
    setTimeout(() => {
      setIndividualAddedId(null);
    }, 1800);
  };

  // Open 3D customizer for product
  const handleCustomizeProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playClickSound('snap');
    setProduct(product);
    if (onCustomizeProduct) {
      onCustomizeProduct(product);
    }
    if (onNavigateToCustomizer) {
      onNavigateToCustomizer();
    }
    handleCloseModal();
  };

  // Products featured in active modal reel
  const activeReelProducts = useMemo(() => {
    if (!activeReel) return [];
    return activeReel.productIds
      .map((id) => productsMap.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [activeReel, productsMap]);

  // Calculate bundle total price
  const bundleTotalPrice = useMemo(() => {
    return activeReelProducts.reduce((sum, item) => sum + item.basePrice, 0);
  }, [activeReelProducts]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans relative border-t border-zinc-200 dark:border-zinc-800">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>As Seen on TikTok & Instagram • 6.3M+ Community Views</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Field-Tested Desk Drops & ASMR Reviews
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Real creators, zero filter. Watch tolerance tests, IKEA drawer conversions, and tactile studio plinths
            in action. Click any reel to inspect and shop the setup.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center space-x-2 self-start md:self-end">
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Scroll UGC reels left"
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Scroll UGC reels right"
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap Scrollable Reel Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-none focus:outline-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {UGC_REELS_DATA.map((reel) => {
          const isLiked = Boolean(likedReels[reel.id]);
          const isBookmarked = Boolean(bookmarkedReels[reel.id]);
          const isCopied = copiedLink === reel.id;

          return (
            <div
              key={reel.id}
              onClick={() => handleOpenReel(reel)}
              className="group relative flex-none w-[285px] sm:w-[310px] h-[520px] rounded-2xl overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-950"
            >
              {/* Background Cover Image with High Res Zoom on Hover */}
              <img
                src={reel.backgroundImage}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Ambient Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60 pointer-events-none" />

              {/* Subtle Ambient Border Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-orange-500/50 transition-colors pointer-events-none" />

              {/* Top Meta Bar */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                {/* Platform Badge */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white tracking-wide shadow-sm">
                  {reel.platform === 'tiktok' ? (
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>TikTok</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      <span>Instagram</span>
                    </span>
                  )}
                </div>

                {/* View Counter Badge */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-zinc-200 shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{reel.viewsText}</span>
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:text-zinc-950 group-hover:border-white">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <span className="mt-2 text-[10px] font-bold tracking-widest text-white/90 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
                  Tap to Watch & Shop
                </span>
              </div>

              {/* Right Vertical Social Interaction Rail */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-3 z-20">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(e, reel.id)}
                  title="Like Reel"
                  className="group/btn flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform active:scale-75 ${
                      isLiked
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-white mt-1 drop-shadow-sm">
                    {formatCount(reel.likesCount, isLiked)}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={(e) => handleShareLink(e, reel)}
                  title="Share Reel Link"
                  className="group/btn flex flex-col items-center cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-transform active:scale-75">
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-semibold text-white mt-1 drop-shadow-sm">
                    {isCopied ? 'Copied' : formatCount(reel.sharesCount, false)}
                  </span>
                </button>

                {/* Comments Counter */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-white mt-1 drop-shadow-sm">
                    {formatCount(reel.commentsCount, false)}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(e, reel.id)}
                  title="Bookmark Setup"
                  className="group/btn flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform active:scale-75 ${
                      isBookmarked
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-white' : ''}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-white mt-1 drop-shadow-sm">Save</span>
                </button>
              </div>

              {/* Bottom Content & Creator Information */}
              <div className="absolute left-0 right-0 bottom-0 p-4 z-10 flex flex-col justify-end text-left">
                {/* Accent Tag */}
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>{reel.accentBadge}</span>
                </div>

                {/* Creator Avatar & Handle */}
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={reel.creatorAvatar}
                    alt={reel.creatorName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-white drop-shadow-sm">{reel.creatorHandle}</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-orange-300 transition-colors drop-shadow-sm">
                  {reel.title}
                </h3>

                {/* Creator Quote Highlight */}
                <p className="text-xs text-zinc-300 mt-1 italic line-clamp-2 drop-shadow-sm">
                  &ldquo;{reel.quote}&rdquo;
                </p>

                {/* Bottom CTA Bar: Get This Setup Button */}
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[10px] font-medium text-zinc-300 truncate max-w-[140px]">
                    <Music className="w-3 h-3 text-zinc-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="truncate">{reel.audioTrack}</span>
                  </div>

                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer group-hover:shadow-orange-600/30">
                    <span>Get Setup</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Creator Setup Reel Modal / Drawer */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-40 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Vertical Simulated Video Player */}
            <div className="relative w-full md:w-[380px] bg-zinc-950 shrink-0 flex items-center justify-center overflow-hidden min-h-[380px] md:min-h-[580px]">
              {/* Background Video Simulator Frame */}
              <img
                src={activeReel.backgroundImage}
                alt={activeReel.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Scrim Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/40 pointer-events-none" />

              {/* Telemetry ASMR HUD Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1.5">
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>DROP TEST: 0.15mm TOLERANCE</span>
                </div>
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-zinc-300">
                  <span>RESIDUAL RATTLE: ZERO (0dB)</span>
                </div>
              </div>

              {/* Top Controls: Audio Mute & Sound Wave Toggle */}
              <div className="absolute top-4 right-14 md:right-4 z-20 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
                </button>
              </div>

              {/* Center Interactive Tap Area for Play/Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer focus:outline-hidden"
              >
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                )}
              </button>

              {/* Bottom Video HUD Scrubber & Audio Info */}
              <div className="absolute left-0 right-0 bottom-0 p-4 z-20 text-white flex flex-col justify-end bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="text-white hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <span>{activeReel.duration}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-zinc-300">
                    <Music className="w-3 h-3 text-orange-400" />
                    <span className="truncate max-w-[150px]">{activeReel.audioTrack}</span>
                  </div>
                </div>

                {/* Progress Bar (Interactive Scrubber) */}
                <div
                  className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                    setPlaybackProgress(percent);
                    playClickSound('tick');
                  }}
                >
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Setup Breakdown & Fast Cart Dispatch */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>CURATED CREATOR SETUP BREAKDOWN</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{activeReel.viewsText}</span>
                  </div>
                </div>

                {/* Creator Profile */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={activeReel.creatorAvatar}
                    alt={activeReel.creatorName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-base font-bold text-zinc-950 dark:text-white">{activeReel.creatorName}</h4>
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {activeReel.creatorHandle}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Verified Workspace Creator • Formgrid Field Ambassador
                    </p>
                  </div>
                </div>

                {/* Creator Quote Banner */}
                <blockquote className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 mb-5">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 italic">
                    &ldquo;{activeReel.quote}&rdquo;
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-normal">
                    {activeReel.caption}
                  </p>
                </blockquote>

                {/* Setup Highlights Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeReel.setupHighlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>{highlight}</span>
                    </span>
                  ))}
                </div>

                {/* Included Products List */}
                <h5 className="flex items-center space-x-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
                  <Layers className="w-3.5 h-3.5 text-orange-500" />
                  <span>Products in this Reel ({activeReelProducts.length})</span>
                </h5>

                <div className="space-y-3 mb-6">
                  {activeReelProducts.map((product) => {
                    const isCustom = product.type === 'custom_3d';
                    const isAdded = individualAddedId === product.id;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={product.images[0] || activeReel.backgroundImage}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700"
                          />
                          <div className="min-w-0">
                            <h6 className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                              {product.title}
                            </h6>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                ${product.basePrice.toFixed(2)}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider ${
                                  isCustom
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                }`}
                              >
                                {isCustom ? 'Custom 3D' : 'Fast-Ship'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for this item */}
                        <div className="flex items-center space-x-2 shrink-0 ml-3">
                          {isCustom && onCustomizeProduct && (
                            <button
                              type="button"
                              onClick={(e) => handleCustomizeProduct(e, product)}
                              title="Customize dimensions and filament in 3D studio"
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Sliders className="w-3.5 h-3.5 text-orange-500" />
                              <span className="hidden sm:inline">Tune 3D</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleAddIndividualItem(e, product)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                              isAdded
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 shadow-xs'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Setup Bundle Checkout Bar */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Complete Setup Bundle:</span>
                    <div className="text-xl font-extrabold text-zinc-950 dark:text-white">
                      ${bundleTotalPrice.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                        (Free Domestic Shipping)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Zero-Rattle Guarantee</span>
                  </div>
                </div>

                {/* Primary CTA: Get This Setup (Add All) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddBundleToCart(activeReel)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
                      bundleAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
                    }`}
                  >
                    {bundleAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Setup Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Get This Complete Setup</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 font-medium text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center"
                  >
                    Keep Exploring Reels
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
