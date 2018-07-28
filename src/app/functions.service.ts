import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { WebSocketService } from './websocket.service';

@Injectable()

export class FunctionsService {

  constructor(private _wsSocket: WebSocketService) { }
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: '96f0279ac90a57fd8df19e7a'
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
  CreateUser(data,opt) {
    return new Promise((resolve, reject) => {

      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      senData.opt = opt
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        if (!res.err) {
          resolve({msg:res.msg,link:res.link,type:res.type})
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
  RemoveUser(email) {
    return new Promise((resolve, reject) => {
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
  getAllDocumentsType() {
    return new Promise((resolve, reject) => {
      let ar = [
        { name: 'CE', description: 'Cedula de Extranjeria' },
        { name: 'TI', description: 'Tarjeta de Identidad' },
        { name: 'CC', description: 'Cedula de Ciudadanía' },

      ]
      resolve(ar)
    });
  }
}
