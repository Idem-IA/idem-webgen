import type { BrandIdentityModel } from '~/lib/persistence/models/brand-identity.model';
import type { ProjectModel } from '~/lib/persistence/models/project.model';
import type { DevelopmentConfigsModel } from '~/lib/persistence/models/development.model';
import type { AnalysisResultModel } from '~/lib/persistence/models/analysisResult.model';

export class WebGenService {
  generateWebsitePrompt(project: ProjectModel): string {
    console.log('Generating website prompt...');
    console.log('Project:', project);
    console.log('Analysis Result:', project.analysisResultModel);
    console.log('Development Configs:', project.analysisResultModel.development.configs);

    if (!project?.description) {
      throw new Error('Project description is required');
    }

    // Déterminer si c'est un projet Angular
    const isAngular = project.analysisResultModel.development.configs.frontend.framework.toLowerCase() === 'angular';

    const sections = [
      this._buildProjectOverview(project),
      this._buildUMLDiagrams(project.analysisResultModel),
      this._buildTechnicalSpecs(project, project.analysisResultModel.development.configs),
      this._buildBrandGuidelines(project.analysisResultModel.branding),
      this._buildDevelopmentStack(project.analysisResultModel.development.configs),
      this._buildContentStrategy(),
      this._buildDesignRequirements(),
      this._buildOutputRequirements(project.analysisResultModel.development.configs),
      this._buildQualityStandards(),
    ];

    if (isAngular) {
      sections.push(`# IMPORTANT ANGULAR INSTRUCTIONS
When generating an Angular application, you MUST create ALL necessary files for a working application, including but not limited to:

1. project structure files:
   - package.json with Angular dependencies
   - angular.json for Angular CLI configuration
   - tsconfig.json for TypeScript configuration

2. application files:
   - src/main.ts - entry point
   - src/app/app.module.ts - main module
   - src/app/app.component.ts - root component
   - src/app/app.component.html - template
   - src/app/app.component.css - styles
   - src/app/app-routing.module.ts - routing

3. configuration files:
   - src/environments/environment.ts
   - src/environments/environment.prod.ts

Failure to generate ANY of these files will result in a non-functioning application.`);
    }

    const basePrompt = sections.filter((section) => section).join('\n\n');

    if (isAngular) {
      return (
        basePrompt +
        '\n\n# FINAL REMINDER\nCreate ALL necessary files for a complete Angular application structure. The application WILL NOT WORK if any essential files are missing. Package.json alone is NOT sufficient.\n\nGenerate app.module.ts, app.component.ts, main.ts, and all other required files to ensure a functioning Angular application.'
      );
    }

    return basePrompt;
  }

  private _buildProjectOverview(project: ProjectModel): string {
    return `# PROJECT OVERVIEW
**Name:** ${project.name}
**Description:** ${project.description}
**Target Audience:** ${project.targets ? JSON.stringify(project.targets) : 'Not specified'}
`;
  }

  private _buildUMLDiagrams(analysisResult: AnalysisResultModel): string {
    const design = analysisResult.design;
    return `# UML DIAGRAMS & DESIGN
**Design Information:** ${design ? JSON.stringify(design, null, 2) : 'No design information available'}
`;
  }

  private _buildTechnicalSpecs(project: ProjectModel, developmentConfigs: DevelopmentConfigsModel): string {
    const projectConfig = developmentConfigs.projectConfig;
    const frontend = developmentConfigs.frontend;

    return `# TECHNICAL SPECIFICATIONS
**Web Technology:** ${frontend.framework.toUpperCase()} ${frontend.frameworkVersion || ''}
**Styling:** ${Array.isArray(frontend.styling) ? frontend.styling.join(', ') : frontend.styling}
${frontend.stateManagement ? `**State Management:** ${frontend.stateManagement}` : ''}

**Core Features:**
- SEO: ${projectConfig.seoEnabled ? 'Advanced optimization' : 'Basic'}
- Contact Form: ${projectConfig.contactFormEnabled ? 'Included' : 'Excluded'}
- Analytics: ${projectConfig.analyticsEnabled ? 'Configured' : 'Not included'}
- i18n: ${projectConfig.i18nEnabled ? 'Multi-language' : 'Single language'}
- Performance: ${projectConfig.performanceOptimized ? 'Optimized' : 'Standard'}
- Authentication: ${projectConfig.authentication ? 'Enabled' : 'Disabled'}
- Authorization: ${projectConfig.authorization ? 'Enabled' : 'Disabled'}
${projectConfig.paymentIntegration ? '- Payment Integration: Enabled' : ''}

**Frontend Features:**
${this._formatFeatures(frontend.features)}

**Requirements:**
- ${project.type === 'web' ? 'Mobile-first responsive design' : 'Platform-specific approach'}
- Component-based architecture
- TypeScript best practices
${
  developmentConfigs.constraints.length
    ? `
**Constraints:**
${developmentConfigs.constraints.map((c) => `- ${c}`).join('\n')}`
    : ''
}`;
  }

  private _formatFeatures(features: { [key: string]: boolean | undefined } | string[]): string {
    if (Array.isArray(features)) {
      return features.map((feature) => `- ${feature}`).join('\n');
    }

    return Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => `- ${feature.charAt(0).toUpperCase() + feature.slice(1)}`)
      .join('\n');
  }

  private _buildBrandGuidelines(brand: BrandIdentityModel): string {
    return `# BRAND GUIDELINES
**Visual Identity:**
- Colors: ${JSON.stringify(brand.colors.colors)}
- Typography: ${JSON.stringify(brand.typography)}
${brand.logo?.svg ? `- Logo: ${brand.logo.svg}` : ''}
`;
  }

  private _buildDevelopmentStack(developmentConfigs: DevelopmentConfigsModel): string {
    const { frontend, backend, database } = developmentConfigs;

    let frameworkDetails = '';

    if (frontend.framework.toLowerCase() === 'angular') {
      frameworkDetails = `
- Angular CLI: Required for project setup
- Angular Modules: Core, Common, Forms, HttpClient
- Angular Router: For application routing
- Angular Material (optional): For UI components
- RxJS: For reactive programming
`;
    }

    return `# DEVELOPMENT STACK
**Frontend:**
- Framework: ${frontend.framework} ${frontend.frameworkVersion || ''}
- Styling: ${Array.isArray(frontend.styling) ? frontend.styling.join(', ') : frontend.styling}
${frontend.stateManagement ? `- State Management: ${frontend.stateManagement}` : ''}${frameworkDetails}

**Backend:**
- Language: ${backend.language || 'Not specified'} ${backend.languageVersion || ''}
- Framework: ${backend.framework} ${backend.frameworkVersion || ''}
- API Type: ${backend.apiType} ${backend.apiVersion || ''}
${backend.orm ? `- ORM: ${backend.orm} ${backend.ormVersion || ''}` : ''}

**Database:**
- Provider: ${database.provider} ${database.version || ''}
- Type: ${database.type || 'Not specified'}
${database.orm ? `- ORM: ${database.orm} ${database.ormVersion || ''}` : ''}

**Backend Features:**
${this._formatFeatures(backend.features)}

**Database Features:**
${this._formatFeatures(database.features)}`;
  }

  private _buildContentStrategy(): string {
    return `# CONTENT STRATEGY
**Structure:**
1. Hero section with clear value proposition
2. Key benefits/features
3. Social proof
4. Call-to-action

**Guidelines:**
- Concise, scannable content
- Action-oriented language
- Benefit-focused messaging`;
  }

  private _buildDesignRequirements(): string {
    return `# DESIGN REQUIREMENTS
**Principles:**
- Clean, modern aesthetic
- Strong visual hierarchy
- Strategic white space
- Consistent spacing system

**Components:**
- Responsive navigation
- Attractive hero section
- Clearly styled CTAs
- Organized content sections`;
  }

  private _buildOutputRequirements(developmentConfigs: DevelopmentConfigsModel): string {
    const { frontend, backend, database } = developmentConfigs;

    let frameworkSpecificInstructions = '';

    if (frontend.framework.toLowerCase() === 'angular') {
      frameworkSpecificInstructions = `
**Angular Specific Requirements:**
- Complete file structure with core modules (app.module.ts, etc.)
- Component files (.ts, .html, .css)
- Angular routing configuration
- Angular services for data handling
- Angular environment configuration
- Proper import statements throughout
- All necessary files for a working Angular application
`;
    }

    return `# OUTPUT REQUIREMENTS
**Code Structure:**
- Well-structured ${frontend.framework} components
- TypeScript typing throughout
- Environment configuration for ${backend.framework}
- ${backend.apiType} API implementation
- ${database.provider} database integration${frameworkSpecificInstructions}

**Frontend Deliverables:**
- ${frontend.framework} ${frontend.frameworkVersion || ''} application
- ${Array.isArray(frontend.styling) ? frontend.styling.join(' + ') : frontend.styling} styling
${frontend.stateManagement ? `- ${frontend.stateManagement} state management setup` : ''}

**Backend Deliverables:**
- ${backend.framework} ${backend.frameworkVersion || ''} server
- ${backend.apiType} endpoints
${backend.orm ? `- ${backend.orm} ORM configuration` : ''}
- Database schema for ${database.provider}

**Documentation:**
- Setup instructions for full stack
- API documentation
- Database schema documentation
- Component documentation
- Deployment guide`;
  }

  private _buildQualityStandards(): string {
    return `# QUALITY STANDARDS
- WCAG AA accessibility
- Cross-browser compatibility
- Mobile-responsive
- Optimized performance
- Clean, maintainable code`;
  }
}
