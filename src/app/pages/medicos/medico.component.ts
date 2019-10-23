import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  medico: Medico = new Medico('','','','','');
  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');
  token: string;
  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public _usuarioService: UsuarioService,
    public _router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) { 
    activatedRoute.params.subscribe(params=>{
      let id = params['id'];
      if( id !== 'nuevo'){
        this.cargarMedico(id);
      }
    })
  }

  ngOnInit() {
    this.token = this._usuarioService.token;
    this._hospitalService.cargarHospitales( 0, 0)
        .subscribe( (hospitales: any) => this.hospitales = hospitales.hospital );

    this._modalUploadService.notificacion
        .subscribe(resp =>{
          this.medico.img = resp.medico.img;
        })
  }
  guardarMedico(f: NgForm){

    if(!f.invalid){
      this._medicoService.guardarMedico( this.medico )
          .subscribe( resp =>{
            let medicoG = resp.medico
            Swal.fire('Medico '+ resp.estado, medicoG.nombre , 'success');
            this.medico._id = medicoG._id; 
            this._router.navigate(['/medico', medicoG._id]);
          })
    }
  }
  cambioHospital( id: string ){
    this._hospitalService.obtenerHospital( id )
        .subscribe( resp => this.hospital = resp )
    
  }
  cargarMedico( id:string ){
    this._medicoService.cargarMedico( id )
        .subscribe( medico => {
          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital(this.medico.hospital);
        });
  }
  cambiarFoto(){
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id )
  }
}
