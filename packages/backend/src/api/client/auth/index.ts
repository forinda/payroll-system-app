import { di } from '@/common/di';
import { Router } from 'express';
import { CreateUserController } from './controllers/login';
import { RefreshTokenController } from './controllers/refresh-token';
import { SetupAuthController } from './controllers/setup';

type Props = {
  app: Router;
};

export function setupAuthRoutes({ app }: Props) {
  // console.log('setupUsersRoutes');

  const router = Router();

  router
    .post('/login', di.resolve(CreateUserController).post)
    .post('/refresh-token', di.resolve(RefreshTokenController).post)
    .post('/setup', di.resolve(SetupAuthController).get);

  app.use('/auth', router);
}
