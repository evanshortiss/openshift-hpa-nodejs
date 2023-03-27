import { FastifyPluginAsync } from 'fastify'
import '@fastify/static'

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', (request, reply) => reply.sendFile('index.html'))
}

export default root;