import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { FunctionsService } from '../functions.service';
declare let alertify: any;
import * as $ from 'jquery';

@Component({
  selector: 'navbar-aside',
  templateUrl: './navbar-aside.component.html',
  styleUrls: ['./navbar-aside.component.css']
})
export class NavbarAsideComponent implements OnInit {
  session;
  userItemsMenu:any;
  constructor(private _FunctionsService: FunctionsService) {
   
   }

  ngOnInit() {
  	console.log('hacer el emit acá, para ver todos los tipos de usuarios')
  	 this.session=this._FunctionsService.returnCurrentSession()
    this._FunctionsService.ListItemsMenuLeft().then(res=>{
      let responseF:any=res;
      if(!responseF.err){
        this.userItemsMenu=responseF.roles
      }else{

      }
      console.log('quee es ',res)
    },err=>{
      
    })
  }

}
