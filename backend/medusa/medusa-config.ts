import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    database_type: "sqlite",
    database_url: ":memory:",
    store_cors: "*",
    admin_cors: "*",
    redis_url: null
  },
  plugins: [],
  api: {
    store: {
      // Disable authentication for development
      requiresAuthentication: false
    }
  },
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true
  }
});