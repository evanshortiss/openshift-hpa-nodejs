import * as prometheus from 'prom-client'
import { FastifyPluginAsync } from 'fastify'

const metrics: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/metrics', async (request, reply) => {
    const metrics = await prometheus.register.metrics()
    
    reply.header('content-type', prometheus.register.contentType)
    reply.send(metrics)
  })
}

export default metrics;
