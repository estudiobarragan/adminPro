import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.models';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros = 0;
  cargando = true;
  token: string;

  constructor(
    public _usuariosServices: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.token = this._usuariosServices.token;
    this.cargarUsuarios();
    this._modalUploadService.notificacion
        .subscribe( ( resp ) => this.cargarUsuarios() );
  }
  mostrarModal( id: string ){
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuariosServices.cargarUsuarios(this.desde)
        .subscribe((resp:any)=>{
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuario;
          this.cargando=false;
        })
  }
  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros || desde < 0 ){
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string){ 
    if(termino.length <= 0 ){
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this._usuariosServices.buscarUsuarios(termino)
        .subscribe( (resp: any) => {
          this.usuarios = resp.usuarios;
          this.cargando = false;
        })

  }
  borrarUsuario(usuario){
    if(usuario._id === this._usuariosServices.usuario._id){
      swal('Error', 'No puede borrarse a si mismo','error');
      return;
    }
    swal({
      title: 'Esta seguro?',
      text: 'Esta por borrar definitivamente a: '+usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then(borrar =>{
      if(borrar){
        this._usuariosServices.borrarUsuario( usuario._id )
            .subscribe( (borrado:any)=> {
              this.cargarUsuarios();
            })
      }
    })
    
  }
  guardarUsuario( usuario){
    this._usuariosServices.actualizarUsuario(usuario, null)
        .subscribe();
  }
}
