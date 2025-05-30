# Medusa Backend Documentation Index

Welcome to the Medusa Backend Documentation. This page serves as an index to navigate the various documentation resources available for the Medusa e-commerce backend.

## Core Documentation

- [Medusa Backend Overview](./MEDUSA_BACKEND.md): Comprehensive overview of the Medusa backend architecture
- [Medusa Frontend Integration Guide](./MEDUSA_FRONTEND_INTEGRATION.md): Guide to integrating Medusa with the Next.js frontend
- [Medusa Documentation Strategy](./MEDUSA_DOCUMENTATION_STRATEGY.md): Our approach to documenting the Medusa backend
- [Documentation Automation Strategy](./DOCUMENTATION_AUTOMATION.md): Strategy for automating documentation

## Generated Documentation

These documentation files are automatically generated from the codebase:

- [API Documentation](./generated/api-documentation.md): Documentation for all API endpoints
- [Module Documentation](./generated/modules-documentation.md): Documentation for custom modules
- [Workflow Documentation](./generated/workflows-documentation.md): Documentation for workflows
- [Complete Backend Documentation](./generated/backend-documentation.md): Comprehensive documentation of the entire backend
- [Documentation Issues Report](./generated/documentation-issues.md): Report of missing or incomplete documentation

## Documentation Tools

We provide several tools to maintain and generate documentation:

- `npm run docs:generate`: Generate all documentation
- `npm run docs:validate`: Validate documentation and find issues
- `npm run docs:tools`: Launch the documentation tools menu (Windows)
- `npm run docs:tools:unix`: Launch the documentation tools menu (Unix/Linux/Mac)

## Directory Structure

The Medusa backend follows this structure:

```
backend/medusa/
├── src/
│   ├── admin/           # Admin panel customizations
│   ├── api/             # Custom API endpoints
│   │   ├── admin/       # Admin-facing API endpoints
│   │   └── store/       # Storefront API endpoints
│   ├── jobs/            # Scheduled jobs
│   ├── links/           # Module links
│   ├── modules/         # Custom modules
│   ├── scripts/         # CLI scripts (including seed data)
│   ├── subscribers/     # Event subscribers
│   └── workflows/       # Custom workflows
├── integration-tests/   # Integration tests
└── medusa-config.ts     # Medusa configuration
```

## Extension Points

Medusa provides several extension points for customization:

1. **Custom API Routes**: Extend the API with custom endpoints
2. **Custom Modules**: Create new modules with custom business logic
3. **Workflows**: Define complex business processes as a series of steps
4. **Subscribers**: Handle events emitted by the system
5. **Scheduled Jobs**: Run tasks at specified intervals
6. **Admin UI Extensions**: Customize the admin panel with widgets and pages

## Getting Started with Documentation

1. Read the [Medusa Backend Overview](./MEDUSA_BACKEND.md) to understand the architecture
2. Review the [Medusa Documentation Strategy](./MEDUSA_DOCUMENTATION_STRATEGY.md) to learn our approach
3. Run `npm run docs:generate` to generate the latest documentation
4. Run `npm run docs:validate` to identify areas needing better documentation

## Contributing to Documentation

When contributing to the Medusa backend:

1. Add proper JSDoc/TSDoc comments to all new code
2. Update documentation when modifying existing code
3. Run the documentation validator before submitting changes
4. Follow the guidelines in [Medusa Documentation Strategy](./MEDUSA_DOCUMENTATION_STRATEGY.md)
