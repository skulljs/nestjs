import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Session as SessionExpress } from 'express-session';
import { Observable } from 'rxjs';
import { Roles } from 'src/guards/is-authorized/roles';

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as SessionExpress;
    const authorize = this.reflector.get<Roles[]>('authorize', context.getHandler());
    return this.validateRequest(session, authorize);
  }

  validateRequest(session: SessionExpress, authorize: Roles[]) {
    // Public
    if (!authorize) {
      return true;
    }

    let isAuthorized = false;
    if (session.user && authorize.includes(Roles.LoggedUser)) {
      isAuthorized = session.user.isLogged;
    }

    if (session.user && authorize.includes(Roles.Admin)) {
      isAuthorized = session.user.isAdmin;
    }

    return isAuthorized;
  }
}
