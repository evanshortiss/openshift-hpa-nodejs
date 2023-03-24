import { FastifyBaseLogger } from 'fastify'
import { cpus } from 'node:os'
import { pool as createPool, WorkerPool } from 'workerpool'

let mypool!: WorkerPool

function blockingFn (ms: number): number {
  const start = Date.now()
  const blockUntil = start + ms

  while (Date.now() < blockUntil) {}

  return Date.now() - start
}

export async function runBlockingWorkload (
  cfg: { useThreads: boolean, maxThreads?: number },
  logger: FastifyBaseLogger,
  time: number): Promise<{ real: string, requested: string, actual: string }> {
  
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

    const actual = await mypool.exec(blockingFn, [time])
    
    return {
      real: `${Date.now() - sTime}ms`,
      requested: `${time}ms`,
      actual: `${actual}ms`
    }
  } else {
    return new Promise((resolve) => {
      setImmediate(() => {
        const actual = blockingFn(time)
        resolve({
          real: `${Date.now() - sTime}ms`,
          requested: `${time}ms`,
          actual: `${actual}ms`
        })
      })
    })
  }
}



    