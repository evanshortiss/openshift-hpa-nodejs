import fp from 'fastify-plugin'
import path = require('path')


/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', 'public')
  })
})
