import { Component, OnInit } from '@angular/core';
import { UsuarioService, SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;
  token: string;

  constructor(
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) {
    this.token=_usuarioService.token;
  }

  ngOnInit() {

  }

  subirImagen(){
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
        .then( (resp: any)=>{
          this._modalUploadService.notificacion.emit( resp );
          this.cerrarModal();
          Swal.fire('Imagen actualizada',resp.mensaje,'success');
        })
        .catch((resp: any) => {
          console.log('Error: ', resp);
        });
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
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

    reader.onloadend = () => this.imagenTemp = this.ab2str( reader.result );
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

}