import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable()

export class adminsService {
  constructor(private _wsSocket: WebSocketService) {

  }
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: 'edbee4f4050c98ad293df52d'
  }
  getAllAdmins() {
    let promise = new Promise((resolve, reject) => {

      // socket.emit('userRolesEvents', {
      //   opt:0,
      //   mail: 'sonickfaber7@yahoo.es',
      //   token: '96f0279ac90a57fd8df19e7a'
      // }, resp=>{
      //   console.log(resp)
      // })

      this._wsSocket.emit('userRolesEvents', {opt:0,mail:'sonickfaber7@yahoo.es',token:'edbee4f4050c98ad293df52d'}).subscribe((res) => {
        console.log(res, 'FT iopuhsergsergh')
        if (!res.err) {
          if (res.data.length) {
            resolve(res.data)
          } else {
            resolve(null)
          }
        } else {
          reject({ err: true, msg: res.msg })
        }
      }, (error) => {
        reject({ err: true, msg: error.msg })


      })
    });
    return promise;

  }

  CreateUserAdmin(data) {
    return new Promise((resolve, reject) => {

      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      senData.opt = 3
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        console.log('llegaaaa', res)
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
   
      let senData = {
        opt:1,
        mail:this.session.mail,
        token:this.session.token,
        userEdit:data
      }

      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        console.log('traeme toda esta shit',res);
        if (!res.err) {
          resolve({type:res.type,msg:res.msg})
        } else {
          resolve({type:res.type,msg:res.msg})
          
        }
      }, (error) => {
        reject({ err: true, msg: error.msg, type:error.type })

      })
    });
  }
  RemoveUserAdmin(email,id) {
    return new Promise((resolve, reject) => {
      let senData = {
        opt:2,
        mail:this.session.mail,
        token:this.session.token,
        userDel:{
          mail: email,
          id: id
        }
      } 

      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        console.log(res)
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
