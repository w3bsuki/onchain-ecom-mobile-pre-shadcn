# JSDoc Templates for Medusa Components

This file provides standardized JSDoc templates for documenting different types of components in the Medusa backend. Use these templates to ensure consistent, comprehensive documentation throughout the codebase.

## Function Template

```typescript
/**
 * Brief description of what the function does
 *
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of the optional parameter
 * @returns {ReturnType} Description of the return value
 * @throws {ErrorType} Description of when this error is thrown
 *
 * @example
 * // Example usage
 * const result = functionName(param1, param2);
 */
function functionName(paramName, optionalParam) {
  // Implementation
}
```

## Class Template

```typescript
/**
 * Brief description of the class and its purpose
 *
 * @class
 * @example
 * // Example usage
 * const instance = new ClassName(param);
 * instance.methodName();
 */
class ClassName {
  /**
   * Create a new instance
   *
   * @param {Type} param - Description of the parameter
   */
  constructor(param) {
    // Implementation
  }
  
  /**
   * Brief description of the method
   *
   * @param {Type} param - Description of the parameter
   * @returns {ReturnType} Description of the return value
   */
  methodName(param) {
    // Implementation
  }
}
```

## Module Template

```typescript
/**
 * @module ModuleName
 * @description Brief description of the module and its purpose
 */

import { model } from "@medusajs/framework/utils"

/**
 * Data model for the module
 *
 * @typedef {Object} ModelName
 * @property {string} id - Primary key
 * @property {string} name - Name of the entity
 */
const ModelName = model.define("model_name", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default ModelName
```

## Service Template

```typescript
/**
 * Service class for handling business logic related to a specific domain
 *
 * @class
 */
class ServiceName extends MedusaService({
  ModelName,
}) {
  /**
   * Create a new instance of the service
   *
   * @param {Object} container - Dependency injection container
   */
  constructor(container) {
    super(container)
  }
  
  /**
   * Brief description of the method
   *
   * @param {string} id - ID of the entity
   * @returns {Promise<Object>} The retrieved entity
   * @throws {NotFoundError} If the entity is not found
   */
  async retrieveEntity(id) {
    // Implementation
  }
}
```

## API Route Template

```typescript
/**
 * @route GET /store/custom/{id}
 * @description Retrieve a custom entity by ID
 * @access Public
 *
 * @param {MedusaRequest} req - The request object
 * @param {MedusaResponse} res - The response object
 * @returns {Promise<void>}
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // Implementation
}

/**
 * @route POST /store/custom
 * @description Create a new custom entity
 * @access Public
 *
 * @param {MedusaRequest} req - The request object
 * @param {MedusaResponse} res - The response object
 * @returns {Promise<void>}
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // Implementation
}
```

## Workflow Template

```typescript
/**
 * Workflow to handle a specific business process
 *
 * @workflow
 * @description Brief description of what the workflow does
 * @param {Object} input - Input parameters for the workflow
 * @param {string} input.id - ID of the entity to process
 * @returns {Object} The result of the workflow
 */
const myWorkflow = createWorkflow(
  "my-workflow",
  (input: WorkflowInput) => {
    // Implementation
  }
)

export default myWorkflow
```

## Subscriber Template

```typescript
/**
 * Event handler for when a specific action occurs
 *
 * @subscriber
 * @description Brief description of what the subscriber does
 * @param {SubscriberArgs<T>} args - The event arguments
 * @param {Object} args.event - Event details
 * @param {T} args.event.data - Event data
 * @param {MedusaContainer} args.container - Dependency injection container
 * @returns {Promise<void>}
 */
export default async function eventHandler({
  event: { data },
  container,
}: SubscriberArgs<EventData>) {
  // Implementation
}

export const config: SubscriberConfig = {
  event: "entity.action",
}
```

## Job Template

```typescript
/**
 * Scheduled job that performs a specific task at regular intervals
 *
 * @job
 * @description Brief description of what the job does
 * @param {MedusaContainer} container - Dependency injection container
 * @returns {Promise<void>}
 */
export default async function myCustomJob(container: MedusaContainer) {
  // Implementation
}

export const config = {
  name: "my-custom-job",
  schedule: "0 0 * * *", // Cron expression (daily at midnight)
  numberOfExecutions: -1, // -1 for unlimited execution
}
```

## Middleware Template

```typescript
/**
 * Custom middleware function for API routes
 *
 * @middleware
 * @description Brief description of what the middleware does
 * @param {MedusaRequest} req - The request object
 * @param {MedusaResponse} res - The response object
 * @param {MedusaNextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
async function myMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Implementation
  next();
}
```

## Link Template

```typescript
/**
 * Link between two modules' data models
 *
 * @link
 * @description Brief description of what the link represents
 */
export default defineLink(
  ModuleA.linkable.entityA,
  ModuleB.linkable.entityB
)
```

## Best Practices

1. **Be Concise**: Keep descriptions brief but informative
2. **Be Specific**: Clearly describe parameters, return values, and errors
3. **Provide Examples**: Include usage examples for complex components
4. **Document Errors**: Mention when and why errors might be thrown
5. **Keep Updated**: Update documentation when code changes
6. **Use Types**: Specify parameter and return types
7. **Document Side Effects**: Note any side effects of functions
8. **Document Async Behavior**: Note when functions are asynchronous
