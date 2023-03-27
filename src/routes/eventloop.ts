import { Type } from '@sinclair/typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { runBlockingWorkload } from '../blocker'
import { AppOptions } from '../config'

/**
 * Basic readiness and liveness probe implementation for Kubernetes.
 * @param fastify 
 */
const metrics: FastifyPluginAsyncTypebox<AppOptions> = async (fastify, options): Promise<void> => {
  const { USE_THREADS, MAX_THREADS } = options.config

  fastify.get('/eventloop/block', {
    schema: {
      querystring: Type.Object({
          time: Type.Number({
            minimum: 1,
            maximum: 60 * 1000 // 1 minute 
          }),
      })
    },
  }, (request, response) => {
    const bakeTime = request.query.time
    return runBlockingWorkload({ useThreads: USE_THREADS, maxThreads: MAX_THREADS }, fastify.log, bakeTime).then(() => {
      return { bakeTime, processing: response.getResponseTime()}
    })
  })

  fastify.get('/eventloop/block/random', (request, response) => {
    const bakeTime = Math.round(Math.max(Math.random() * 50, 25))
    return runBlockingWorkload({ useThreads: USE_THREADS, maxThreads: MAX_THREADS }, fastify.log, bakeTime).then(() => {
      return { bakeTime, processing: response.getResponseTime()}
    })
  })
}

export default metrics;
