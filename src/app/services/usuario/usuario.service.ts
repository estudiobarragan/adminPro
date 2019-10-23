import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.models';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2'
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable, throwError } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    usuario: Usuario;
    public token: string;
    menu:any =[];

    constructor(
      public _http: HttpClient,
      public _router: Router,
      public _subirArchivoService: SubirArchivoService
    ) {
      this.cargarStorage();
    }


    // Renueva Token
    renuevaToken(){
      let url = URL_SERVICIOS +'/login/renuevatoken'+ '?token='+this.token;

      return this._http.get(url)
                .pipe(map(( resp:any ) => {
                  this.token =resp.token;
                  localStorage.setItem('token', this.token);
                  console.log('Token renovado');
                  return true;
                }),
                catchError( err=> {
                  Swal.fire('Error al renovar token', 'No fue posible renovar credenciales. Reingrese', 'error');
                  this.logout();
                  return throwError(err);
                })
                );
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
        this.menu = JSON.parse( localStorage.getItem('menu'));
      }else{
        this.token='';
        this.usuario = null;
        this.menu=[];
      }
    }

    // Logout
    logout(){

      this.usuario = null;
      this.token = '';
      this.menu=[];
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('menu');
      this._router.navigate(['/login']);
    }

    // Guardar Storage
    guardarStorage( id: string, token: string, usuario: Usuario, menu:any = []){
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario',JSON.stringify(usuario));
      if(menu.length >0){
        localStorage.setItem('menu',JSON.stringify(menu));
        this.menu = menu;
      }
      this.usuario = usuario;
      this.token = token;
    }

    // Login Google
    loginGoogle( token: string ){
      let url = URL_SERVICIOS + '/login/google';

      return this._http.post(url, {token})
            .pipe(map((resp:any)=>{
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
              return true;
            })
      );
    }


   // Login Normal
  login(usuario: Usuario, recordar: boolean=false){
      if( recordar ){
        localStorage.setItem('correo', usuario.correo);
      } else {
        localStorage.removeItem('correo');
      }

      let url = URL_SERVICIOS + '/login';
      return this._http.post(url, usuario)
            .pipe(map( ( resp:any )=> {
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
              return true;
            }),
            catchError( err => { 
              Swal.fire('Error en el login', err.error.mensaje, 'error');
              return throwError(err);
            }));
  }

   // Register
   crearUsuario( usuario: Usuario){

    let url= URL_SERVICIOS+ '/usuario';
    return this._http.post(url, usuario)
              .pipe(map( (resp:any) =>{
                Swal.fire('Usuario creado', usuario.correo, 'success');
                return resp.usuario;
              }),
              catchError( err => {
                Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                return Observable.throw(err);
              }));
   }

   // Actualizar
   actualizarUsuario( usuario: Usuario, recordar: any){

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
            Swal.fire('Usuario actualizado', usuario.nombre, 'success');
            return true;
          }),
            catchError( err => {
              Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
              return Observable.throw(err);
          }));
   }

   cambiarImagen( archivo: File, id: string ){

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id )
     .then( (resp: any) => {
       this.usuario.img = resp.usuario.img;
       Swal.fire('Imagen actualizado', this.usuario.nombre, 'success');
       this.guardarStorage(id, this.token, this.usuario);
     })
     .catch( resp => {
       console.log(resp);
     });
   }
   cargarUsuarios(desde: number = 0, cantidad: number = 5 ){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde + '&cantidad=' + cantidad;
    
    return this._http.get(url);
   }

   buscarUsuarios(termino:string){
     let url= URL_SERVICIOS+'/busqueda/coleccion/usuarios/'+ termino;
     return this._http.get(url);
   }

   borrarUsuario(id:string){
     let url = URL_SERVICIOS + '/usuario/' + id +'?token='+ this.token;

     return this._http.delete(url)
                .pipe(map( ((resp: any)=>{
                  Swal.fire('Usuario borrado',`El usuario: ${resp.usuario_borrado.nombre}, se ha eliminado de los registros`,'success');
                  return true;
                })))
   }
}
