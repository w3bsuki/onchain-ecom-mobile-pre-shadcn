import { loadEnv, defineConfig } from '@medusajs/framework/dist/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:8000,http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:8000,http://localhost:3000,http://localhost:7000,http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
