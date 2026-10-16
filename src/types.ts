export type EyewearCategory = 'all' | 'sunglasses' | 'optical' | 'titanium' | 'bluelight' | 'limited';
export type FrameShape = 'all' | 'round' | 'square' | 'aviator' | 'cat-eye' | 'geometric' | 'rimless';
export type FrameGender = 'all' | 'unisex' | 'kadin' | 'erkek';

export interface EyewearDimensions {
  lensWidth: number; // e.g. 51 mm
  bridge: number;    // e.g. 20 mm
  temple: number;    // e.g. 145 mm
  lensHeight: number;// e.g. 45 mm
  totalWidth: number;// e.g. 140 mm
}

export interface OpticalFeatures {
  uvProtection: string;
  polarization: boolean;
  blueLightBlock: boolean;
  antiReflective: boolean;
  scratchResistance: boolean;
  hydrophobic: boolean;
}

export interface ColorVariant {
  name: string;
  hex: string;
  lensColorHex: string;
}

export interface EyewearModel {
  id: string;
  code: string;
  name: string;
  category: 'sunglasses' | 'optical' | 'titanium' | 'bluelight' | 'limited';
  categoryLabel: string;
  shape: 'round' | 'square' | 'aviator' | 'cat-eye' | 'geometric' | 'rimless';
  shapeLabel: string;
  gender: 'unisex' | 'kadin' | 'erkek';
  genderLabel: string;
  frameMaterial: string;
  hingeType: string;
  lensType: string;
  weight: number; // in grams
  dimensions: EyewearDimensions;
  origin: string;
  warranty: string;
  faceShapeSuitability: string[];
  prescriptionReady: boolean;
  description: string;
  designStory: string;
  images: {
    main: string;
    detail?: string;
    altView?: string;
  };
  colors: ColorVariant[];
  opticalFeatures: OpticalFeatures;
  tryOnConfig: {
    shapeType: 'cortina' | 'kyoto' | 'aviator' | 'cat-eye' | 'geometric' | 'square' | 'rimless' | 'amalfi' | 'shield';
    frameHex: string;
    lensHex: string;
    lensOpacity: number;
    defaultScale: number;
    defaultOffsetY: number;
  };
}
