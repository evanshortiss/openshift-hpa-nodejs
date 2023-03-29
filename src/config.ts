import { AutoloadPluginOptions } from '@fastify/autoload';
import { from } from 'env-var'

export type ApplicationEnvironment = 'development'|'production'

export type AppEnvionmentVariables = {
  USE_THREADS: boolean
  MAX_THREADS?: number
  MAX_EVENT_LOOP_DELAY: number
  MAX_EVENT_LOOP_UTILIZATION: number
  UNDER_PRESSURE_ENABLED: boolean
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
    MAX_EVENT_LOOP_DELAY: get('MAX_EVENT_LOOP_DELAY').default('950').asIntPositive(),
    MAX_EVENT_LOOP_UTILIZATION: get('MAX_EVENT_LOOP_UTILIZATION').default('0.95').asFloatPositive(),
    UNDER_PRESSURE_ENABLED: get('UNDER_PRESSURE_ENABLED').default('true').asBool()
    
  }
}
