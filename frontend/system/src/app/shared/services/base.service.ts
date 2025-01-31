//não vai ser um serviço do tipo injectable, vai ser uma classe abstrata
//Aqui vai tudo que será reutilizado pelos serviços

import { HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError } from "rxjs";
import { environment } from "../../../environments/environment.prod";
import { LocalStorageUtils} from '../utils/localstorage';
//import { IAppConfig, APP_CONFIG } from "web.config";
import { Injectable, Inject } from "@angular/core";


export  class BaseService{
  constructor(
   ) { }

   public LocalStorage = new LocalStorageUtils();
   protected UrlServiceV1: string = environment.apiUrlv1;

   //auth
   protected UrlServiceLoginV1: string = environment.apiUrlLoginv1;
   protected UrlServiceRecoveryv1: string = environment.apiUrlRecoveryv1;

   //buy plan
   protected UrlServiceBuy: string = environment.apiUrlBuyv1;
   public urlGetPlans = this.UrlServiceBuy + 'buy-plann/getPlanns.php';
   public urlCheckUser = this.UrlServiceLoginV1 + 'register.php?email={{email}}&userName={{username}}';

   //cadastro
   public urlGetCliente = this.UrlServiceV1 + 'admin/cadastro/cliente/getCliente.php?user={{idUser}}&empresa={{idEmpresa}}&cliente={{cliente}}';
   public urlPosCliente = this.UrlServiceV1 + 'admin/cadastro/cliente/postCliente.php';
   public urlGetLista = this.UrlServiceV1 + 'admin/shared/listas/getLista.php?user={{idUser}}&empresa={{idEmpresa}}&tabela={{tabela}}&tipo={{tipo}}';
   public urlPostLista = this.UrlServiceV1 + 'admin/cadastro/lista/postLista.php'

   //financeiro
   public urlPostNewMov = this.UrlServiceV1 + 'admin/financeiro/mov/postMov.php';
   public urlGetMov = this.UrlServiceV1 + 'admin/financeiro/mov/getMov.php?user={{idUser}}&empresa={{idEmpresa}}&tipo={{tipo}}'
   public urlGetHome = this.UrlServiceV1 + 'admin/financeiro/mov/getHome.php?user={{idUser}}&empresa={{idEmpresa}}'


    //Toda vez que chamar esse método, já irá retornar o header
    protected ObterHeaderJson(){
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
    }

    protected ObterHeaderUnlercoded(){
        return {
            headers: new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded'
            })
        }
    }

    protected ObterAuthHeaderJson(){
        return{
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.LocalStorage.obterTokenUsuario()
            })
        }

    }

    //mapeia o nó do response para extrair somente o data
    // protected extractData(response: any){
    //     return response.data || {};
    // }

    protected extractData(response: any){
          return response || {};
    }

    //Tratamento de Erro
    //Vai receber um response ou qualquer coisa
    protected serviceError(response: Response | any) {

        //cria uma coleção de string
        let CustomError: string[] = [];

        //verifica se o erro é uma instancia de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {

            //Aqui também pode ser tratados os erros pelos números
            if (response.statusText === "Unknown Error") {
                //CustomError.push("Ocorreu um erro desconhecido");
                //response.error.errors = CustomError;

                return throwError(() => 'Falha na comunicação - tente novamente mais tarde')
            }
            else if (response.status === 400) {
                CustomError.push("Erros de validação");
               // response.error.errors = CustomError;
            }
            else if (response.status === 401) {
                return throwError(() => '401 - Sem autorização')
            }
            else if (response.status === 403) {
                return throwError(() => '403 - Sem autorização')
            }
        }

        console.error(response.error);
        return throwError(() => response);
    }

}
