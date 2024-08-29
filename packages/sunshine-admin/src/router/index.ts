import { createHashRouter } from 'react-router-dom';

// TODO ErrorBoundary
import { basicRoutes } from './routes';

export * from './routes';
export * from './utils';

export const router = createHashRouter(basicRoutes);
