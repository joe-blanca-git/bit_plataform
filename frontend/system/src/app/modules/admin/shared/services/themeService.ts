import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<'dark' | 'light'>('dark');
  theme$ = this.themeSubject.asObservable();

  changeTheme() {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(newTheme);
  }

  getCurrentTheme() {
    return this.themeSubject.value;
  }
}
