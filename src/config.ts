import { from } from 'env-var'

export type ApplicationConfiguration = {
  prometheus: {
    eluSampleInterval: number
  }
}

export default function getConfig (env: NodeJS.ProcessEnv): ApplicationConfiguration {
  const { get } = from(env)

  return {
    prometheus: {
      eluSampleInterval: get('ELU_SAMPLE_INTERVAL').default(100).asIntPositive()
    }
  }
}