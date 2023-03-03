import fp from 'fastify-plugin'
import sensible from '@fastify/sensible'
import { AppOptions } from '../app'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<AppOptions>(async (fastify) => {
  fastify.register(sensible)
})
