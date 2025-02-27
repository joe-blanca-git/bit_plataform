import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BaseService } from 'src/app/shared/services/base.service';

@Injectable()
export class adminApiProvider {

  _idUser: string = '';
  _idEmpresa: string='';

  constructor(
        public httpClient: HttpClient,
        public apiService: BaseService
    ) { }



}

