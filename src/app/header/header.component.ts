import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service'
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { Router } from "@angular/router";

declare let alertify: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'header-dashboard',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imgUserSession;
  constructor(private _FunctionsService: FunctionsService, private router: Router) {
    this.imgUserSession = 'assets/images/admin.jpg';
  }

  ngOnInit() {
  }
  menuToggle() {
    $('body').toggleClass('open');
  }
  RemoveSession() {
    this._FunctionsService.getSessionStorage().then(res => {
      if (res == null || res == '') {
        this.router.navigate(['/login']);

      } else {
        this.closeSession(res)
      }
    }, err => {

    })


    console.log('jaujua')
  }
  closeSession(data) {
    let getSession = JSON.parse(data);
    let sendData = {
      opt: 1,
      mail: getSession.mail,
      token: getSession.token,
    }
    this._FunctionsService.closeSessionUser(sendData).then(res => {
      let resResponse: any = res;
      if (!resResponse.err) {
        this.router.navigate(['/login']);

      } else {
        alertify.error(resResponse.msg)

      }
    }, err => {


    })
  }
}
