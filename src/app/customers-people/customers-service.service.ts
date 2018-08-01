import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _wsSocket: WebSocketService) { }
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: 'edbee4f4050c98ad293df52d'
  }
  getAllCustomers() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: this.session.mail,
        token: this.session.token,
        opt: 15
      }
      this._wsSocket.emit('userRolesEvents', data).subscribe(res => {
        if (!res.err) {
          if (res.data.length) {
            resolve(res.data)
          } else {
            resolve(null)
          }
        } else {
          reject({ err: true, msg: res.msg })
        }
      }, err => {
        reject({ err: true, msg: err.msg })


      })
    });
    return promise;

  }
  createCustomer(data) {
    return new Promise((resolve, reject) => {
      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      console.log(senData)
      this._wsSocket.emit('addUserPanel', senData).subscribe((res) => {
        if (!res.err) {
          resolve(res.msg)
        } else {
          reject(res.msg)
        }
      }, (error) => {
        reject({ err: true, msg: error.msg })

      })
    });

  }
}
