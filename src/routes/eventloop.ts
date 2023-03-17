import { Type } from '@sinclair/typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { runBlockingWorkload } from '../blocker'
import { AppOptions } from '../config'

/**
 * Basic readiness and liveness probe implementation for Kubernetes.
 * @param fastify 
 */
const metrics: FastifyPluginAsyncTypebox<AppOptions> = async (fastify, options): Promise<void> => {
  const { USE_THREADS} = options.config

  fastify.get('/eventloop/block', {
    schema: {
      querystring: Type.Object({
          time: Type.Number({
            minimum: 1,
            maximum: 999
          }),
      })
    },
  }, async (request) => {
    return runBlockingWorkload(USE_THREADS, fastify.log, request.query.time)
  })

  fastify.get('/eventloop/block/random', () => {
    return runBlockingWorkload(USE_THREADS, fastify.log, Math.round(Math.max(Math.random() * 60, 30)))
  })
}

export default metrics;
