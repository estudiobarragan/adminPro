import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  cargando = true;
  totalRegistros= 0;
  medicos: Medico [] = [];
  desde = 0;
  token: string;

  constructor(
    public _medicosService: MedicoService,
    public _usuariosServices: UsuarioService
  ) { }

  ngOnInit() {
    this.token = this._usuariosServices.token;
    this.cargarMedico();
  }

  borrarMedico( medico: Medico ){
    swal({
      title: 'Esta seguro?',
      text: 'Esta por borrar definitivamente a: '+medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then(borrar =>{
      if(borrar){
        this._medicosService.borrarMedico( medico._id )
            .subscribe( (borrado: any ) => {
              swal('Atención',`Medico : ${borrado.medico_borrado.nombre} eliminado`,'success')
              this.cargarMedico();
            });
      }
    });
    }

  buscarMedico( termino: string ){
    if(termino.length <= 0 ){
      this.cargarMedico();
      return;
    }
    this.cargando = true;
    this._medicosService.bucarMedico(termino)
        .subscribe( (resp: any) => {
          this.medicos = resp.medicos;
          this.cargando = false;
        });
  }

  cargarMedico(){
    this.cargando = true;
    this._medicosService.cargarMedicos( this.desde )
        .subscribe( ( resp: any ) => {

          this.totalRegistros = resp.total;
          this.medicos = resp.medico;
          this.cargando = false;
        });
  }
  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros || desde < 0 ){
      return;
    }
    this.desde += valor;
    this.cargarMedico();
  }
}
