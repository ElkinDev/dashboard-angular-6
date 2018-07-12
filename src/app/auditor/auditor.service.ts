import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  constructor(private _wsSocket: WebSocketService) {

  }

  getAllEditors() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: 'elkinmendoza00@gmail.com',
        token:'ansdjasbdhabsdyuasd'
      }
      this._wsSocket.emit('getAllEditors', data).subscribe(res => {
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
