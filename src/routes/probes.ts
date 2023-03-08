import { FastifyPluginAsync } from 'fastify'

/**
 * Basic readiness and liveness probe implementation for Kubernetes.
 * @param fastify 
 */
const metrics: FastifyPluginAsync = async (fastify): Promise<void> => {
  let ready = true
  let alive = true

  fastify.get('/probes/readiness', (request, reply) => {
    if (!ready) {
      reply.internalServerError('something is wrong with the application')
    } else {
      reply.send('ok')
    }
  })

  fastify.get('/probes/liveness', (request, reply) => {
    if (!alive) {
      reply.internalServerError('something is wrong with the application')
    } else {
      reply.send('ok')
    }
  })

  fastify.get('/probes/toggle-readiness', () => {
    ready = !ready

    return `Application will now ${ready ? 'pass' : 'fail'} readiness checks!`
  })

  fastify.get('/probes/toggle-liveness', () => {
    alive = !alive

    return `Application will now ${alive ? 'pass' : 'fail'} liveness checks!`
  })
}

export default metrics;
