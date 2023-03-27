import { FastifyBaseLogger } from 'fastify'
import { cpus } from 'node:os'
import { pool as createPool, WorkerPool } from 'workerpool'

let mypool!: WorkerPool

async function blockingFnWithIo (ms: number): Promise<void> {
  const ioTime = Math.ceil(ms * 0.1)
  const processingTime = Math.round(ms * 0.9)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const blockUntil = Date.now() + processingTime
      
      while (Date.now() < blockUntil) {}
      
      resolve()
    }, ioTime)
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

    await mypool.exec(blockingFnWithIo, [time])
    
    return Date.now() - sTime
  } else {
    await blockingFnWithIo(time)

    return Date.now() - sTime
  }
}



    