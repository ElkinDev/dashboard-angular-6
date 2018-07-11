import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {WebSocketService} from './websocket.service';
declare var jQuery:any;
declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
              private _wsSocket:WebSocketService  ) {

  }
  title = 'app';
  onActivate(event) {
    window.scroll(0, 0);
  }
  ngOnInit() {
    this._wsSocket.initSocket()
  }
  

  
}
