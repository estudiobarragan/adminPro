import { Component, OnInit } from '@angular/core';
import { UsuarioService, SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

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
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;
  
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
  
    reader.onloadend = () => this.imagenTemp = reader.result;
  
  }


}