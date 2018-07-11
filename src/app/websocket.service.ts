import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import * as Rx from 'rxjs'
import { Observable,Subject } from 'rxjs';

import { environment } from '../environments/environment';



@Injectable()
export class WebSocketService {

  socket

  constructor() { }
  public initSocket(): void {
    this.socket = socketIo(environment.ws_url);
    
    console.log(environment.ws_url,'veaalo');
  }

  public emit(nameEmit,data){
    if(data){
      this.socket.emit(nameEmit), data, (res)=>{
        console.log(res,'this is the result')
        return res;
      }
    }else{
      this.socket.emit(nameEmit), (res)=>{
        console.log(res,'this is the result')
        return res;
      }
    }
  }
}
