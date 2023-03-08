import { test } from 'tap'
import Fastify from 'fastify'
import Metrics from '../../src/plugins/metrics'

test('metrics plugin loads successfully', async (t) => {
  const fastify = Fastify()
  void fastify.register(Metrics, {
    config: {
      prometheus: {}
    }
  })
  await fastify.ready()
})
