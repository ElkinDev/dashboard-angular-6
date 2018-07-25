import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CommercialsService {

  //guias de uso faber para uso de API en comerciales

  // // get all users comercials
  // socket.emit('userRolesEvents', {
  //  opt:4,
  //  mail: 'sonickfaber7@yahoo.es',
  //  token: '96f0279ac90a57fd8df19e7a'
  // }, resp=>{
  //  console.log(resp)
  // })

  // // edit users comercials
  // socket.emit('userRolesEvents', {
  //  opt: 5,
  //  mail: 'sonickfaber7@yahoo.es',
  //  token: '96f0279ac90a57fd8df19e7a',
  //  userEdit:{
  //    nombre: 'Sonia María',
  //    apellido: 'Mendoza Urrea',
  //    mail: 'sonickfaber6@gmail.com',
  //    id: '224b52a1-6bb3-4534-af0a-bc6ec2f95ac6'
  //  }
  // }, resp=>{
  //  console.log(resp)
  // })

  // //delete users comercial
  // socket.emit('userRolesEvents', {
  //  opt:6,
  //  mail: 'sonickfaber7@yahoo.es',
  //  token: '96f0279ac90a57fd8df19e7a',
  //  userDel:{
  //    mail: 'sonickfaber6@gmail.com',
  //    id: '224b52a1-6bb3-4534-af0a-bc6ec2f95ac6'
  //  }
  // }, resp=>{
  //  console.log(resp)
  // })

  // //add new user comercial
  // socket.emit('userRolesEvents', {
  //  nombre: 'Faber Torres',
  //  apellido: 'Urrego',
  //  emailUser: 'sonickfaber6@gmail.com',
  //  password: 'SSl123456',
  //  passwordRepeat: 'SSl123456',
  //  status: true,
  //  opt:7,
  //  mail: 'sonickfaber7@yahoo.es',
  //  token: '96f0279ac90a57fd8df19e7a'
  // }, resp=>{
  //  console.log(resp)
  // })

  constructor(private _wsSocket: WebSocketService) { }
  session = {
    mail: 'elkinmendoza00@gmail.com',
    token: 'asdasdasdasdasdasd'
  }
  getAllCommercials() {
    let promise = new Promise((resolve, reject) => {
      let data = {
        mail: 'elkinmendoza00@gmail.com'
      }
      this._wsSocket.emit('getAllCommercials', data).subscribe(res => {
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
  CreateSellerUser(data) {
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
  RemoveUserAdmin(email) {
    return new Promise((resolve, reject) => {
      let senData = {
        emailUser:email,
        mail:this.session.mail,
        token:this.session.token
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
