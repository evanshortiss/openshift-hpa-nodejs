import { join } from 'path';
import AutoLoad from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { AppOptions, getConfig } from './config';


// Pass --options via CLI arguments in command to enable these options.
const options: Partial<AppOptions> = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Do not touch the following lines
  const config = getConfig(process.env)

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: {...options, ...opts, config: {...config } }
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: {...options, ...opts, config: {...config } }
  })
};

export default app;
export { app, options }
