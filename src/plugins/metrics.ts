import fp from 'fastify-plugin'
import * as prometheus from 'prom-client'

export default fp(async (fastify) => {
  // Instruct the prometheus client to collect default Node.js process metrics
  prometheus.collectDefaultMetrics({});

  const responseTimeMetric = new prometheus.Summary({
    name: 'response_time',
    help: 'response time of requests being processed',
    maxAgeSeconds: 60,
    ageBuckets: 5
  })

  fastify.addHook('onResponse', (request, response) => {
    responseTimeMetric.observe(response.getResponseTime())
  })
})