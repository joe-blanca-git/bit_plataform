import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ThemeService } from '../../shared/services/themeService';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent {
  theme: 'dark' | 'light' = 'dark';
  isVisible = false;
  isVisibleMov = false;
  catType = 0; //1 = simples, 2 = completa

  listMenuUser = [
    {
      label: 'Pagar',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-danger',
      value: 'P'
    },
    {
      label: 'Receber',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-success',
      value: 'R'
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.changeTheme();
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
}
