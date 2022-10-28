import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckAuthenticatedMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    if (req.session[this.configService.get('checkAuthencicatedKey')]) {
      next();
    } else {
      res.status(401).send({
        error: 'Authentication required',
      });
    }
  }
}
