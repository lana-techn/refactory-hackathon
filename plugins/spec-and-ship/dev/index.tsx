import { createDevApp } from '@backstage/dev-utils';
import { specAndShipPlugin, SpecAndShipPage } from '../src/plugin';

createDevApp()
  .registerPlugin(specAndShipPlugin)
  .addPage({
    element: <SpecAndShipPage />,
    title: 'Root Page',
    path: '/spec-and-ship',
  })
  .render();
