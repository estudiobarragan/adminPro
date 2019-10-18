import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, throwError, of, Subscription } from 'rxjs';
import { map, retry, mergeMap, filter, retryWhen, delay, take, first, timeout } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy{
  obs : Observable<any>;
  subscripcion: Subscription;

  constructor() {
    this.usaObservable();
  }

  usaObservable(){
    // Busca la promesa pero no arranca hasta que no me subscriba
    // Si quiero agregar aca, pipe o filter, lo debo hacer antes de subscribirme, ej: this.obs.pipe(...)
    this.obs = this.genObservable();

    // En subscripcion pongo la subscripcion, no el observable, por eso de subscripcion me puedo desuscribir
    this.subscripcion = this.obs
                    .subscribe(
                      numero => console.log('Subs: ',numero),
                      error => console.error('Error en el obs: ', error),
                      () => console.log('El observador termino')
                    );
  }

  genObservable(){
    return new Observable( observer => {

      let contador = 0;
      let intervalo = setInterval( () => {
        contador += 1;

        observer.next({contador});
        if( contador === 500 ){
          clearInterval( intervalo);
          observer.complete();
        }
        if( contador === 2 ){
         /*  clearInterval( intervalo ); */
          observer.error( 'Auxilio!' );
        }
      }, 1000);

      /* }).pipe(retry(1), para un solo reintento
        El comando  pipe encadena otros comandos, separados por coma. Ttoma una promesa y genera otra. Dentro 
        ejecuta funciones como retry, map, filter, etc.
      */ 

    }).pipe(retry(),
        map((resp:any)=>{
          return resp.contador+1;
        }),
        filter( (valor, index) =>{
          /* console.log(valor,index); */
          if(valor % 2 ===1 ){
            return true;
          }else {
            return false;
          }
        })
      );
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    console.log('La pagina se cierra');
    this.subscripcion.unsubscribe();
  }

}
