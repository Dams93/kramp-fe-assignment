import { composePlugins, withNx } from '@nx/next';
import { WithNxOptions } from '@nx/next/plugins/with-nx';
import path from 'path';

const nextConfig: WithNxOptions = {
  nx: {},
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  }
};

const plugins = [withNx];

const config = composePlugins(...plugins)(nextConfig);

export default config;
