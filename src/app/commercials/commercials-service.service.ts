import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CommercialsService {

  constructor(private _wsSocket: WebSocketService) { }

  getAllCommercials() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: 'elkinmendoza00@gmail.com'
      }
      this._wsSocket.emit('getAllCommercials', data).subscribe(res => {
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
