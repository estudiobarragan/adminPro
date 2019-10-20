import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.models';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 
  public recuerdame =false;
  public correo: string;

  auth2: any;

  constructor(
    public _router: Router,
    public _usuarioService: UsuarioService
  ) { }

    ngOnInit() {
        init_plugins();
        this.googleInit();

        this.correo = localStorage.getItem('correo') || '';
        if(this.correo.length >1){
          this.recuerdame = true;
        }
    }

    googleInit(){
      gapi.load( 'auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '47867383424-6cjd6130in95vqolo9b816el091dd6al.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.attachSignin(document.getElementById('btnGoogle'));
      });
    }
    attachSignin( element ){
      this.auth2.attachClickHandler(element,{},(googleUser)=>{
        let profile = googleUser.getBasicProfile();
        // console.log(profile);

        let token = googleUser.getAuthResponse().id_token;

        this._usuarioService.loginGoogle(token)
                .subscribe( resp => this._router.navigate(['/dashboard']) );
      });
    }


    ingresar(forma: NgForm){
        if(forma.invalid){
          return;
        }
        let usuario = new Usuario(null, forma.value.correo, forma.value.clave);

        this._usuarioService.login(usuario, forma.value.recuerdame )
                .subscribe( resp => this._router.navigate(['/dashboard']) );
    }
}
