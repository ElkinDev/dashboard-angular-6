import { AfterViewInit, Component, OnInit, Renderer} from '@angular/core';
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
  persons= [];
  dtTrigger= new Subject();
  spanishLanguage;
  constructor(private renderer: Renderer,routeActived: ActivatedRoute,private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService) { 
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.isProdEnvironment = routeActived.snapshot.data[0]['isProd'];
    this.loadingMore=false;
    this.nameUSer="Elkin Andres Mendoza";
    this._FunctionsService.SpanishLanguageDatatable().then(res=>{
      this.spanishLanguage=res;
      console.log(this.spanishLanguage,'queeee?')
        
      })
    
  }

  ngOnInit() {
    console.log('este es el dniNumber ',this.dninumber);
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      language:this.spanishLanguage

      // pageLength: 2
    };
    this.persons = [
      {id:23,firstName:'Jose',lastName:'Mendoza'},
      {id:23,firstName:'Faldres',lastName:'Mendoza'},
      {id:23,firstName:'Juo',lastName:'Mendoza'},
      {id:23,firstName:'Elkin',lastName:'Mendoza'},
      {id:23,firstName:'Elkin',lastName:'Mendoza'}
    ];
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
  prueba(data){
    console.log(data,'est esto')
  }
  

}
