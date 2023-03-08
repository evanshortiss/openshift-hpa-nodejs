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
  }, async (request) => {
    const { time } = request.query

    return new Promise((resolve) => {
      const blockUntil = Date.now() + time
      while (Date.now() < blockUntil) {}

      resolve(`Finished blocking for ${time}ms`)
    })
  })

  fastify.get('/eventloop/random', () => {
    return new Promise((resolve) => {
      const time = Math.random() * 50
      setTimeout(() => resolve(`Responded after ${time}ms`), time)
    })
  })
}

export default metrics;
