import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Session as SessionExpress } from 'express-session';
import { Observable } from 'rxjs';
import { AuthorizeOptions } from 'src/decorators/authorize.decorator';
import { Roles } from 'src/guards/is-authorized/roles';

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as SessionExpress;
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
    const options = this.reflector.get<AuthorizeOptions>('options', context.getHandler());
    return this.validateRequest(session, roles, options);
  }

  validateRequest(session: SessionExpress, roles: Roles[], options: AuthorizeOptions) {
    // ? Public
    if (!roles) {
      return true;
    } else if (!session.user) {
      return false;
    } else {
      let isAuthorized = false;
      if (options.minimunRoleMode) {
        // ? Minimun Role Mode == check if the user have the listed role or a superior one
        if (roles.length != 1) {
          throw new HttpException("[IsAuthorizedGuard] Can't declare more than one role is minimunRoleMode ", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          isAuthorized = session.user.role >= roles[0];
        }
      } else {
        // ? List Role Mode == check if the user have one of the listed roles
        roles.forEach((role) => {
          if (!isAuthorized) {
            isAuthorized = session.user.role == role;
          }
        });
      }
      return isAuthorized;
    }
  }
}
