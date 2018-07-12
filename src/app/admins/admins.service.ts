import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable()

export class adminsService {
  constructor(private _wsSocket: WebSocketService) {

  }

  getAllAdmins() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: 'elkinmendoza00@gmail.com'
      }
      this._wsSocket.emit('getAllAdmins', data).subscribe(res => {
        if (!res.err) {
          resolve(res)

        } else {
          reject({ err: true })
        }
      })
    });
    return promise;

  }

}
