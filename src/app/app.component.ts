import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { WebSocketService } from './websocket.service';
import { FunctionsService } from './functions.service'
import { environment } from './../environments/environment';
import { environmentProd } from './../environments/environment.prod';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sessionActive;
  constructor(private router: Router, private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService) {
    // this.sessionActive = false;


  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  ngOnInit() {
    this._wsSocket.initSocket()
    // this._FunctionsService.getSessionStorage().then(res => {
    //   if (res == null || res == '') {
    //     this.router.navigate(['/login']);

    //   } else {
    //     this.checkSession(res)
    //   }
    // }, err => {

    // })
  }

  // checkSession(data) {
  //   let getSession = JSON.parse(data)

  //   let senData = {
  //     opt: 2,
  //     mail: getSession.mail,
  //     token: getSession.token
  //   }
  //   this._FunctionsService.logInLogOutDashboar(senData).then(data => {
  //     let responseData: any = data;
  //     if (responseData.err) {
  //       this.router.navigate(['/login']);

  //     } else {
  //       if (!responseData.res) {
  //         this.router.navigate(['/login']);

  //       } else {
  //         if (this.router.url === '/login') {
  //           this.router.navigate(['/Dashboard']);

  //         }
  //         this.sessionActive = true;
  //       }
  //     }

  //   })
  // }


}
