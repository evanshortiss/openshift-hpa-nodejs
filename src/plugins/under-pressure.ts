import fp from 'fastify-plugin'
import up, { UnderPressureOptions } from '@fastify/under-pressure'
import { AppOptions } from '../config'


/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<AppOptions>(async (fastify, options) => {
  const { MAX_EVENT_LOOP_DELAY, MAX_EVENT_LOOP_UTILIZATION } = options.config
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
})
