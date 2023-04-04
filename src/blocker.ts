import { FastifyBaseLogger } from 'fastify'
import { cpus } from 'node:os'
import { pool as createPool, WorkerPool } from 'workerpool'

let mypool!: WorkerPool

async function blockingFn (ms: number): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(() => {
      const blockUntil = Date.now() + ms
      
      while (Date.now() < blockUntil) {}
        
      resolve()
    })
  })
}

export async function runBlockingWorkload (
  cfg: { useThreads: boolean, maxThreads?: number },
  logger: FastifyBaseLogger,
  time: number): Promise<number> {
  
  const { useThreads, maxThreads } = cfg
  const sTime = Date.now()
  
  if (useThreads) {
    if (!mypool) {
      mypool = createPool({
        workerType: 'thread',
        workerTerminateTimeout: 60000,
        maxWorkers: maxThreads ? maxThreads : cpus().length / 2,
        onCreateWorker: () => logger.info('🧵 worker created'),
        onTerminateWorker: () => logger.info('🧵 worker... terminated 🤖')
      })
    }

    await mypool.exec(blockingFn, [time])
    
    return Date.now() - sTime
  } else {
    await blockingFn(time)

    return Date.now() - sTime
  }
}



    