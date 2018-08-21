import { AfterViewInit, Component, OnInit, Renderer} from '@angular/core';
import {Location} from '@angular/common';

import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-new-invoce',
  templateUrl: './new-invoce.component.html',
  styleUrls: ['./new-invoce.component.css']
})
export class NewInvoceComponent implements OnInit {
  loadingMore;
  dninumber;
  nameUSer;
  plans;
  allDepartaments;
  allmunicipalities;
  currentDepartament;
  constructor(private renderer: Renderer,routeActived: ActivatedRoute,private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService,private _location: Location) {
    this.dninumber = routeActived.snapshot.params['dninumber'];
    this.nameUSer="Elkin Andres Mendoza";
    this._FunctionsService.getPlans().then(res=>{
      this.plans=res;
    })
    this._FunctionsService.getAllDepartaments().then(res=>{
      let responseD:any=res;
      if(!responseD.err){
        this.allDepartaments=responseD.states
      }
    })
  

    this.currentDepartament=null;
    this.loadingMore=false;
    this.allmunicipalities=null;

   }

  ngOnInit() {

    if(!this.dninumber){
      this._location.back();

    }
  }
  changeDepartament(departament){
    this.allmunicipalities=null;    
    this._FunctionsService.getSpecificRegions(departament).then(res=>{
      let responseD:any=res;
      if(!responseD.err){
        this.allmunicipalities=responseD.cities
      }
    })
  }

}
