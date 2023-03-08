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
    const sTime = Date.now()
    return new Promise((resolve) => {
      const pTime = Math.max(Math.random() * 50, 10)
      setTimeout(
        () => resolve(`Processing time: ${pTime}. Real time: ${Date.now() - sTime}ms`),
        pTime
      )
    })
  })
}

export default metrics;
