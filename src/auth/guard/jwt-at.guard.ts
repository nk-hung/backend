import { AuthGuard } from '@nestjs/passport';

export class JwtAtGuard extends AuthGuard('jwt_access') {
  constructor() {
    super();
  }
}
