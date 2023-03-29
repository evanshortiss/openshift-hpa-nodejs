import fp from 'fastify-plugin'
import * as prometheus from 'prom-client'

export default fp(async (fastify) => {
  let elu1 = performance.eventLoopUtilization();

  // Instruct the prometheus client to collect default Node.js process metrics
  prometheus.collectDefaultMetrics({});

  const responseTimeMetric = new prometheus.Summary({
    name: 'response_time',
    help: 'response time of requests being processed',
    maxAgeSeconds: 60,
    ageBuckets: 5,
    labelNames: ['url']
  })

  const eluMetric = new prometheus.Summary({
    name: 'nodejs_eventloop_utilisation',
    help: 'event loop utilisation expressed as a value between 0 and 1',
    maxAgeSeconds: 60,
    ageBuckets: 5
  })

  // Use unref() on the ELU collection interval so it doesn't prevent the
  // programfrom exiting if a kill signal is received:
  // https://nodejs.org/api/timers.html#timeoutunref
  setInterval(() => {
    const elu2 = performance.eventLoopUtilization()
    eluMetric.observe(performance.eventLoopUtilization(elu2, elu1).utilization)
    elu1 = elu2
  }, 100).unref()

  fastify.addHook('onResponse', (request, response) => {
    responseTimeMetric.observe({
      url: request.url.split('?')[0]
    }, response.getResponseTime())
  })
})