import { AfterViewInit, Component, OnInit, Renderer} from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';

import * as jquery from 'jquery'


@Component({
  selector: 'app-invoces-customer',
  templateUrl: './invoces-customer.component.html',
  styleUrls: ['./invoces-customer.component.css']
})
export class InvocesCustomerComponent implements OnInit {
  dninumber;
  isProdEnvironment;
  loadingMore;
  nameUSer;
  dtOptions: DataTables.Settings = {};
  invocesPayment;
  dtTrigger= new Subject();
  spanishLanguage;
  messageErrorQuery
  constructor(private renderer: Renderer,routeActived: ActivatedRoute,private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService, private _location: Location) { 
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.isProdEnvironment = routeActived.snapshot.data[0]['isProd'];
    this.loadingMore=true;
    this.nameUSer="Elkin Andres Mendoza";
    this._FunctionsService.SpanishLanguageDatatable().then(res=>{this.spanishLanguage=res;});
    this.messageErrorQuery='No tienes Factura'
      this.invocesPayment = [
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}}, {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 1 plan corporativo',valor:'50.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 2 planes de 100 consultas',valor:'1.050.000,00',fecha:'17 de agosto de 2018',detalle:{}},
        {id:'abasd-23asdr23434',concepto:'Compra de 3 planes con un descuento ....',valor:'1.850.000,00',fecha:'17 de agosto de 2018',detalle:{}},
      ];
      // this.invocesPayment=null;
      
  }

  ngOnInit() {
    console.log('este es el dniNumber ',this.dninumber);
    
    this.dtOptions = {
      language:this.spanishLanguage

      // pageLength: 2
    };
    setTimeout(()=>{
      this.loadingMore=false;
      
    },3000)
    if(!this.dninumber){
      this.router.navigate(["/Dashboard/customers/"]);
      

    }
    
    // Calling the DT trigger to manually render the table
    this.dtTrigger.next();
  }
  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("view-person-id")) {
        this.router.navigate(["/person/" + event.target.getAttribute("view-person-id")]);
      }
    });
  }
  viewDetail(data){
    console.log(data,'est esto')
  }
  

}
