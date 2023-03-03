import fp from 'fastify-plugin'
import * as prometheus from 'prom-client'
import { AppOptions } from '../app';

export default fp<AppOptions>(async (fastify, opts) => {
  const { eluSampleInterval } = opts.config.prometheus
  let elu1 = performance.eventLoopUtilization();

  // Instruct the prometheus client to collect default Node.js process metrics
  prometheus.collectDefaultMetrics();

  const metric = new prometheus.Summary({
    name: 'nodejs_eventloop_utilisation',
    help: 'event loop utilisation expressed as a value between 0 and 1',
    maxAgeSeconds: 60,
    ageBuckets: 5,
    labelNames: ['idle', 'active', 'utilization'],
  })

  // Use unref() on the collection interval so it doesn't prevent the program
  // from exiting if a kill signal is received:
  // https://nodejs.org/api/timers.html#timeoutunref
  setInterval(() => {
    const elu2 = performance.eventLoopUtilization()
    console.log(performance.eventLoopUtilization(elu2, elu1).utilization)
    metric.observe(performance.eventLoopUtilization(elu2, elu1).utilization)
    elu1 = elu2
  }, eluSampleInterval).unref()  
})