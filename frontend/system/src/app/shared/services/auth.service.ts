import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageUtils } from '../utils/localstorage';
import { BaseService } from './base.service';
import { Observable, catchError, map } from 'rxjs';
import { NotificationService } from './notification.service';

export interface IUser {
  username: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService extends BaseService {
  private _user: IUser | null = null;

  localStorageUtils = new LocalStorageUtils();

  get loggedIn(): boolean {
    var usuarioLogado = this.localStorageUtils.obterUsuario();
    if (usuarioLogado) {
      var username = usuarioLogado.username;
      this._user = { username };
    } else {
      this._user = null;
    }

    return !!this._user;
  }

  constructor(public override router: Router, private http: HttpClient) {
    super(router);
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  login(email: string, password: string) {
    let _username = email;
    let _password = password;

    let json = `{
      "user": "${_username}",
      "password": "${_password}"
    }`;

    let response = this.http
      .post(this.UrlServiceLoginV1 + 'token.php', json, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
    return response;
  }

  logout() {
    this.localStorageUtils.limparDadosLocaisUsuario();
  }
}

const defaultPath = '/';

@Injectable()
export class AuthGuardService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const currentRoute = route.routeConfig?.path || defaultPath;

    const isAuthForm = ['login', 'reset-password', 'create-account'].includes(
      currentRoute
    );

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }
    
    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login']);
      return false;
    }

    if (isLoggedIn) {
      const _menu = localStorage.getItem('BIT.user');

      if (_menu) {
        const menuData = JSON.parse(_menu);
        const access = menuData.claims.access_routes;

        if (this.hasAccessToRoute(currentRoute, access)) {
          this.authService.lastAuthenticatedPath = currentRoute;
          return true;
        } else {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            'Acesso Negado! <br>Verifique suas permissões de usuário!'
          );
          return false;
        }
      } else {
        return false;
      }
    }

    return isAuthForm;
  }

  private hasAccessToRoute(currentRoute: string, permision: any[]): boolean {
    for (const permisionItems of permision) {
      if (permisionItems.route) {
        if (permisionItems.route === currentRoute) {
          return true;
        }
      }
    }
    return false;
  }
}
