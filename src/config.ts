import { from } from 'env-var'

export type ApplicationConfiguration = {
  prometheus: {
    eventLoopMonitoringPrecision?: number
  }
}

export default function getConfig (env: NodeJS.ProcessEnv): ApplicationConfiguration {
  const { get } = from(env)

  return {
    prometheus: {
      eventLoopMonitoringPrecision: get('PROM_EL_MONITOR_PRECISION').asIntPositive()
    }
  }
}