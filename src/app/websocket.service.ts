import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import * as Rx from 'rxjs'
import { Observable,Subject } from 'rxjs';

import { environment } from '../environments/environment';


const socket = socketIo(environment.ws_url);

@Injectable()
export class WebSocketService {
  

  constructor() { }
  public initSocket(): void {
    console.log(environment.ws_url,'veaalo');
  }

  public emit(nameEmit,data){
    if(data){
      socket.emit(nameEmit), data, (res)=>{
        console.log(res,'this is the result')
      }
    }else{
      socket.emit(nameEmit), (res)=>{
        console.log(res,'this is the result')
      }
    }
  }
}
