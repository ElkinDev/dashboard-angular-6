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

  SpanishLanguageDatatable() {
    return new Promise((resolve, reject) => {
      resolve({
        emptyTable: 'No hay Datos',
        info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
        infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
        infoFiltered: '(filtrado de un total de _MAX_ registros)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ registros',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Buscar:',
        zeroRecords: 'No se encontraron resultados',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        },
        aria: {
          sortAscending: 'Activar para ordenar la columna de manera ascendente',
          sortDescending: 'Activar para ordenar la columna de manera descendente'
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

  httpGet(theUrl, cb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        // console.log(xmlHttp.responseText,'listooo?')
        cb(xmlHttp.responseText);

      }
    }
    xmlHttp.open("GET", theUrl, false); // true for asynchronous 
    xmlHttp.send(null);

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
    if (localStorage.getItem('currentUser') != "" && localStorage.getItem('currentUser') != null) {
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

  ListItemsMenuLeft() {
    return new Promise((resolve, reject) => {
      let data = {
        mail: this.session.mail,
        token: this.session.token
      }
      this._wsSocket.emit('userRoles', data).subscribe((res) => {
        resolve({ roles: res.roles, customers: res.customers })
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }

  getPlans() {
    return new Promise((resolve, reject) => {
      let data = [{
        colors: ['#689a2e', '#83b834', '#91bf53', '#b1cf77'],
        id: 'planMiPersona',
        class: 'plan-mi-personal',
        icon: '../assets/images/icon-personal.png',
        logo: '../assets/images/mi-personal.png',
        title: 'Mi personal de confianza',
        description: [
          '¿Qué tan seguro estas del personal que apoya a tu familia en casa todos los días?',
          'Este plan comprueba la información de las personas que te ayudan en las actividades diarias, como personal de servicio, conductor, cuidado de los niños y en general toda persona a la que le depositas tu confianza.',
          '¡Una manera simple y rápida de conocer a quienes están a tu lado!'

        ]
      }, {
        colors: ['#e09231', '#ef9c34', '#f4b04e', '#fbcf53'],
        class: 'plan-mi-negocio',
        id: 'planMinegocio',
        icon: '../assets/images/icon-negocio.png',
        logo: '../assets/images/mi-negocio.png',
        title: 'Mi negocio de confianza',
        description: [
          '¿Sabes con quien vas a realizar tu próximo proyecto, quien es tu proveedor, quien será tu socio?',
          'Comprueba la identidad de tu contacto, si tiene requerimientos ante la policía, si tiene antecedentes judiciales, demandas por estafa o de cualquier tipo o si se encuentra vinculado a alguna lista restrictiva nacional o internacional.',
          '¡Evita estafas y negocia tranquilo, en solo unos minutos desde cualquier dispositivo al alcance de tus manos !'
        ],

      }, {
        id: 'planCorporativo',
        colors: ['#1a5ca5', '#226aaf', '#226aaf', '#226aaf'],
        class: 'plan-corporativo',
        icon: '../assets/images/icon-corporativo.png',
        logo: '../assets/images/mi-personal-corporativo.png',
        title: 'Contratación de personal',
        description: [
          ' El éxito de tu compañía depende de la fiabilidad de tus colaboradores',
          'COMPROBAMOS.COM te brinda información de manera inmediata que te permitirá tomar la decisión acertada al momento de contratar nuevo personal para tu organización. De igual forma acá encontraras planes a la medida de tus necesidades.',
          '¡Comprueba antes de tomar tu decisión!'
        ]
      }]
      resolve(data);
    })
  }

  getAllDepartaments() {
    return new Promise((resolve, reject) => {
      let data = {
        opt: 3,
        text: 'dasjo'
      }
      this._wsSocket.emit('locations', data).subscribe((res) => {
        if (!res.err) {
          resolve({ states: res.states })
        } else {
          resolve({ err: true })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }
  getSpecificRegions(departament) {
    return new Promise((resolve, reject) => {
      let data = {
        opt: 4,
        text: departament.trim()
      }
      this._wsSocket.emit('locations', data).subscribe((res) => {
        if (!res.err) {
          resolve({ cities: res.cities })
        } else {
          resolve({ err: true })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }


  //CUSTOMER
  //Get info user cliente with DNI
  getallInvoices(dataSend) {
    this.session = this.returnCurrentSession()
    return new Promise((resolve, reject) => {
      var data;
      data = {
        opt: 8,
        mail: this.session.mail,
        token: this.session.token,
        company: {
          mail: dataSend.mail
        }
      }
      console.log('que seee enviaaa??', data)
      this._wsSocket.emit('changeUserBalance', data).subscribe((res) => {

        if (!res.err) {
          if (res.pays.length > 0) {
            resolve({ pays: res.pays })

          } else {
            resolve({ pays: null })

          }

        } else {
          resolve({ err: true, msg: res.msg })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });
  }
  getInfoUser(numId) {
    this.session = this.returnCurrentSession()

    return new Promise((resolve, reject) => {
      let data = {
        opt: 0,
        mail: this.session.mail,
        token: this.session.token,
        identification: numId
      }
      this._wsSocket.emit('getInfo', data).subscribe((res) => {
        console.log(res,'vesamosasdas queee?',res);
        if (!res.err) {
          resolve({ nombre: res.user.nombre + ' ' + res.user.apellido, direccion: res.user.address, typeIdentification: res.user.typeIdentification, cedula: res.user.cedula, mail: res.user.mail,id:res.user.id })
        } else {
          resolve({ err: true, msg: res.msg })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    });

  }

  newBalanceCustomer(data) {
    var dataSend: any = data
    return new Promise((resolve, reject) => {

      this.session = this.returnCurrentSession()
      dataSend.mail = this.session.mail;
      dataSend.token = this.session.token;
      this._wsSocket.emit('changeUserBalance', dataSend).subscribe((res) => {
        resolve({})
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    })
  }

  getAllUsersEmployedCompany(email) {
    this.session = this.returnCurrentSession()

    return new Promise((resolve, reject) => {
      let senData = {
        opt: 20,
        mail: this.session.mail,
        token: this.session.token,
        company: {
          mail: email
        }
      }
      this._wsSocket.emit('userRolesEvents', senData).subscribe((res) => {
        if (res.err) {
          resolve({ err: true, msg: res.msg, type: res.type })
        } else {
          resolve({ users: res.users })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    })
  }
  getBalancesfromCustomer(email) {
    return new Promise((resolve, reject) => {
      let senData = {
        opt: 9,
        mail: this.session.mail,
        token: this.session.token,
        company: {
          mail: email
        }
      }
      this._wsSocket.emit('changeUserBalance', senData).subscribe((res) => {
        if (res.err) {
          resolve({ err: true, msg: res.msg, type: res.type })
        } else {
          resolve({ plans: res.data })
        }
      }, (error) => {
        reject({ err: true, msg: 'Error Inesperado' })

      })
    })
  }
}
