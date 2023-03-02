'use strict'

import fp from 'fastify-plugin'
import * as prometheus from 'prom-client'

export default fp<prometheus.DefaultMetricsCollectorConfiguration>(async (fastify, opts) => {  
  // Instruct the prometheus client to collect default Node.js process metrics
  prometheus.collectDefaultMetrics(opts);
})