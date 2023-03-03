import { from } from 'env-var'
import * as prometheus from 'prom-client'

export type ApplicationConfiguration = {
  prometheus: prometheus.DefaultMetricsCollectorConfiguration
}

export default function getConfig (env: NodeJS.ProcessEnv): ApplicationConfiguration {
  const { get } = from(env)

  return {
    prometheus: {
      eventLoopMonitoringPrecision: get('EVENT_LOOP_MONITORING_PRECISION').default(10).asIntPositive()
    }
  }
}