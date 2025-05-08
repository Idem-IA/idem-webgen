import type { LogoModel } from './logo.model';

export interface BrandIdentityModel {
  brandDefinition: { content: string; summary: string };
  toneOfVoice: { content: string; summary: string };
  visualIdentityGuidelines: { content: string; summary: string };
  typographySystem: { content: string; summary: string };
  colorSystem: { content: string; summary: string };
  iconographyAndImagery: { content: string; summary: string };
  layoutAndComposition: { content: string; summary: string };
  logo: {content : LogoModel, summary: string};
  globalCss: { content: string; summary: string };
  summary: { content: string; summary: string };
}
