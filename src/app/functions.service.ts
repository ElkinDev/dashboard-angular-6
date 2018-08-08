import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { WebSocketService } from './websocket.service';
import { environment } from '../environments/environment';
import { environmentProd } from '../environments/environment.prod';
@Injectable()

export class FunctionsService {

  constructor(private _wsSocket: WebSocketService) { }
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: 'edbee4f4050c98ad293df52d'
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
      senData.mail=this.session.mail;
      senData.token=this.session.token;
      console.log('Veaamos que trae la senData',senData);
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        console.log('traeme toda esta shit',res);
        if (!res.err) {
          resolve({type:res.type,msg:res.msg})
        } else {
          resolve({err:true,type:res.type,msg:res.msg})
          
        }
      }, (error) => {
        reject({ err: true, msg: error.msg, type:error.type })

      })
    });
  }
  RemoveUser(email,id,opt) {
    return new Promise((resolve, reject) => {
      let senData = {
        opt:opt,
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
  ajaxHttpRequest(datos, prog, cb) {
    let oReq = new XMLHttpRequest()
    oReq.upload.addEventListener('progress', prog, false);
    oReq.open('POST', environment.ws_url + `/upDashBoardImg`, true);
    oReq.onreadystatechange = function (yy) {
      if (this.readyState === 4) {
        cb(this.responseText)
      }
    }
    oReq.send(datos);
  }

  ValidationSecurityPassword(value){
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

   
        if(strongRegex.test(value)) {
          return 'Fuerte';
        } else if(mediumRegex.test(value)) {
          return 'Aceptable';
        } else {
          return 'Débil';
          
        }

  }
}
