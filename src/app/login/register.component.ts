import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert'; 
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.models';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    public _router: Router
  ) { }

  sonIguales(campo1: string , campo2: string ){

      return(group:FormGroup)=>{
        let pass1= group.controls[campo1].value;
        let pass2= group.controls[campo2].value;

        if(pass1 === pass2){
          return null;
        }
        // Error en caso que sea no sean iguales
        return {
          sonIguales:true
        }

      };
  }

  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      clave: new FormControl(null, Validators.required),
      clave2:new FormControl(null, Validators.required),
      condiciones:new FormControl(false),
    },{ validators: this.sonIguales('clave', 'clave2')});

    this.forma.setValue({
      nombre: 'Test',
      correo: 'test@t.com',
      clave: '123',
      clave2:'123',
      condiciones: true
    })
  }

  registrarUsuario( ){
    if( this.forma.invalid ){
      return;
    }
    if( !this.forma.value.condiciones ){
      swal("Importante", "Debe aceptar las condiciones", "warning");
      return;
    }
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.clave
    );
    this._usuarioService.crearUsuario( usuario )
        .subscribe( resp => this._router.navigate(['/login']) )
    
  }

}
