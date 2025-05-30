# Medusa Backend Documentation

## Overview

The Medusa backend serves as the e-commerce engine for our application, providing essential commerce functionality including product management, cart handling, checkout flow, and order processing. This documentation outlines the architecture, key components, configuration, and extension points of our Medusa implementation.

## Architecture

### Core Components

1. **Core Modules**
   - Product Management
   - Cart & Checkout
   - Order Processing
   - Customer Management
   - Inventory Management
   - Shipping & Fulfillment
   - Payment Processing

2. **Extension Points**
   - Custom API Routes
   - Custom Modules
   - Workflows
   - Subscribers (Event Handlers)
   - Scheduled Jobs
   - Admin UI Extensions

3. **Configuration**
   - Database setup (currently using SQLite in-memory for development)
   - API endpoints and CORS settings
   - Integration with frontend

## Directory Structure

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

## Configuration

The Medusa backend is configured through `medusa-config.ts`, which currently uses an in-memory SQLite database for development purposes:

```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    database: {
      type: "sqlite",
      url: "sqlite::memory:",
      database: ":memory:"
    }
  }
})
```

For production deployment, this should be updated to use PostgreSQL or another suitable database system.

## API Routes

Medusa provides a file-based routing system for creating custom API endpoints:

### Store API Routes

Located in `src/api/store/`, these endpoints are publicly accessible and used by the storefront.

Example (`src/api/store/custom/route.ts`):
```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.sendStatus(200);
}
```

### Admin API Routes

Located in `src/api/admin/`, these endpoints are for admin use and typically require authentication.

## Custom Modules

Custom modules can be created to extend Medusa's functionality. A module typically consists of:

1. **Data Models**: Define database schemas
2. **Service**: Business logic implementation
3. **Module Definition**: Export the module for use in the application

## Event Handling with Subscribers

Subscribers listen to events emitted by the Medusa system and execute custom logic:

```typescript
import { type SubscriberConfig } from "@medusajs/framework"

export default async function productCreateHandler() {
  console.log("A product was created")
}

export const config: SubscriberConfig = {
  event: "product.created",
}
```

## Workflows

Workflows enable the definition of complex business processes as a series of steps:

```typescript
import { createStep, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

const step1 = createStep("step-1", async () => {
  // Step logic
})

const myWorkflow = createWorkflow("my-workflow", (input) => {
  const result = step1()
  return new WorkflowResponse({ result })
})
```

## Scheduled Jobs

Jobs that run at specified intervals:

```typescript
import { MedusaContainer } from "@medusajs/framework/types"

export default async function myCustomJob(container: MedusaContainer) {
  // Job logic
}

export const config = {
  name: "daily-task",
  schedule: "0 0 * * *", // Daily at midnight
}
```

## Admin Customizations

The admin panel can be extended with custom widgets and pages:

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const CustomWidget = () => {
  return <div>Custom Widget Content</div>
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default CustomWidget
```

## Data Seeding

The backend includes a seed script (`src/scripts/seed.ts`) that populates the database with initial data:

- Products with variants, options, and prices
- Categories
- Regions
- Shipping options
- Inventory levels

## Integration with Frontend

The frontend connects to the Medusa backend using the `@medusajs/medusa-js` client:

```typescript
import Medusa from "@medusajs/medusa-js";

export const medusaClient = new Medusa({ 
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3
});
```

## Development Workflow

1. **Start the Medusa server**:
   ```bash
   npm run start
   ```

2. **Seed the database** (if needed):
   ```bash
   npx medusa exec ./src/scripts/seed.ts
   ```

3. **Create migrations** (when modifying data models):
   ```bash
   npx medusa db:generate my-migration
   npx medusa db:migrate
   ```

## Testing

Integration tests are configured in `jest.config.js` and can be run with:

```bash
npm test
```

## Deployment Considerations

For production deployment:

1. Update database configuration to use PostgreSQL
2. Configure CORS settings for production domains
3. Set up proper environment variables
4. Configure proper authentication and security measures
5. Set up database backups and monitoring

## Performance Optimization

1. **Database Indexing**: Ensure proper indexes on frequently queried fields
2. **Caching**: Implement Redis or other caching solutions for frequently accessed data
3. **Query Optimization**: Optimize complex queries, especially those involving multiple joins
4. **Connection Pooling**: Configure database connection pooling for optimal performance

## Security Best Practices

1. **API Authentication**: Ensure all admin routes are properly authenticated
2. **Input Validation**: Validate all user inputs to prevent injection attacks
3. **Rate Limiting**: Implement rate limiting on public API endpoints
4. **CORS Configuration**: Properly configure CORS to allow only trusted origins

## Common Customizations

1. **Custom Payment Providers**: Integrate with additional payment gateways
2. **Custom Shipping Providers**: Add custom shipping rate calculations
3. **Custom Product Fields**: Extend the product model with custom fields
4. **Custom Order Flow**: Modify the order processing workflow
5. **Integrations**: Connect with third-party services like ERPs or CRMs

## Resources

- [Official Medusa Documentation](https://docs.medusajs.com/)
- [API Reference](https://docs.medusajs.com/api/store)
- [GitHub Repository](https://github.com/medusajs/medusa)
- [Discord Community](https://discord.gg/medusajs)
