import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { FunctionsService } from '../functions.service';
declare let alertify: any;
@Component({
  selector: 'navbar-aside',
  templateUrl: './navbar-aside.component.html',
  styleUrls: ['./navbar-aside.component.css']
})
export class NavbarAsideComponent implements OnInit {
  session;
  constructor(private _FunctionsService: FunctionsService) {
    this.session=this._FunctionsService.returnCurrentSession()
    this._FunctionsService.ListItemsMenuLeft().then(res=>{
      console.log('quee es ',res)
    },err=>{
      
    })
   }

  ngOnInit() {
  	console.log('hacer el emit acá, para ver todos los tipos de usuarios')
  	
  }

}
