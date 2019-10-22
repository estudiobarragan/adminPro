import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.models';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  token: string;

  constructor(
    public activateRoute: ActivatedRoute,
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
    this.token = _usuarioService.token;
    activateRoute.params
        .subscribe( params => {
          let termino = params['termino'];
          this.buscar(termino);
        });
   }

  ngOnInit() {
  }

  buscar( termino: string){
    // TODO ver si lo popula desde y cantidad
    let url = URL_SERVICIOS +'/busqueda/todo/'+termino;

    this.http.get( url )
        .subscribe( (resp: any )=>{
          /* console.log('resp:',resp); */

          this.medicos  = resp.medicos;
          this.hospitales = resp.hospitales;
          this.usuarios = resp.usuarios;
        })
  }

}
