import { Type } from '@sinclair/typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

/**
 * Basic readiness and liveness probe implementation for Kubernetes.
 * @param fastify 
 */
const metrics: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.get('/eventloop/block', {
    schema: {
      querystring: Type.Object({
          time: Type.Number({
            minimum: 1,
            maximum: 999
          }),
      })
    },
  }, (request) => {
    const { time } = request.query
    const blockUntil = Date.now() + time

    while (Date.now() < blockUntil) {}

    return `Finished blocking for ${time}ms`
  })
}

export default metrics;
