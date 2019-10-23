import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.models';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  recuerdame: Boolean=false;
  imagenSubir: File;
  imagenTemp: string;
  token: string;

  constructor(
    public _usuarioService: UsuarioService
  ) {
    this.usuario = this._usuarioService.usuario;
    this.token = this._usuarioService.token;
    let lsRecuerdame = localStorage.getItem('correo');
    if(lsRecuerdame != null){
      this.recuerdame = true;
    }

  }

  ngOnInit() {
  }
  guardar(datos) {
    this.usuario.nombre = datos.nombre;
    if (!this.usuario.google) {
      this.usuario.correo = datos.correo;
    }

    this._usuarioService.actualizarUsuario(this.usuario, datos.recuerdame)
        .subscribe();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = this.ab2str( reader.result);

  }
  ab2str( buf ) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  str2ab( str ) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }
}
