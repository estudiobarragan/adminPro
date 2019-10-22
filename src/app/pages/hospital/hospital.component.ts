import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

declare var swal:any;

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styles: []
})
export class HospitalComponent implements OnInit {
  cargando = true;
  totalRegistros= 0;
  hospitales: Hospital [] = [];
  desde = 0;
  token: string;

  constructor(
    public _hospitalService: HospitalService,
    public _usuariosServices: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.token = this._usuariosServices.token;
    this.cargarHospital();
    this._modalUploadService.notificacion
        .subscribe( ( resp ) => this.cargarHospital() );
  }

  mostrarModal( id: string ){
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  crearHospital(){

    swal({
      title:'Crear hospital',
      text: 'Ingres el nombre del hospital',       
      content: 'input',
      ico: 'info',
      buttons: true,
      dangerMode: true
    })
    .then( ( valor:string ) => {
      if(!valor || valor.length ===0 ){
        return;
      }
      return this._hospitalService.crearHospital( valor  )
        .subscribe( (hospital: Hospital) => {
          swal('Hospital creado',`${hospital.nombre} se ha creado con exito.`,'success');
          this.cargarHospital();
        });
    });
  }

  buscarHospital( termino: string ){
    if(termino.length <= 0 ){
      this.cargarHospital();
      return;
    }
    this.cargando = true;

    this._hospitalService.bucarHospital(termino)
        .subscribe( (resp: any) => {
          this.hospitales = resp.hospitales;
          this.cargando = false;
        });

  }

  guardarHospital( hospital: Hospital ){
    this._hospitalService.actualizarHospital(hospital)
        .subscribe(( hospital: Hospital )=>{
          swal('Hospital actualizado', hospital.nombre, 'success');
        });
  }
  borrarHospital( hospital: Hospital ){
    swal({
      title: 'Esta seguro?',
      text: 'Esta por borrar definitivamente a: '+hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then(borrar =>{
      if(borrar){
        this._hospitalService.borrarHospital( hospital._id )
            .subscribe( (borrado: any ) => {
              swal('Atención',`Hospital : ${borrado.hospital_borrado.nombre} eliminado`,'success')
              this.cargarHospital();
            });
      }
    });
  }

  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros || desde < 0 ){
      return;
    }
    this.desde += valor;
    this.cargarHospital();
  }

  cargarHospital(){
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
        .subscribe((resp:any)=>{
          this.totalRegistros = resp.total;
          this.hospitales = resp.hospital;
          this.cargando=false;
        });
  }
}
