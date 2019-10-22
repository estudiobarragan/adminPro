import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    public _http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales( desde: number = 0, cantidad: number = 5 ){

    let url = URL_SERVICIOS + '/hospital?desde=' + desde + '&cantidad=' + cantidad;

    return this._http.get(url);
  }

  obtenerHospital( id: string){
    let url = URL_SERVICIOS + '/hospital/' + id;

    return this._http.get(url)
              .pipe(map( (resp: any) => resp.hospital));
  }

  borrarHospital( id:string ){
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this._http.delete(url);
  }

  actualizarHospital( hospital: Hospital ){
    let url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this._usuarioService.token;

    return this._http.put(url, hospital)
      .pipe(map( (resp: any)  =>{ 
        return resp.hospital;
      }));
  }

  crearHospital( nombre: string ){
    let url = URL_SERVICIOS + '/hospital/' + '?token=' + this._usuarioService.token;
    const hospital = new Hospital( nombre );
    return this._http.post(url, hospital)
          .pipe(map( (resp: any ) => {
            return resp.hospital;
          }));
  }

  bucarHospital( termino: string ){

    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this._http.get( url );
  }

}
