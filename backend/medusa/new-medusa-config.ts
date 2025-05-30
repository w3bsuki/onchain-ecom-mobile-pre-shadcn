import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    database_url: ":memory:",
    database_type: "sqlite"
  },
  modules: {}
})
