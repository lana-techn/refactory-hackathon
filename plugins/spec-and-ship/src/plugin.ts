import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const specAndShipPlugin = createPlugin({
  id: 'spec-and-ship',
  routes: {
    root: rootRouteRef,
  },
});

export const SpecAndShipPage = specAndShipPlugin.provide(
  createRoutableExtension({
    name: 'SpecAndShipPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
