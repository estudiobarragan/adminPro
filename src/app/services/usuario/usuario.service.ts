import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.models';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert'; 
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    usuario: Usuario;
    token: string;

    constructor(
      public _http: HttpClient,
      public _router: Router
    ) {
      this.cargarStorage();
    }

    // Esta logueado
    estaLogueado(){
        return( this.token.length > 5) ? true : false;
    }

    // Cargar Storage
    cargarStorage(){
      if(localStorage.getItem('token')){
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse( localStorage.getItem('usuario'));
      }else{
        this.token='';
        this.usuario = null;
      }
    }

    // Logout
    logout(){

      this.usuario = null;
      this.token = '';
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this._router.navigate(['/login']);
    }

    // Guardar Storage
    guardarStorage( id: string, token: string, usuario: Usuario){
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario',JSON.stringify(usuario));
      this.usuario = usuario;
      this.token = token;
    }

    // Login Google
    loginGoogle( token: string ){
      let url = URL_SERVICIOS + '/login/google';

      return this._http.post(url, {token})
            .pipe(map((resp:any)=>{
              this.guardarStorage(resp.id, resp.token, resp.usuario);
              return true;
            })
      );
    }


   // Login
  login(usuario: Usuario, recordar: boolean=false){
      if( recordar ){
        localStorage.setItem('correo', usuario.correo);
      } else {
        localStorage.removeItem('correo');
      }

      let url = URL_SERVICIOS + '/login';
      return this._http.post(url, usuario)
            .pipe(map( ( resp:any )=> {
              this.guardarStorage(resp.id, resp.token, resp.usuario);
              return true;
            })
      );
  }

   // Register
   crearUsuario( usuario: Usuario){

    let url= URL_SERVICIOS+ '/usuario';
    return this._http.post(url, usuario)
              .pipe(map( (resp:any) =>{
                swal('Usuario creado', usuario.correo, 'success');
                return resp.usuario;
              }));
   }
}
