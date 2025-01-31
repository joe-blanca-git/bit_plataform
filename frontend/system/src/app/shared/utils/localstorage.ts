import { usuarioLogado } from "../models/user-logged";

export class LocalStorageUtils {
  usuario: usuarioLogado = new usuarioLogado();

  public obterUsuario() {
    const userStr = localStorage.getItem('BIT.user');        
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  public salvarDadosLocaisUsuario(response: any) {
    this.salvarTokenUsuario(response.access_token);
    this.salvarUsuario(response);
  }

  public salvarTokenUsuario(token: string) {
    localStorage.setItem('BIT.token', token);
  }

  public salvarUsuario(response: any) {
    this.usuario.id = response.user_token.codigo;
    this.usuario.empresa = response.user_token.codigo_empresa;
    this.usuario.username = response.user_token.userName;
    this.usuario.claims = response.user_token.claims;
    this.usuario.menu = response.user_token.menu;
    
    localStorage.setItem('BIT.user', JSON.stringify(this.usuario));
  }

  public obterTokenUsuario(): string {
    return localStorage.getItem('BIT.token') ?? '';
  }
  
  public limparDadosLocaisUsuario(){
    localStorage.removeItem('BIT.token');
    localStorage.removeItem('BIT.user');
  }

}
