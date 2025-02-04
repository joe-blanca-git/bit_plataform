import { AuthService } from '../../shared/services/auth.service';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { ThemeService } from './shared/services/themeService';

@Component({
  selector: 'admin-app-root',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminAppComponent {

  user: any = {};
  isCollapsed = true;
  visible = false;
  userLabel: string = '';
  visibleMenu = false;
  
  theme: 'dark' | 'light' = 'dark';

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      setTimeout(() => {
        this.theme = theme;
      });
    });

    this.changeTheme();

    const userData = localStorage.getItem('BIT.user');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      const { username } = parsedData;
      this.user = username
    }
  }

  changeTheme() {
    this.themeService.changeTheme();
  }

  getLogo(): string {
    const logoBase = 'assets/img/logo/';
    if (!this.isCollapsed && this.theme === 'light') {
      return `${logoBase}logo-bit.png`;
    }
    if (!this.isCollapsed && this.theme === 'dark') {
      return `${logoBase}logo-bit-light.png`;
    }
    if (this.isCollapsed && this.theme === 'light') {
      return `${logoBase}logo-bit-sm.png`;
    }
    return `${logoBase}logo-bit-sm-light.png`;
  }


  isAuthenticated(): boolean {
    if (!this.authService.loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  logout(){
    this.authService.logout();
    this.isAuthenticated();
    
  }

  openMenu(): void {    
    this.visibleMenu = true;
    this.isCollapsed = false;
  }

  closeMenu(): void {
    this.visibleMenu = false;
    this.isCollapsed = true;
  }

  
}
