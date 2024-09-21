import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import './main.less';

import { RouterProvider } from 'react-router-dom';
import router from './router';

import { NextUIProvider } from '@nextui-org/react';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </StrictMode>
  );
}
