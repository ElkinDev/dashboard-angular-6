import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Injectable()

export class adminsService {
  constructor(private _wsSocket: WebSocketService) {

  }
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: '96f0279ac90a57fd8df19e7a'
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

      this._wsSocket.emit('userRolesEvents', {opt:0,mail:'sonickfaber7@yahoo.es',token:'96f0279ac90a57fd8df19e7a'}).subscribe((res) => {
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
      // // forma de enviar imagen cuando forma JAVACRIPT
      // if(window.FormData){
      //   var formdata=new FormData();
      //   if(formdata){
      //     formdata.append('imgProfile', main.data.fileTest)
      //     formdata.append('id', 'b764ad29-0e75-49aa-a247-fd4077298d7e')
      //     formdata.append('mail', 'sonickfaber7@yahoo.es')
      //     // formdata.append('mail', 'sonickfaber7@yahoo.is')
      //     formdata.append('token', '96f0279ac90a57fd8df19e7a')
      //     main.logic.ajaxHttpRequest(formdata, main.logic.progress, resp=>{
      //       console.log(resp)
      //     })
      //   }
      // }else
      //   alert('Tu explorador es muy viejo, por favor usa uno mas actualizado')


      let senData = {
        opt:1,
        mail:this.session.mail,
        token:this.session.token,
        userDel:data
      } 
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
