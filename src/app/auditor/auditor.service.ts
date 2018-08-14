import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  constructor(private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService) {

  }
  session = this._FunctionsService.returnCurrentSession()

  getAllEditors() {
    let promise = new Promise((resolve, reject) => {
      this.session = this._FunctionsService.returnCurrentSession()
      this._wsSocket.emit('userRolesEvents', { opt: 8, mail: this.session.mail, token:this.session.token }).subscribe(res => {
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
  CreateAuditorUser(data) {
    return new Promise((resolve, reject) => {
      this.session = this._FunctionsService.returnCurrentSession()
      
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
  editUser(data) {
    return new Promise((resolve, reject) => {
      this.session = this._FunctionsService.returnCurrentSession()
      
      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      this._wsSocket.emit('editUserPanel', senData).subscribe((res) => {
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
  RemoveUserAdmin(email) {
    return new Promise((resolve, reject) => {
      this.session = this._FunctionsService.returnCurrentSession()
      
      let senData = {
        emailUser: email,
        mail: this.session.mail,
        token: this.session.token
      }
      this._wsSocket.emit('RemoveUserPanel', senData).subscribe((res) => {
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
