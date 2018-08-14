import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService) { }
  session=this._FunctionsService.returnCurrentSession()

  getAllCustomers() {
    let promise = new Promise((resolve, reject) => {
      this.session=this._FunctionsService.returnCurrentSession();
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
      this.session=this._FunctionsService.returnCurrentSession();
      
      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      console.log(senData)
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        if (!res.err) {
          resolve({type:res.type,link:res.link});
        } else {
          reject({ err: true, msg: res.msg });
        }
      }, (error) => {
        reject({ err: true, msg: error.msg });

      })
    });

  }
}
