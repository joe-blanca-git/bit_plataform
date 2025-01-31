import { HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageUtils } from "../utils/localstorage";
import { BaseService } from "./base.service";
import { Observable, catchError, map } from 'rxjs';

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
      var username = usuarioLogado.username
      this._user = { username };
    }
    else {
      this._user = null;
    }

    return !!this._user;
  }


  constructor(
    private router: Router,
    private http: HttpClient,
    
  ) {
    super();
  }


  login(email: string, password: string){
    let _username = email;
    let _password = password;

    let json = `{
      "user": "${_username}",
      "password": "${_password}"
    }`;

    let response = this.http
      .post(this.UrlServiceLoginV1 + 'token.php', json, this.ObterHeaderJson())
      .pipe(
          map(this.extractData),
          catchError(this.serviceError));
          return response
  }

  logout(){
    this.localStorageUtils.limparDadosLocaisUsuario();
  }




}
