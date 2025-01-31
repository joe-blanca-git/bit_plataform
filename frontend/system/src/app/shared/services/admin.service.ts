import { totaisModel } from '../models/totais.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { httpClient } from "src/core/httpClient";
import { financeirosModel } from '../models/financeiros.model';
import { pessoasModel } from '../models/pessoas.model';
import { contasModel } from '../models/contas.model';
import { categoriasModel } from '../models/categorias.model';
import { pgtoModel } from '../models/fPgto.model';
import { metodoModel } from '../models/metodo.model';
import { profileModel } from '../models/profile.model';

@Injectable()
export class adminApiProvider {

  _idUser: string = '';
  _idEmpresa: string='';

  constructor(
        public httpClient: httpClient,
        public apiService: BaseService
    ) { }

    public getProfile(): Promise<any> {
      const userJson = localStorage.getItem('bitADMIN.user');
      if (!userJson) {
          console.error('Usuário não encontrado');
          return Promise.reject('Usuário não encontrado');
      }
  
      const user = JSON.parse(userJson);
      this._idUser = user.id;
      this._idEmpresa = user.id_empresa;
  
      let url = this.apiService.urlGetProfile;
      url = url.replace("{UserId}", this._idUser);
      url = url.replace("{EmpresaId}", this._idEmpresa);
  
      return this.httpClient.get(url, true, false)
          .then((response: any) => {

              if (response && typeof response === 'object') {
                  return response;  
              } else {
                  console.error('Resposta inválida da API:', response);
                  return Promise.reject('Resposta inválida da API');
              }
          })
          .catch((err) => {
              console.error('Erro ao obter perfil:', err);
              return Promise.reject(err);
          });
  }
  
  


    public getTotais(): Promise<totaisModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idUser = user.id;
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetTotais;
      url = url.replace("{idUser}", this._idUser);
      url = url.replace("{EmpresaId}", this._idEmpresa);

      //url teste da api mockup
      let urlTeste = 'https://my-json-server.typicode.com/joeder-blanca/apifake/totalMensal';

      return new Promise((resolve, reject) => {
        this.httpClient.get(urlTeste,true,false).then((response : any) => {
          let totais: totaisModel[] = [];
          if(JSON.stringify(response) === '{}'){
            totais = [];
          }else {
            for(const item of response){
              totais.push(new totaisModel().mapFromApi(item));
            }
          }
          resolve(totais);
        }, (err) => {
          reject(err);
        })
      })
    }

    public getFinanceiros(): Promise<financeirosModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
      if (userJson) {
        const user = JSON.parse(userJson);
        this._idEmpresa = user.id_empresa
      } else {
        console.error('Usuário não encontrado');
      }

      let url = this.apiService.urlGetFinanceiros;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let financeiros: financeirosModel[] = [];
          if(JSON.stringify(response) === '{}'){
            financeiros = [];
          }else {
            for(const item of response){
              financeiros.push(new financeirosModel().mapFromApi(item));
            }
          }

          resolve(financeiros);
        }, (err) => {
          reject(err);
        })
      })
    }


    public getContas(): Promise<contasModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetContas;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let contas: contasModel[] = [];
          if(JSON.stringify(response) === '{}'){
            contas = [];
          }else {
            for(const item of response){
              contas.push(new contasModel().mapFromApi(item));
            }
          }
          resolve(contas);
        }, (err) => {
          reject(err);
        })
      })


    }

    public getCategorias(): Promise<categoriasModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetCategorias;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let categoria: categoriasModel[] = [];
          if(JSON.stringify(response) === '{}'){
            categoria = [];
          }else {
            for(const item of response){
              categoria.push(new categoriasModel().mapFromApi(item));
            }
          }
          resolve(categoria);
        }, (err) => {
          reject(err);
        })
      })


    }

    public getMetodo(): Promise<metodoModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetMetodos;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let metodos: metodoModel[] = [];
          if(JSON.stringify(response) === '{}'){
            metodos = [];
          }else {
            for(const item of response){
              metodos.push(new metodoModel().mapFromApi(item));
            }
          }
          resolve(metodos);
        }, (err) => {
          reject(err);
        })
      })
    }

    public getPgto(): Promise<pgtoModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetFpgto;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let pagamentos: pgtoModel[] = [];
          if(JSON.stringify(response) === '{}'){
            pagamentos = [];
          }else {
            for(const item of response){
              pagamentos.push(new pgtoModel().mapFromApi(item));
            }
          }
          resolve(pagamentos);
        }, (err) => {
          reject(err);
        })
      })


    }

    public getPessoas(): Promise<pessoasModel[]>{
      const userJson = localStorage.getItem('bitADMIN.user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this._idEmpresa = user.id_empresa
        } else {
          console.error('Usuário não encontrado');
        }

      let url = this.apiService.urlGetPessoas;
      url = url.replace("{EmpresaId}", this._idEmpresa);

      return new Promise((resolve, reject) => {
        this.httpClient.get(url,true,false).then((response : any) => {
          let pessoas: pessoasModel[] = [];
          if(JSON.stringify(response) === '{}'){
            pessoas = [];
          }else {
            for(const item of response){
              pessoas.push(new pessoasModel().mapFromApi(item));
            }
          }
          resolve(pessoas);
        }, (err) => {
          reject(err);
        })
      })
    }


    public postFinanceiro(item: any): Promise<void>{
      const userJson = localStorage.getItem('bitADMIN.user');
      if (userJson) {
        const user = JSON.parse(userJson);
        this._idEmpresa = user.id_empresa
      } else {
        console.error('Usuário não encontrado');
      }

      let url = this.apiService.urlPostFinanceiros;
      url = url.replace("{EmpresaId}", this._idEmpresa);
    
      return new Promise((resolve, reject) => {
        this.httpClient.post(url, item, true, false)
          .then((response: any) => {
            if(JSON.stringify(response.Id) === "{}"){
              console.log("Resposta vazia");
            } else {
            }
            resolve();
          }, (err) => {
            reject(err);
          });
      });
    }

}

