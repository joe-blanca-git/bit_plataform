import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  page = '';
  linkLandingPage = '';

  responseLogin: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notiticationService: NotificationService
  ) {}

  ngOnInit() {
    this.updatePageValue();
  }

  private updatePageValue() {
    if(this.router.url === '/admin-about'){
      this.page = 'ADMIN';
    }else if(this.router.url === '/dinner-about'){
      this.page = 'DINNER';
    }
    
  }

  logar() {
    this.router.navigate(['/admin/index']);
  }

  submitForm(): void {
    const userName = this.validateForm.get('userName')!.value;
    const password = this.validateForm.get('password')!.value;

    if (this.validateForm.valid) {
      this.authService.login(userName, password)
      .subscribe({
        next: (v) => this.processarSucesso(v),
        error: (e) => this.processarFalha(e),
        complete: () => this.notiticationService.createBasicNotification('success','bg-success', 'text-light', 'Seja bem vindo(a)!')

      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      })
    }
  }

  processarSucesso(response: any) {
    this.responseLogin = response;
    this.authService.LocalStorage.salvarDadosLocaisUsuario(response);
    this.router.navigate(['admin/home']);
  }

  processarFalha(fail: any) {
    if (fail.error) {
      if (fail.error.errors.Senha) {
        for (let erro of fail.error.errors.Senha) {
          this.notiticationService.createBasicNotification('error', 'bg-danger', 'text-light', 'Usuário ou Senha Incorretos!, Verifique!');
        }
      }

      if (fail.error.errors.Mensagens) {
        for (let erro of fail.error.errors.Mensagens) {
          console.log('erro 2 ->', erro);
        }
      }
    } else {
      this.notiticationService.createBasicNotification('error', 'bg-danger', 'text-light', 'Erro no Sistema, aguarde e tente novamente mais tarde!');
    }
  }
}
