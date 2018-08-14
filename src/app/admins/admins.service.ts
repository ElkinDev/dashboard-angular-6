import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service';

@Injectable()

export class adminsService {
  session;
  
  constructor(private _wsSocket: WebSocketService, private _FunctionsService: FunctionsService) {
    this.session = this._FunctionsService.returnCurrentSession()

  }
  getAllAdmins() {
    let promise = new Promise((resolve, reject) => {
      this.session = this._FunctionsService.returnCurrentSession()
      this._wsSocket.emit('userRolesEvents', {opt:0,mail:this.session.mail,token:this.session.token}).subscribe((res) => {
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
      this.session = this._FunctionsService.returnCurrentSession()
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
      this.session = this._FunctionsService.returnCurrentSession()   
      let senData = {
        opt:1,
        mail:this.session.mail,
        token:this.session.token,
        userEdit:data
      }

      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
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
    this.session = this._FunctionsService.returnCurrentSession()    
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
