import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';


import { environment } from '../environments/environment';
import { Observable } from 'rxjs';



@Injectable()
export class WebSocketService {

  socket

  constructor() { }
  public initSocket(): void {
    this.socket = socketIo(environment.ws_url);
    
    console.log(environment.ws_url,'veaalo');
  }

  public emit(nameEmit,data){
    return Observable.create((Observer) =>{
      if(data){
        this.socket.emit(nameEmit, data, (res)=>{
          Observer.next(res)
        })
      }else{
        this.socket.emit(nameEmit,(res)=>{
          Observer.next(res)
        })
      }
    });
   
  }
  public on(nameOn){
    return Observable.create((Observer) =>{
      this.socket.on(nameOn,(res)=>{
        Observer.next(res)
      })
    });
   
  }
}
