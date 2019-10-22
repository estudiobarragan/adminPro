import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';


import {  SettingsService, 
          SidebarService, 
          SharedService,
          LoginGuardGuard, 
          SubirArchivoService,
          UsuarioService,
          HospitalService,
          MedicoService } from './service.index';


@NgModule({
  providers:[
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    HospitalService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
    MedicoService
  ],
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ServiceModule { }
