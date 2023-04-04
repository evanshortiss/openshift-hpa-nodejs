import fp from 'fastify-plugin'
import up, { UnderPressureOptions } from '@fastify/under-pressure'
import { AppOptions } from '../config'

export default fp<AppOptions>(async (fastify, options) => {
  const { MAX_EVENT_LOOP_DELAY, MAX_EVENT_LOOP_UTILIZATION, UNDER_PRESSURE_ENABLED } = options.config

  if (UNDER_PRESSURE_ENABLED) {
    const opts: UnderPressureOptions = {
      maxEventLoopDelay: MAX_EVENT_LOOP_DELAY,
      maxEventLoopUtilization: MAX_EVENT_LOOP_UTILIZATION,
      pressureHandler: (req, reply, type, value) => {
        if (req.url.includes('/probes/')) {
          // Allow the kube probe endpoints to pass through
          fastify.log.warn(`under pressure allowing passthrough for probe ${req.url} despite pressure of type ${type}`)
        } else {
          fastify.log.warn(`under pressure of type "${type}". returning 503 response`)
          
          reply.serviceUnavailable('This service is currently overwhelmed. Try again later.')
        }
      }
    }

    fastify.register(up, opts)
  } else {
    fastify.log.warn('UNDER_PRESSURE_ENABLED was false. under pressure plugin not registered')
  }
})
