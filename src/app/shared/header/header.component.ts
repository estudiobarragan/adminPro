import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuario.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  token: string;

  constructor(
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    public _router: Router
  ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this.token =  this._usuarioService.token;
    
  }
  buscar( termino: string ){
    this._router.navigate(['/busqueda',termino])
  }
}
