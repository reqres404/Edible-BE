import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/', (_req: Request, res: Response) => {
  logger.info('Health check requested');
  
  res.status(200).json({
    status: 'success',
    message: 'Edible Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Detailed health check
router.get('/detailed', (_req: Request, res: Response) => {
  logger.info('Detailed health check requested');
  
  const healthData = {
    status: 'success',
    message: 'Detailed health check',
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };

  res.status(200).json(healthData);
});

export { router as healthRoutes };
