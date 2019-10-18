import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styles: []
})
export class BreadcrumsComponent implements OnInit {
  label: string ='';

  constructor(
    private _router: Router,
    public _title: Title,
    public _meta: Meta
  ) {
    this.getDataRoute()
        .subscribe( data => {
          console.log(data);
          this.label =data.titulo;
          this._title.setTitle('AdminPro-'+this.label);

          let metaTag: MetaDefinition ={
            name: 'description',
            content: this.label,
          };
          this._meta.updateTag(metaTag);
        });
   }
   getDataRoute(){
    return this._router.events.pipe(
      filter((evento:ActivationEnd)  => evento instanceof ActivationEnd ),
      filter((evento:ActivationEnd) => evento.snapshot.firstChild === null ),
      map((evento:ActivationEnd)  => evento.snapshot.data)
    );
   }
  ngOnInit() {
  }

}
