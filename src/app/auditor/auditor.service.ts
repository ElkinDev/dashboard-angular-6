import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  constructor(private _wsSocket: WebSocketService) {

  }
  session = {
    mail: 'elkinmendoza00@gmail.com',
    token: 'asdasdasdasdasdasd'
  }
  getAllEditors() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: 'elkinmendoza00@gmail.com',
        token: 'ansdjasbdhabsdyuasd'
      }
      this._wsSocket.emit('getAllEditors', data).subscribe(res => {
        if (!res.err) {
          if (res.data.length) {
            resolve(res.data)
          } else {
            resolve(null)
          }
        } else {
          reject({ err: true, msg:res.msg })
        }
      }, err => {
        reject({ err: true, msg:err.msg })
        

      })
    });
    return promise;

  }
  CreateAuditorUser(data) {
    return new Promise((resolve, reject) => {
      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      console.log(senData)
      this._wsSocket.emit('addUserPanel', senData).subscribe((res) => {
        if (!res.err) {
          resolve(res.msg)
        } else {
          reject(res.msg )
        }
      }, (error) => {
        reject({ err: true, msg: error.msg })

      })
    });

  }
}
