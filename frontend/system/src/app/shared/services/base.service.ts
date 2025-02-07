import { HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError } from "rxjs";
import { LocalStorageUtils} from '../utils/localstorage';
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";

export  class BaseService{
  constructor(
    protected router : Router
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
    public urlPutMov = this.UrlServiceV1 + 'admin/financeiro/mov/putMov.php';
    public urlDeleteMov = this.UrlServiceV1 + 'admin/financeiro/mov/deleteMov.php?user={{idUser}}&empresa={{idEmpresa}}&idMov={{idMov}}';
    public urlGetMov = this.UrlServiceV1 + 'admin/financeiro/mov/getMov.php?user={{idUser}}&empresa={{idEmpresa}}'
    public urlGetHome = this.UrlServiceV1 + 'admin/financeiro/mov/getHome.php?user={{idUser}}&empresa={{idEmpresa}}'

    //shared url

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

    public ObterAuthHeaderJson(){
        return{
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.LocalStorage.obterTokenUsuario()
            })
        }

    }

    protected extractData(response: any){
          return response || {};
    }

    protected serviceError(response: Response | any) {
        let CustomError: string[] = [];
       
        
        if (response instanceof HttpErrorResponse) {            

            if (response.statusText === "Unknown Error") {
                return throwError(() => 'Falha na comunicação - tente novamente mais tarde');
            } else if (response.status === 400) {
                CustomError.push("Erros de validação");
            } else if (response.status === 401) {      
                return throwError(() => '401 - Sem autorização');
            } else if (response.status === 403) {
                this.router.navigate(['/login']);
                return throwError(() => '403 - Sem autorização');
            } else if (response.status === 409) { 
                return throwError(() => '409 - Usuário já existe');
            } else if (response.status === 500) {
                return throwError(() => 'Erro interno do servidor, tente novamente mais tarde.');
            }
        }        
        return throwError(() => response);
    }
    

}
