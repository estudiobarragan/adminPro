import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.models';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert'; 
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    usuario: Usuario;
    public token: string;

    constructor(
      public _http: HttpClient,
      public _router: Router,
      public _subirArchivoService: SubirArchivoService
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

   // Actualizar
   actualizarUsuario( usuario:Usuario, recordar: any){

    let url = URL_SERVICIOS + '/usuario/'+usuario._id;
    if(recordar != null){
      if( recordar ){
        localStorage.setItem('correo', usuario.correo);
      } else {
        localStorage.removeItem('correo');
      }
    }

    url += '?token='+this.token;

    return this._http.put(url, usuario)
          .pipe(map( (resp: any)  =>{
            if( usuario._id === this.usuario._id){
              this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
            }
            swal('Usuario actualizado', usuario.nombre, 'success');
            return true;
          })
      );
   }

   cambiarImagen( archivo: File, id: string ){

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id )
     .then( (resp: any) => {
       this.usuario.img = resp.usuario.img;
       swal('Imagen actualizado', this.usuario.nombre, 'success');
       this.guardarStorage(id, this.token, this.usuario);
     })
     .catch( resp => {
       console.log(resp);
     });
   }
   cargarUsuarios(desde: number = 0){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    
    return this._http.get(url);
   }

   buscarUsuarios(termino:string){
     let url= URL_SERVICIOS+'/busqueda/coleccion/usuarios/'+ termino;
     return this._http.get(url);
   }

   borrarUsuario(id:string){
     let url = URL_SERVICIOS + '/usuario/' + id +'?token='+ this.token;

     return this._http.delete(url)
                .pipe(map( (resp=>{ 
                  swal('Usuario borrado','El usuario se ha eliminado de los registros','success');
                  return true;
                })))
   }
}
