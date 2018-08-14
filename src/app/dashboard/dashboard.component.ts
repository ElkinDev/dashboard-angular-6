import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Router } from "@angular/router";


declare let alertify: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sessionActive;
  constructor(private _FunctionsService: FunctionsService, private router: Router) { 
    this.sessionActive=false;
  }

  ngOnInit() {
    this._FunctionsService.getSessionStorage().then(res => {
      console.log('entraaa????')
      if (res == null || res == '') {
        this.router.navigate(['/login']);

      } else {
        this.checkSession(res)
      }
    }, err => {

    })
  }

  checkSession(data) {
    let getSession = JSON.parse(data)

    let senData = {
      opt: 2,
      mail: getSession.mail,
      token: getSession.token
    }
    this._FunctionsService.logInLogOutDashboar(senData).then(data => {
      let responseData: any = data;
      if (responseData.err) {
        this.router.navigate(['/login']);

      } else {
        if (!responseData.res) {
          this.router.navigate(['/login']);

        }else{
          this.sessionActive=true;
        }
      }

    })
  }
}


