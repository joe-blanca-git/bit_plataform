import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ThemeService } from '../../shared/services/themeService';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  theme: 'dark' | 'light' = 'dark';

  listMenuUser = [
    { label: 'Pagar', icon: 'fa-money-bill-1-wave', class: 'btn-outline-danger' },
    { label: 'Receber', icon: 'fa-money-bill-1-wave', class: 'btn-outline-success' },
    { label: 'Novo', icon: 'fa-square-plus', class: 'btn-outline-primary' },
    { label: 'PDV', icon: 'fa-cash-register', class: 'btn-outline-primary' }
  ];


    constructor(
      private themeService: ThemeService,
      private router: Router,
      private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
      this.themeService.theme$.subscribe(theme => {
        this.theme = theme; 
      });
  
      this.changeTheme();
    }

    changeTheme() {
      this.themeService.changeTheme();
    }
    

  getHeader() :string{
    if (this.theme === 'dark') {
      return 'assets/img/bg/header-admin.png';
    }else{
      return 'assets/img/bg/header-admin-light.png';
    }
  }
  
}
