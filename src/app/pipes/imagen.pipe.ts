import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, token: string , tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS+'/img';
    let tokenString = '?token='+token;

    if( !img ){
      return url+'/usuarios/xxx'+tokenString; // No image provista por el backend
    }

    if( img.indexOf( 'http')>=0 ){
      return img;
    }

    switch(tipo){
      case 'usuario':
        url += '/usuarios/'+ img+tokenString;
        break;
      case 'medico':
        url += '/medicos/'+ img+tokenString;
        break;
      case 'hospital':
        url += '/hospitales/'+ img+tokenString;
        break;
      default:
        console.log('Tipo de imagen no existe:usuario, medico u hospital');
        url += '/usuarios/xxx'+tokenString;
    }

    return url;
  }

}
