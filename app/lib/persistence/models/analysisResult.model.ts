import type { ArchitectureModel } from './architecture.model';
import type { BrandIdentityModel } from './brand-identity.model';
import type { DiagramModel } from './diagram.model';
import type { BusinessPlanModel } from './businessPlan.model';
import type { DevelopmentConfigsModel } from './development.model';
import type { WebContainerModel } from './webcontainer.model';

export interface AnalysisResultModel {
  id?: string;
  architectures: ArchitectureModel[];
  businessPlan?: BusinessPlanModel;
  design: DiagramModel;
  development: {
    configs: DevelopmentConfigsModel;
    generatedValues: WebContainerModel[];
  };
  branding: BrandIdentityModel;
  createdAt: Date;
  updatedAt: Date;
}
