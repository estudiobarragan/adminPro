import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from 'src/app/services/service.index';
import { URL_SERVICIOS } from '../../config/config';
import { Medico } from '../../models/medico.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    public _http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  bucarMedico( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this._http.get( url );
  }

  cargarMedicos( desde: number = 0, cantidad: number = 5  ){
    let url = URL_SERVICIOS + '/medico?desde=' + desde + '&cantidad=' + cantidad;
    return this._http.get(url);
  }

  borrarMedico( id:string ){
    let url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;

    return this._http.delete(url);
  }

  guardarMedico( medico: Medico){

    let url = URL_SERVICIOS + '/medico';

    if( medico._id){
      // Actualizando
      url +='/' + medico._id + '?token='+this._usuarioService.token;
      return this._http.put( url, medico )
                .pipe(map( (resp:any) => {
                  // Construyo un objeto con la propiedad estado
                  return {medico: resp.medico, estado: 'actualizado'};
                }))

    }else{
      // Creando
      url += '?token='+this._usuarioService.token;

      return this._http.post(url, medico)
                 .pipe( map( ( resp:any ) => {
                  return {medico: resp.medico,estado: 'creado'};
                  }));
    }
  }


  cargarMedico(id:string){
    let url = URL_SERVICIOS + '/medico/' + id;
    return this._http.get(url)
        .pipe(map((resp:any) => resp.medico));
  }
  
}
