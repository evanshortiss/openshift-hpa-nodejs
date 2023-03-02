import { FastifyPluginAsync } from 'fastify'

/**
 * Basic readiness and liveness probe implementation for Kubernetes.
 * @param fastify 
 */
const metrics: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/probes/readiness', () => {
    return 'ok'
  })

  fastify.get('/probes/liveness', () => {
    return 'ok'
  })
}

export default metrics;
