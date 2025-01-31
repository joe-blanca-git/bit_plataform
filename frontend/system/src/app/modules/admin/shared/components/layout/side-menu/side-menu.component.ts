import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/themeService'; 

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() collapsed: boolean = false;
  
  theme: 'dark' | 'light' = 'light';

  menu: any = [];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme; 
    });
    this.getMenu();
  }

  getMenu() {
    const _menu = localStorage.getItem('BIT.user'); 
  
    if (_menu) {
      const menuData = JSON.parse(_menu); 
      const menus = menuData.claims.menu;      
      this.menu = menus;
    } else {
    }
  }
  
}
