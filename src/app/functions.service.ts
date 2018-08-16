import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { WebSocketService } from './websocket.service';
import { environment } from '../environments/environment';
import { environmentProd } from '../environments/environment.prod';
@Injectable()

export class FunctionsService {
  session;
  constructor(private _wsSocket: WebSocketService) {
    this.session = this.returnCurrentSession()
  }


  generateTime() {
    var now = new Date(), time = now.getTime(),
      expireTime = time + 1000 * 36000000
    now.setTime(expireTime)
    return now.toUTCString()

  }

  SpanishLanguageDatatable(){
    return new Promise((resolve, reject) => {
      resolve({
        emptyTable:'No hay Datos',
        info:'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
        infoEmpty:'Mostrando registros del 0 al 0 de un total de 0 registros',
        infoFiltered:'(filtrado de un total de _MAX_ registros)',
        infoPostFix:    '',
        thousands:',',
        lengthMenu:'Mostrar _MENU_ registros',
        loadingRecords:'Cargando...',
        processing:'Procesando...',
        search:'Buscar:',
        zeroRecords:'No se encontraron resultados',
        paginate:{
          first:'Primero',
          last:'Último',
          next:'Siguiente',
          previous:'Anterior'
        },
        aria:{
          sortAscending:'Activar para ordenar la columna de manera ascendente',
          sortDescending:'Activar para ordenar la columna de manera descendente'
        }
  
      })
    })    
    
  }

  CreateUser(data, opt) {
    return new Promise((resolve, reject) => {
      this.session = this.returnCurrentSession()

      let senData = data;
      senData.mail = this.session.mail
      senData.token = this.session.token
      senData.opt = opt

      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        if (!res.err) {
          resolve({ msg: res.msg, link: res.link, type: res.type })
        } else {
          reject(res.msg)
        }
      }, (error) => {
        reject({ err: true, msg: error.msg })

      })
    });

  }
  checkSession(data) {
    return new Promise((resolve, reject) => {

      this._wsSocket.emit('logInLogOutDashboar', data).subscribe((res) => {
      }, (error) => {

      })
    });
  }
  editUser(data) {
    this.session = this.returnCurrentSession()
    return new Promise((resolve, reject) => {
      let senData = data;
      senData.mail = this.session.mail;
      senData.token = this.session.token;
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        if (!res.err) {
          resolve({ type: res.type, msg: res.msg })
        } else {
          resolve({ err: true, type: res.type, msg: res.msg })

        }
      }, (error) => {
        reject({ err: true, msg: error.msg, type: error.type })

      })
    });
  }
  RemoveUser(email, id, opt) {
    this.session = this.returnCurrentSession()
    return new Promise((resolve, reject) => {
      let senData = {
        opt: opt,
        mail: this.session.mail,
        token: this.session.token,
        userDel: {
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

  ValidationSecurityPassword(value) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


    if (strongRegex.test(value)) {
      return 'Fuerte';
    } else if (mediumRegex.test(value)) {
      return 'Aceptable';
    } else {
      return 'Débil';

    }

  }

  logInLogOutDashboar(data) {
    return new Promise((resolve, reject) => {
      this._wsSocket.emit('logInLogOutDashboar', data).subscribe((res) => {
        if (res.err) {
          resolve({ err: true, msg: res.msg, type: res.type });
        } else {
          resolve({ res: true, msg: res.msg, name: res.name, token: res.token, role: res.role });

        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }

  createSessionStorage(data) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('currentUser', JSON.stringify(data))
      resolve({ err: false })


    });

  }
  getSessionStorage() {
    return new Promise((resolve, reject) => {

      resolve(localStorage.getItem('currentUser'))


    });
  }
  returnCurrentSession() {
    if (localStorage.getItem('currentUser') != "") {
      let session = JSON.parse(localStorage.getItem('currentUser'));
      return { mail: session.mail, token: session.token }
    } else {
      return {}

    }

  }
  clearSessionStorage() {
    return new Promise((resolve, reject) => {
      localStorage.setItem('currentUser', '')
      resolve({ err: false })


    });
  }

  closeSessionUser(data) {
    return new Promise((resolve, reject) => {
      this._wsSocket.emit('logInLogOutDashboar', data).subscribe((res) => {
        if (!res.err) {
          this.clearSessionStorage().then(res1 => {
            resolve({ err: false, msg: res.msg })

          })
        } else {
          resolve({ err: true, msg: 'No se puede cerrar la sesión. inténtelo más tarde.' })

        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }

  //Get All item Menu Left Bar

  ListItemsMenuLeft(){
    return new Promise((resolve, reject) => {
      let data={
        mail:this.session.mail,
        token:this.session.token
      }
      console.log('uhhiuhui',data);
      this._wsSocket.emit('userRoles', data).subscribe((res) => {
        resolve({roles:res.roles,customers:res.customers})
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }

}
