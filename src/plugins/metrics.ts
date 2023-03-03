import fp from 'fastify-plugin'
import * as prometheus from 'prom-client'
import { AppOptions } from '../app';

export default fp<AppOptions>(async (fastify, opts) => {
  console.log('AppOptions Metrics', opts)
  // Instruct the prometheus client to collect default Node.js process metrics
  prometheus.collectDefaultMetrics(opts.config.prometheus);
})