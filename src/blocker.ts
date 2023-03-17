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

export async function runBlockingWorkload (threaded: boolean, logger: FastifyBaseLogger, time: number): Promise<{ real: string, requested: string, actual: string }> {

  const sTime = Date.now()
  
  if (threaded) {
    if (!mypool) {
      mypool = createPool({
        workerType: 'thread',
        minWorkers: cpus().length - 1,
        workerTerminateTimeout: 60000,
        onCreateWorker: () => logger.info('🧵 worker created')
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
      setTimeout(() => {
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



    