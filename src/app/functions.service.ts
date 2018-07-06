import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8888';
@Injectable()

export class FunctionsService {
  private socket;

  constructor() { }
  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }


  generateTime() {
    var now = new Date(), time = now.getTime(),
      expireTime = time + 1000 * 36000000
    now.setTime(expireTime)
    return now.toUTCString()
  
  }
  createSessionStorage(data) {
    localStorage.setItem('user', JSON.stringify(data))
    console.log(localStorage.user)

  }
}
