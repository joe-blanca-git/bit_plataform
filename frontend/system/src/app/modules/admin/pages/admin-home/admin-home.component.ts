import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ThemeService } from '../../shared/services/themeService';
import { NoticiasService } from '../../shared/services/noticias.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NoticiasResponseModel } from '../../shared/models/noticia.model';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent {
  theme: 'dark' | 'light' = 'light';
  isVisible = false;
  isVisibleMov = false;
  catType = 1; //1 = simples, 2 = completa

  listMenuUser = [
    {
      label: 'Receber',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-success',
      value: 'R'
    },
    {
      label: 'Pagar',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-danger',
      value: 'P'
    },
    {
      label: 'Registrar',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-primary',
      value: 'N'
    },
    { label: 'PDV', 
      icon: 'fa-cash-register', 
      class: 'btn-outline-primary',
      value: 'PDV'
    },
  ];

  constructor(
    private themeService: ThemeService,
    private noticiasService: NoticiasService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.getNoticias();
  }

  listNoticias:any[] = [];

  getNoticias() {
    this.noticiasService.getNoticia()?.subscribe({
      next: (response: NoticiasResponseModel) => {
        this.listNoticias = this.shuffleArray(response.items);
        console.log(this.listNoticias);
        
      },
      error: (e) => this.processarErro(e),
    });
  }
  
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getImage(imagens: string | null | undefined, link: string): string {
    try {
      if (!imagens || !link) {
        return 'assets/img/default.jpg';
      }
  
      const domain = new URL(link).origin;
  
      const jsonStr = imagens.replace(/\\"/g, '"').replace(/\\/g, '');
      const imgObj = JSON.parse(jsonStr);
  
      return imgObj.image_intro
        ? `${domain}/${imgObj.image_intro}`
        : 'assets/img/default.jpg';
  
    } catch (error) {
      console.error('Erro ao converter imagens:', error);
      return 'assets/img/default.jpg';
    }
  }

  showMenu(label: any){    
    if (label === 'N') {
      this.isVisible = true;
    }
  }
  
  showMov(cat: number){
    this.catType = cat;
    this.isVisibleMov = true;
    this.handleOk();
  }

  closeMov(event: boolean){
    if (!event) {
      this.clearVariables();
    }

  }

  changeTheme() {
    this.themeService.changeTheme();
  }

  getHeader(): string {
    if (this.theme === 'dark') {
      return 'assets/img/bg/header-admin.png';
    } else {
      return 'assets/img/bg/header-admin-light.png';
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearVariables();
  }

  clearVariables(){
    this.catType = 0;
    this.isVisibleMov = false;
  }

  processarErro(erro: any) {
    if (erro.error) {
      if (erro.error.errors.Mensagens) {
        for (let e of erro.error.errors.Mensagens) {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            e
          );
        }
      }
    } else {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        erro
      );
    }
  }
}
