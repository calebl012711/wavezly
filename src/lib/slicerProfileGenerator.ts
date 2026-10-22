/**
 * FORMGRID INDUSTRIAL CAM & SLICER PROFILE ENGINE
 * Procedural generation of native 3D slicer configurations and CAM job archives
 * Supported Ecosystems:
 *   - Bambu Lab (X1-Carbon / P1S / A1) via Bambu Studio / OrcaSlicer JSON & 3MF metadata
 *   - Prusa Research (Prusa MK4 / XL / CoreXY) via PrusaSlicer IS (Input Shaping) INI bundles
 *   - Klipper High-Speed (Voron 2.4 / RatRig V-Core 3) via tuned INI & Klipper macro CFG
 */

import { ParametricOrganizerDimensions, MaterialOption } from '../types';

export type SlicerEcosystem = 'bambu' | 'prusa' | 'voron' | 'all';

export interface SlicerProfileContext {
  productTitle: string;
  productSlug?: string;
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  estimatedGrams: number;
  estimatedHours: number;
  nozzleDiameterMm?: number;
  layerHeightMm?: number;
  infillDensityPercent?: number;
  perimeters?: number;
  flowRatio?: number;
  nozzleTempC?: number;
  bedTempC?: number;
}

export interface GeneratedProfileFile {
  name: string;
  content: string;
  mimeType: string;
  description: string;
}

export interface CamArchiveBundle {
  filename: string;
  blob: Blob;
  files: GeneratedProfileFile[];
  summary: {
    ecosystems: string[];
    filamentGrams: number;
    layerHeight: number;
    infill: string;
    perimeters: number;
    temperatures: string;
  };
}

// ---------------------------------------------------------------------------
// CRC32 & PKZIP Binary Generator (Pure TypeScript, Zero-Dependency)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function calculateCrc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Creates a standard IEEE PKZIP archive buffer from in-memory text/binary files
 */
export function buildZipArchive(files: Array<{ name: string; content: string | Uint8Array }>): Blob {
  const enc = new TextEncoder();
  const fileEntries = files.map((f) => {
    const nameBytes = enc.encode(f.name);
    const dataBytes = typeof f.content === 'string' ? enc.encode(f.content) : f.content;
    const crc = calculateCrc32(dataBytes);
    return { name: f.name, nameBytes, dataBytes, crc };
  });

  let totalSize = 0;
  for (const f of fileEntries) {
    totalSize += 30 + f.nameBytes.length + f.dataBytes.length; // Local file header + data
    totalSize += 46 + f.nameBytes.length; // Central directory entry
  }
  totalSize += 22; // End of central directory record (EOCD)

  const buffer = new ArrayBuffer(totalSize);
  const dv = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  let localOffset = 0;
  const centralEntries: Array<{
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    headerOffset: number;
  }> = [];

  // Write Local File Headers + File Data
  for (const f of fileEntries) {
    const headerOffset = localOffset;

    // Local file header signature (0x04034b50)
    dv.setUint32(localOffset, 0x04034b50, true);
    dv.setUint16(localOffset + 4, 20, true); // Version needed to extract (2.0)
    dv.setUint16(localOffset + 6, 0, true);  // General purpose bit flag
    dv.setUint16(localOffset + 8, 0, true);  // Compression method (0 = Store)
    dv.setUint16(localOffset + 10, 0x6000, true); // File last mod time (12:00:00)
    dv.setUint16(localOffset + 12, 0x5544, true); // File last mod date (2026-10-22)
    dv.setUint32(localOffset + 14, f.crc, true);   // CRC-32
    dv.setUint32(localOffset + 18, f.dataBytes.length, true); // Compressed size
    dv.setUint32(localOffset + 22, f.dataBytes.length, true); // Uncompressed size
    dv.setUint16(localOffset + 26, f.nameBytes.length, true); // Filename length
    dv.setUint16(localOffset + 28, 0, true); // Extra field length
    localOffset += 30;

    u8.set(f.nameBytes, localOffset);
    localOffset += f.nameBytes.length;

    u8.set(f.dataBytes, localOffset);
    localOffset += f.dataBytes.length;

    centralEntries.push({
      nameBytes: f.nameBytes,
      dataBytes: f.dataBytes,
      crc: f.crc,
      headerOffset,
    });
  }

  // Write Central Directory Headers
  const centralDirStart = localOffset;
  for (const f of centralEntries) {
    // Central directory file header signature (0x02014b50)
    dv.setUint32(localOffset, 0x02014b50, true);
    dv.setUint16(localOffset + 4, 20, true);  // Version made by (2.0)
    dv.setUint16(localOffset + 6, 20, true);  // Version needed to extract (2.0)
    dv.setUint16(localOffset + 8, 0, true);   // General purpose bit flag
    dv.setUint16(localOffset + 10, 0, true);  // Compression method (Store)
    dv.setUint16(localOffset + 12, 0x6000, true); // Last mod time
    dv.setUint16(localOffset + 14, 0x5544, true); // Last mod date
    dv.setUint32(localOffset + 16, f.crc, true);   // CRC-32
    dv.setUint32(localOffset + 20, f.dataBytes.length, true); // Compressed size
    dv.setUint32(localOffset + 24, f.dataBytes.length, true); // Uncompressed size
    dv.setUint16(localOffset + 28, f.nameBytes.length, true); // Filename length
    dv.setUint16(localOffset + 30, 0, true);  // Extra field length
    dv.setUint16(localOffset + 32, 0, true);  // File comment length
    dv.setUint16(localOffset + 34, 0, true);  // Disk number start
    dv.setUint16(localOffset + 36, 0, true);  // Internal file attributes
    dv.setUint32(localOffset + 38, 0, true);  // External file attributes
    dv.setUint32(localOffset + 42, f.headerOffset, true); // Relative offset of local header
    localOffset += 46;

    u8.set(f.nameBytes, localOffset);
    localOffset += f.nameBytes.length;
  }

  const centralDirEnd = localOffset;
  const centralDirSize = centralDirEnd - centralDirStart;

  // End of Central Directory Record (EOCD signature: 0x06054b50)
  dv.setUint32(localOffset, 0x06054b50, true);
  dv.setUint16(localOffset + 4, 0, true); // Number of this disk
  dv.setUint16(localOffset + 6, 0, true); // Disk where central directory starts
  dv.setUint16(localOffset + 8, fileEntries.length, true);  // Number of central directory records on this disk
  dv.setUint16(localOffset + 10, fileEntries.length, true); // Total number of central directory records
  dv.setUint32(localOffset + 12, centralDirSize, true);    // Size of central directory
  dv.setUint32(localOffset + 16, centralDirStart, true);   // Offset of start of central directory
  dv.setUint16(localOffset + 20, 0, true); // Comment length

  return new Blob([buffer], { type: 'application/zip' });
}

// ---------------------------------------------------------------------------
// 1. BAMBU LAB ECOSYSTEM (X1-Carbon / P1S / A1)
// ---------------------------------------------------------------------------

/**
 * Generates Bambu Studio / OrcaSlicer native process configuration JSON
 * Parameters: 0.4mm nozzle, 0.20mm Standard layer, 18% gyroid infill, 3 perimeters, flow ratio 0.98
 */
export function generateBambuProcessJson(ctx: SlicerProfileContext): string {
  const nozzle = ctx.nozzleDiameterMm ?? 0.4;
  const layer = ctx.layerHeightMm ?? 0.2;
  const infill = ctx.infillDensityPercent ?? 18;
  const perimeters = ctx.perimeters ?? 3;
  const flow = ctx.flowRatio ?? 0.98;

  const config = {
    type: 'process',
    name: `FORMGRID 0.20mm Standard (0.4 Nozzle) - ${ctx.productTitle}`,
    from: 'system',
    instantiation: 'true',
    inherits: '0.20mm Standard @BBL X1C',
    adaptive_layer_height: '0',
    layer_height: layer.toFixed(2),
    initial_layer_print_height: layer.toFixed(2),
    initial_layer_line_width: (nozzle * 1.25).toFixed(2),
    line_width: (nozzle * 1.125).toFixed(2),
    outer_wall_line_width: (nozzle * 1.05).toFixed(2),
    inner_wall_line_width: (nozzle * 1.125).toFixed(2),
    sparse_infill_line_width: (nozzle * 1.125).toFixed(2),
    top_surface_line_width: (nozzle * 1.05).toFixed(2),
    wall_loops: String(perimeters),
    top_shell_layers: '4',
    bottom_shell_layers: '3',
    top_shell_thickness: '0.8',
    bottom_shell_thickness: '0.6',
    sparse_infill_density: `${infill}%`,
    sparse_infill_pattern: 'gyroid',
    infill_direction: '45',
    infill_wall_overlap: '15%',
    detect_thin_wall: '1',
    seam_position: 'aligned',
    outer_wall_speed: '120',
    inner_wall_speed: '200',
    sparse_infill_speed: '250',
    internal_solid_infill_speed: '200',
    top_surface_speed: '140',
    gap_infill_speed: '150',
    travel_speed: '500',
    initial_layer_speed: '35',
    initial_layer_infill_speed: '60',
    bridge_speed: '50',
    enable_arc_fitting: '1',
    reduce_infill_retraction: '1',
    enable_support: '0',
    brim_type: 'no_brim',
    brim_width: '0',
    skirt_distance: '3',
    skirt_loops: '1',
    filament_flow_ratio_multiplier: flow.toFixed(2),
    compatible_printers: [
      'Bambu Lab X1 Carbon 0.4 nozzle',
      'Bambu Lab P1S 0.4 nozzle',
      'Bambu Lab P1P 0.4 nozzle',
      'Bambu Lab A1 0.4 nozzle',
      'Bambu Lab A1 mini 0.4 nozzle',
    ],
    metadata: {
      generator: 'FORMGRID CAM Engine v3.4',
      part_dimensions_mm: [ctx.dimensions.length, ctx.dimensions.width, ctx.dimensions.height],
      compartment_grid: `${ctx.dimensions.cols}x${ctx.dimensions.rows}`,
      estimated_grams: ctx.estimatedGrams,
    },
  };

  return JSON.stringify(config, null, 2);
}

/**
 * Generates Bambu Studio / OrcaSlicer filament profile JSON
 * 215°C PLA nozzle, 55°C bed, flow ratio 0.98, tuned fan curves
 */
export function generateBambuFilamentJson(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;
  const flow = ctx.flowRatio ?? 0.98;

  const filament = {
    type: 'filament',
    name: `FORMGRID Industrial ${ctx.material.name} @BBL`,
    from: 'system',
    instantiation: 'true',
    inherits: 'Bambu PLA Basic @BBL X1C',
    filament_vendor: ['FORMGRID'],
    filament_type: ['PLA'],
    filament_density: [ctx.material.densityGramsPerCm3.toFixed(2)],
    filament_flow_ratio: [flow.toFixed(2)],
    filament_diameter: ['1.75'],
    filament_max_volumetric_speed: ['21'],
    nozzle_temperature: [String(nozzleTemp)],
    nozzle_temperature_initial_layer: [String(nozzleTemp + 5)],
    nozzle_temperature_range_high: [String(nozzleTemp + 15)],
    nozzle_temperature_range_low: [String(nozzleTemp - 15)],
    bed_temperature: [String(bedTemp)],
    bed_temperature_initial_layer: [String(bedTemp)],
    textured_plate_temp: [String(bedTemp)],
    textured_plate_temp_initial_layer: [String(bedTemp)],
    fan_min_speed: ['100'],
    fan_max_speed: ['100'],
    fan_cooling_layer_time: ['60'],
    close_fan_the_first_x_layers: ['1'],
    slow_down_layer_time: ['8'],
    slow_down_min_speed: ['20'],
    fan_cooling_curving: [
      { layer: 1, fan_pct: 0 },
      { layer: 2, fan_pct: 50 },
      { layer: 3, fan_pct: 100 },
    ],
  };

  return JSON.stringify(filament, null, 2);
}

/**
 * Generates Bambu 3MF project metadata and slicing configuration
 */
export function generateBambu3mfConfig(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;

  return `; =====================================================================
; FORMGRID 3MF Slicing Project Settings (Bambu Studio / OrcaSlicer)
; Model: ${ctx.productTitle}
; Extents: ${ctx.dimensions.length}mm (L) x ${ctx.dimensions.width}mm (W) x ${ctx.dimensions.height}mm (H)
; =====================================================================
[config]
version = 01.09.01.40
project_name = FORMGRID_${ctx.productSlug || 'ORGANIZER'}
printer_model = Bambu Lab X1-Carbon / P1S / A1
nozzle_diameter = ${ctx.nozzleDiameterMm ?? 0.4}
layer_height = ${ctx.layerHeightMm ?? 0.20}
wall_loops = ${ctx.perimeters ?? 3}
sparse_infill_density = ${ctx.infillDensityPercent ?? 18}%
sparse_infill_pattern = gyroid
filament_flow_ratio = ${ctx.flowRatio ?? 0.98}
temperature = ${nozzleTemp}
first_layer_temperature = ${nozzleTemp + 5}
bed_temperature = ${bedTemp}
fan_always_on = 1
disable_fan_first_layers = 1
estimated_weight_g = ${ctx.estimatedGrams.toFixed(1)}
estimated_print_time_min = ${Math.round(ctx.estimatedHours * 60)}
`;
}

// ---------------------------------------------------------------------------
// 2. PRUSASLICER ECOSYSTEM (Prusa MK4 / XL / CoreXY with Input Shaping)
// ---------------------------------------------------------------------------

/**
 * Generates complete PrusaSlicer config bundle (.ini)
 * Contains IS (Input Shaping) print profile, filament profile, and printer presets
 */
export function generatePrusaSlicerIni(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;
  const flow = ctx.flowRatio ?? 0.98;
  const layer = ctx.layerHeightMm ?? 0.2;
  const infill = ctx.infillDensityPercent ?? 18;
  const perimeters = ctx.perimeters ?? 3;

  return `# =====================================================================
# FORMGRID PrusaSlicer Configuration Bundle (IS - Input Shaping Presets)
# Target Hardware: Prusa MK4 IS, Prusa XL IS, Prusa CoreXY (0.4mm Nozzle)
# Generated: ${new Date().toISOString()}
# =====================================================================

[print:0.20mm STRUCTURAL @MK4IS FORMGRID]
inherits = 0.20mm STRUCTURAL @MK4IS
layer_height = ${layer.toFixed(2)}
first_layer_height = ${layer.toFixed(2)}
perimeters = ${perimeters}
top_solid_layers = 5
bottom_solid_layers = 4
fill_density = ${infill}%
fill_pattern = gyroid
extrusion_width = 0.45
perimeter_extrusion_width = 0.45
external_perimeter_extrusion_width = 0.42
first_layer_extrusion_width = 0.50
infill_extrusion_width = 0.45
solid_infill_extrusion_width = 0.45
top_infill_extrusion_width = 0.42
perimeter_speed = 100
external_perimeter_speed = 70
infill_speed = 170
solid_infill_speed = 140
top_solid_infill_speed = 80
travel_speed = 300
first_layer_speed = 30
first_layer_acceleration = 1000
perimeter_acceleration = 2500
infill_acceleration = 4000
default_acceleration = 4000
max_print_speed = 200
gap_fill_enabled = 1
ironing = 0
cooling = 1
fan_always_on = 1
disable_fan_first_layers = 1
bridge_fan_speed = 100
fan_below_layer_time = 100
min_fan_speed = 100
max_fan_speed = 100
slowdown_below_layer_time = 8
skirts = 1
skirt_distance = 4
skirt_height = 1
brim_width = 0
seam_position = rear
notes = FORMGRID Precision CAM Profile with 18% Gyroid & 3 Perimeters.

[print:0.20mm SPEED @XLIS FORMGRID]
inherits = 0.20mm SPEED @XLIS
layer_height = ${layer.toFixed(2)}
first_layer_height = ${layer.toFixed(2)}
perimeters = ${perimeters}
top_solid_layers = 4
bottom_solid_layers = 3
fill_density = ${infill}%
fill_pattern = gyroid
extrusion_width = 0.45
perimeter_extrusion_width = 0.45
external_perimeter_extrusion_width = 0.42
infill_extrusion_width = 0.48
perimeter_speed = 120
external_perimeter_speed = 90
infill_speed = 200
solid_infill_speed = 160
top_solid_infill_speed = 100
travel_speed = 350
perimeter_acceleration = 3500
infill_acceleration = 5000
default_acceleration = 5000
fan_always_on = 1
disable_fan_first_layers = 1
min_fan_speed = 100
max_fan_speed = 100

[filament:FORMGRID Industrial PLA @IS]
filament_type = PLA
filament_vendor = FORMGRID
filament_density = ${ctx.material.densityGramsPerCm3.toFixed(2)}
filament_diameter = 1.75
filament_cost = 24.99
extrusion_multiplier = ${flow.toFixed(2)}
temperature = ${nozzleTemp}
first_layer_temperature = ${nozzleTemp + 5}
bed_temperature = ${bedTemp}
first_layer_bed_temperature = ${bedTemp}
cooling = 1
fan_always_on = 1
disable_fan_first_layers = 1
min_fan_speed = 100
max_fan_speed = 100
bridge_fan_speed = 100
fan_below_layer_time = 100
slowdown_below_layer_time = 8
min_print_speed = 15

[printer:Original Prusa MK4 Input Shaper 0.4 nozzle]
inherits = Original Prusa MK4 Input Shaper 0.4 nozzle
nozzle_diameter = ${ctx.nozzleDiameterMm ?? 0.4}
retract_length = 0.8
retract_speed = 35
deretract_speed = 25
retract_lift = 0.2
wipe = 1
use_volumetric_e = 0
use_relative_e_distances = 1

[printer:Original Prusa XL Input Shaper 0.4 nozzle]
inherits = Original Prusa XL Input Shaper 0.4 nozzle
nozzle_diameter = ${ctx.nozzleDiameterMm ?? 0.4}
retract_length = 0.8
retract_speed = 40
deretract_speed = 30
retract_lift = 0.2
wipe = 1
use_relative_e_distances = 1
`;
}

// ---------------------------------------------------------------------------
// 3. VORON 2.4 & RATRIG ECOSYSTEM (Klipper-Tuned High-Speed Profiles)
// ---------------------------------------------------------------------------

/**
 * Generates Klipper / OrcaSlicer high-speed configuration INI
 * Tuned for Voron 2.4 (Stealthburner) and RatRig V-Core 3
 */
export function generateVoronKlipperIni(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;
  const flow = ctx.flowRatio ?? 0.98;
  const layer = ctx.layerHeightMm ?? 0.2;
  const infill = ctx.infillDensityPercent ?? 18;
  const perimeters = ctx.perimeters ?? 3;

  return `# =====================================================================
# FORMGRID Voron 2.4 / RatRig V-Core 3 Klipper-Tuned High-Speed Profile
# Compatible with OrcaSlicer / SuperSlicer / PrusaSlicer
# Hardware: CoreXY Kinematics, 0.4mm High-Flow Nozzle, Stealthburner / RapidCool
# =====================================================================

[print:FORMGRID_Voron_RatRig_0.20_HighSpeed]
layer_height = ${layer.toFixed(2)}
first_layer_height = ${(layer + 0.04).toFixed(2)}
perimeters = ${perimeters}
top_solid_layers = 5
bottom_solid_layers = 4
fill_density = ${infill}%
fill_pattern = gyroid
extrusion_multiplier = ${flow.toFixed(2)}
extrusion_width = 0.45
perimeter_extrusion_width = 0.45
external_perimeter_extrusion_width = 0.42
infill_extrusion_width = 0.48
solid_infill_extrusion_width = 0.45
top_infill_extrusion_width = 0.42
first_layer_extrusion_width = 0.50

# High-Speed CoreXY Feedrates (mm/s)
perimeter_speed = 200
external_perimeter_speed = 150
infill_speed = 300
solid_infill_speed = 250
top_solid_infill_speed = 120
gap_fill_speed = 150
travel_speed = 500
first_layer_speed = 40
bridge_speed = 60
max_print_speed = 350

# CoreXY Dynamic Acceleration (mm/s²)
acceleration = 8000
perimeter_acceleration = 5000
infill_acceleration = 8000
travel_acceleration = 10000
first_layer_acceleration = 2000

# High-Speed Cooling & Thermal Schedules
fan_always_on = 1
disable_fan_first_layers = 1
min_fan_speed = 100
max_fan_speed = 100
bridge_fan_speed = 100
fan_below_layer_time = 60
slowdown_below_layer_time = 6
min_print_speed = 25

# Klipper Pressure Advance & Extruder Tuning
pressure_advance = 0.035
smooth_time = 0.04
square_corner_velocity = 8.0
retract_length = 0.6
retract_speed = 45
deretract_speed = 40
retract_lift = 0.2

# Filament Thermals
temperature = ${nozzleTemp}
first_layer_temperature = ${nozzleTemp + 5}
bed_temperature = ${bedTemp}
first_layer_bed_temperature = ${bedTemp}
`;
}

/**
 * Generates Klipper START_PRINT macro configuration (.cfg)
 * Incorporates bed soak, QGL / Z-Tilt, adaptive mesh, and nozzle prime line
 */
export function generateKlipperStartMacro(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;

  return `# =====================================================================
# FORMGRID Klipper Print Start Macro Configuration
# Optimized for Voron 2.4 (Quad Gantry Level) and RatRig V-Core 3 (Z-Tilt)
# =====================================================================

[gcode_macro PRINT_START_FORMGRID]
description: FORMGRID Production Print Start Sequence with Adaptive Bed Mesh
gcode:
    {% set BED_TEMP = params.BED_TEMP|default(${bedTemp})|float %}
    {% set EXTRUDER_TEMP = params.EXTRUDER_TEMP|default(${nozzleTemp})|float %}
    
    # 1. Warm bed and pre-heat nozzle to standby (prevents nozzle ooze during probing)
    M117 Preheating bed ${bedTemp}C...
    M140 S{BED_TEMP}
    M104 S150
    G90
    G28
    
    # 2. Wait for heated bed stabilization
    M190 S{BED_TEMP}
    
    # 3. Kinematic Alignment
    {% if printer.quad_gantry_level is defined %}
        M117 Performing Quad Gantry Level...
        QUAD_GANTRY_LEVEL
    {% elif printer.z_tilt is defined %}
        M117 Performing Z-Tilt Alignment...
        Z_TILT_ADJUST
    {% endif %}
    
    # 4. Re-home Z after thermal expansion
    G28 Z
    
    # 5. Adaptive Bed Mesh Calibration over FORMGRID print bounds
    # Bound X: ${ctx.dimensions.length}mm, Bound Z: ${ctx.dimensions.width}mm
    M117 Calibrating Adaptive Mesh...
    BED_MESH_CALIBRATE ADAPTIVE=1
    
    # 6. Final Nozzle Heating
    M117 Heating Nozzle to ${nozzleTemp}C...
    G1 X10 Y10 Z5 F9000
    M109 S{EXTRUDER_TEMP}
    
    # 7. High-Precision Purge Line (0.98 Flow ratio)
    M117 Purging nozzle line...
    G92 E0
    G1 Z0.28 F1200
    G1 X120 E14 F1500
    G1 Y12.4 F5000
    G1 X20 E26 F1500
    G92 E0
    G1 Z2.0 F3000
    
    M117 FORMGRID Printing: ${ctx.productTitle}

[gcode_macro PRINT_END_FORMGRID]
gcode:
    M400
    G92 E0
    G1 E-2.0 F3600
    G91
    G0 Z10 F3000
    G90
    G0 X10 Y{printer.toolhead.axis_maximum.y - 10} F9000
    M104 S0
    M140 S0
    M106 S0
    M84
    M117 Print Finished - Remove Part when Bed < 35C.
`;
}

// ---------------------------------------------------------------------------
// 4. INDUSTRIAL CAM JOB TICKET & PRINT INSTRUCTIONS
// ---------------------------------------------------------------------------

/**
 * Generates an engineering CAM job ticket and print instruction document
 */
export function generateCamJobTicket(ctx: SlicerProfileContext): string {
  const nozzleTemp = ctx.nozzleTempC ?? 215;
  const bedTemp = ctx.bedTempC ?? 55;
  const flow = ctx.flowRatio ?? 0.98;
  const perimeters = ctx.perimeters ?? 3;
  const infill = ctx.infillDensityPercent ?? 18;
  const layer = ctx.layerHeightMm ?? 0.2;
  const filamentMeters = (ctx.estimatedGrams / (Math.PI * Math.pow(0.175 / 2, 2) * ctx.material.densityGramsPerCm3)).toFixed(1);

  return `# =====================================================================
# FORMGRID INDUSTRIAL CAM JOB SPECIFICATION & PRINT TICKET
# Part: ${ctx.productTitle}
# Slicing Recipe: 0.20mm Standard / 18% Gyroid / 3 Perimeters / 0.98 Flow
# =====================================================================

## 1. PART GEOMETRY & BOUNDING BOX
- Overall Dimensions (X x Z x Y): ${ctx.dimensions.length}mm x ${ctx.dimensions.width}mm x ${ctx.dimensions.height}mm
- Cavity Matrix: ${ctx.dimensions.cols} columns x ${ctx.dimensions.rows} rows (${ctx.dimensions.cols * ctx.dimensions.rows} internal chambers)
- Wall Thickness: ${ctx.dimensions.wallThickness}mm (${perimeters} perimeters @ 0.45mm extrusion width + solid gap fill)
- Base Floor Thickness: ${ctx.dimensions.bottomThickness}mm (${Math.round(ctx.dimensions.bottomThickness / layer)} solid bottom layers)
- Corner Fillet Radius: ${ctx.dimensions.cornerFilletRadius}mm (stress-relief filleted corners)

## 2. MATERIAL & MASS CONSUMPTION
- Specified Filament: ${ctx.material.name} (Category: ${ctx.material.category.toUpperCase()})
- Raw Material Density: ${ctx.material.densityGramsPerCm3.toFixed(2)} g/cm³
- Estimated Filament Mass: ${ctx.estimatedGrams.toFixed(1)} grams
- Estimated Filament Length: ~${filamentMeters} meters (1.75mm diameter)
- Estimated Print Duration: ~${ctx.estimatedHours.toFixed(1)} hours (Bambu X1C / MK4 IS / Voron)

## 3. TEMPERATURE & THERMAL SCHEDULES
- Extruder Nozzle Initial Layer: ${nozzleTemp + 5}°C
- Extruder Nozzle Print Layers: ${nozzleTemp}°C
- Heated Bed Initial Layer: ${bedTemp}°C
- Heated Bed Subsequent Layers: ${bedTemp}°C
- Recommended Bed Surface: Textured PEI Spring Steel Sheet or Satin Powder-Coated Sheet
- Part Release Temperature: Allow bed to cool below 35°C before removing part

## 4. PART COOLING FAN CURVE
- Layer 1 (0.00mm - 0.20mm): 0% Fan (Zero cooling for optimal bed adhesion)
- Layer 2 (0.20mm - 0.40mm): 50% Fan (Gradual thermal transition)
- Layer 3+ (0.40mm - Top): 100% Continuous Part Cooling Fan
- Bridge & Overhang Fan Speed: 100% Fan
- Chamber Temperature: Ambient room temperature (do not fully enclose PLA)

## 5. VOLUMETRIC & EXTRUSION CALIBRATION
- Flow Ratio / Extrusion Multiplier: ${flow.toFixed(2)} (compensates for PLA die swell on tight grid dividers)
- Seam Alignment: Aligned / Rear-corner placement inside compartment fillet radii
- Layer Height: ${layer.toFixed(2)}mm (First Layer: ${layer.toFixed(2)}mm)
- Sparse Infill: ${infill}% Gyroid pattern (isotropic mechanical dampening, zero travel crossing drag)
- Top Solid Shells: 4 layers (0.80mm minimum)
- Bottom Solid Shells: 3 layers (0.60mm minimum)

## 6. MULTI-SLICER IMPORT INSTRUCTIONS

### A. Bambu Studio / OrcaSlicer (Bambu Lab X1-Carbon / P1S / A1)
1. Launch Bambu Studio or OrcaSlicer.
2. Go to File -> Import -> Import Configs...
3. Select 'BambuLab_FORMGRID_0.20_Standard.json' for the Process preset.
4. Select 'BambuLab_Filament_PLA_Formgrid.json' for the Filament preset.
5. Drag and drop your exported binary STL into the viewport.
6. Verify Gyroid 18% infill and 3 wall loops, then slice and send to printer.

### B. PrusaSlicer (Prusa MK4 / XL / CoreXY with IS)
1. Launch PrusaSlicer 2.7+.
2. Navigate to File -> Import -> Import Config Bundle...
3. Select 'PrusaSlicer_MK4_XL_0.20_IS.ini'.
4. Select the preset '0.20mm STRUCTURAL @MK4IS FORMGRID'.
5. Load the STL file, confirm 3 perimeters and 215°C nozzle / 55°C bed, then slice.

### C. Voron 2.4 / RatRig (Klipper High-Speed)
1. Load 'Voron2.4_RatRig_Klipper_HighSpeed.ini' into OrcaSlicer or SuperSlicer.
2. In your printer's printer.cfg or macro configuration, include 'klipper_print_start.cfg'.
3. Set your slicer Start G-code to: PRINT_START_FORMGRID BED_TEMP=[first_layer_bed_temperature] EXTRUDER_TEMP=[first_layer_temperature]
4. Enjoy flawless 250mm/s+ surface finishes with tuned input shaping and pressure advance.
`;
}

// ---------------------------------------------------------------------------
// 5. MASTER ARCHIVE BUILDER & CLIENT-SIDE DOWNLOAD DISPATCH
// ---------------------------------------------------------------------------

/**
 * Builds the complete downloadable print configuration archive (.zip)
 * Containing all slicer profiles, Klipper macros, and CAM instructions
 */
export function generateSlicerProfileArchive(ctx: SlicerProfileContext): CamArchiveBundle {
  const safeSlug = (ctx.productSlug || ctx.productTitle || 'formgrid')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');

  const files: GeneratedProfileFile[] = [
    {
      name: `BambuLab_FORMGRID_0.20_Standard.json`,
      content: generateBambuProcessJson(ctx),
      mimeType: 'application/json',
      description: 'Bambu Studio / OrcaSlicer Process Profile (0.4 Nozzle, 0.20mm, 18% Gyroid, 3 Perimeters)',
    },
    {
      name: `BambuLab_Filament_PLA_Formgrid.json`,
      content: generateBambuFilamentJson(ctx),
      mimeType: 'application/json',
      description: 'Bambu Studio Filament Profile (215°C Nozzle / 55°C Bed / 0.98 Flow)',
    },
    {
      name: `3mf_project_settings.config`,
      content: generateBambu3mfConfig(ctx),
      mimeType: 'text/plain',
      description: '3MF Slicer Project Metadata & Plate Settings',
    },
    {
      name: `PrusaSlicer_MK4_XL_0.20_IS.ini`,
      content: generatePrusaSlicerIni(ctx),
      mimeType: 'text/plain',
      description: 'PrusaSlicer IS (Input Shaping) Config Bundle (Prusa MK4 / XL / CoreXY)',
    },
    {
      name: `Voron2.4_RatRig_Klipper_HighSpeed.ini`,
      content: generateVoronKlipperIni(ctx),
      mimeType: 'text/plain',
      description: 'Voron 2.4 & RatRig V-Core 3 Klipper-Tuned High-Speed Slicer Profile',
    },
    {
      name: `klipper_print_start.cfg`,
      content: generateKlipperStartMacro(ctx),
      mimeType: 'text/plain',
      description: 'Klipper PRINT_START Macro with Adaptive Bed Meshing',
    },
    {
      name: `PRINT_INSTRUCTIONS_FORMGRID.md`,
      content: generateCamJobTicket(ctx),
      mimeType: 'text/markdown',
      description: 'Engineering CAM Print Ticket, Cooling Curves, & Temperature Schedules',
    },
  ];

  const zipBlob = buildZipArchive(files);
  const zipFilename = `FORMGRID-CAM-${safeSlug}-${Date.now()}.zip`;

  return {
    filename: zipFilename,
    blob: zipBlob,
    files,
    summary: {
      ecosystems: ['Bambu Lab (X1C/P1S/A1)', 'PrusaSlicer IS (MK4/XL)', 'Voron 2.4 / RatRig (Klipper)'],
      filamentGrams: Number(ctx.estimatedGrams.toFixed(1)),
      layerHeight: ctx.layerHeightMm ?? 0.2,
      infill: `${ctx.infillDensityPercent ?? 18}% Gyroid`,
      perimeters: ctx.perimeters ?? 3,
      temperatures: `${ctx.nozzleTempC ?? 215}°C Nozzle / ${ctx.bedTempC ?? 55}°C Bed`,
    },
  };
}

/**
 * Triggers a direct client-side file download in the browser
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * High-level download dispatcher for a single ecosystem or complete archive
 */
export function downloadSlicerProfile(
  ctx: SlicerProfileContext,
  ecosystem: SlicerEcosystem = 'all'
): void {
  const safeSlug = (ctx.productSlug || ctx.productTitle || 'formgrid')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');

  if (ecosystem === 'all') {
    const archive = generateSlicerProfileArchive(ctx);
    triggerFileDownload(archive.blob, archive.filename);
    return;
  }

  if (ecosystem === 'bambu') {
    const content = generateBambuProcessJson(ctx);
    const blob = new Blob([content], { type: 'application/json' });
    triggerFileDownload(blob, `BambuLab_FORMGRID_${safeSlug}_0.20_Standard.json`);
    return;
  }

  if (ecosystem === 'prusa') {
    const content = generatePrusaSlicerIni(ctx);
    const blob = new Blob([content], { type: 'text/plain' });
    triggerFileDownload(blob, `PrusaSlicer_FORMGRID_${safeSlug}_IS.ini`);
    return;
  }

  if (ecosystem === 'voron') {
    const content = generateVoronKlipperIni(ctx);
    const blob = new Blob([content], { type: 'text/plain' });
    triggerFileDownload(blob, `Voron_RatRig_FORMGRID_${safeSlug}_HighSpeed.ini`);
    return;
  }
}
