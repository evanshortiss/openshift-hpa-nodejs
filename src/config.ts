import { AutoloadPluginOptions } from '@fastify/autoload';
import { from } from 'env-var'

export type ApplicationEnvironment = 'development'|'production'

export type AppEnvionmentVariables = {
  USE_THREADS: boolean
  MAX_THREADS?: number
}

export type AppOptions = {
  // Place your custom options for app below here.
  config: AppEnvionmentVariables
} & Partial<AutoloadPluginOptions>;

export function getConfig (env: NodeJS.ProcessEnv): AppEnvionmentVariables {
  const { get } = from(env)
  
  return {
    USE_THREADS: get('USE_THREADS').default('false').asBool(),
    MAX_THREADS: get('MAX_THREADS').asIntPositive(),
  }
}
