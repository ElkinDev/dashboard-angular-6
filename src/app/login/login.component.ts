import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userList, Users } from '../users';
import { FunctionsService } from '../functions.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dontExist: boolean = false
  passwordincorrect: boolean = false
  msgError;
  sessionActive;
  loadingMore: boolean

  constructor(private _FunctionsService: FunctionsService, private router: Router) {
    this.msgError = null;
    this.sessionActive = false;
    this.loadingMore = true;
  }
  errorUsername: string
  model: any = {};


  ngOnInit() {
    this._FunctionsService.getSessionStorage().then(res => {
      if (res == null || res == '') {
        this.loadingMore = false;

      } else {
        this.checkSession(res)
      }
    }, err => {

    })
  }
  onSubmit(login: NgForm) {
    this.loadingMore = true;

    this.msgError = null;
    this.passwordincorrect, this.dontExist = false;

    let sendData = {
      opt: 0,
      mail: login.value.email,
      psw: login.value.password
    };
    if (login.valid) {

      this._FunctionsService.logInLogOutDashboar(sendData).then(data => {
        let dataResponse: any = data;
        if (dataResponse.err) {
          if (dataResponse.type == 'noUserPass') {
            this.passwordincorrect = true
          } else {
            this.dontExist = true
            this.msgError = dataResponse.msg
          }

          this.loadingMore = false;

        } else {
          if (dataResponse.res) {

            this._FunctionsService.createSessionStorage({ token: dataResponse.token, name: dataResponse.name, role: dataResponse.role, mail: login.value.email }).then(resp => {
              let resp1: any = resp
              if (!resp1.err) {
                setTimeout(() => {
                  this.router.navigate(['/Dashboard']);

                }, 1000)
              }
            })
          } else {
            this.dontExist = true
            this.msgError = 'Error inesperado - intente nuevamente.';
            this.loadingMore = false;

          }
        }
      }, err => {

      })





    }
  }


  removeErrors(event, ele) {
    event.target.classList.remove('is-invalid'); // To Remove class child object
    switch (ele) {
      case 'username':
        this.dontExist = false
        break
      case 'password':
        this.passwordincorrect = false
        break
    }

  }

  checkSession(data) {
    let getSession = JSON.parse(data)

    let senData = {
      opt: 2,
      mail: getSession.mail,
      token: getSession.token
    }
    this._FunctionsService.logInLogOutDashboar(senData).then(data => {
      let responseData: any = data;
      if (responseData.err) {
        this.loadingMore = false;

      } else {
        if (!responseData.res) {
          this.loadingMore = false;


        } else {
          if (this.router.url === '/login') {
            this.router.navigate(['/Dashboard']);

          }
          this.sessionActive = true;
        }
      }

    })
  }
}
