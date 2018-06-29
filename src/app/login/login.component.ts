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
  constructor(
    private FunctionsService: FunctionsService,
    private router: Router
  ) { }
  errorUsername: string
  model: any = {};


  ngOnInit() {
  }
  onSubmit(login: NgForm) {

    if (login.valid) {
      let userRes = userList.find(x => x.email === login.value.email)
      let token
      if (userRes) {
        if (login.value.password === userRes.pass) {
          token = 'masmda65282374a'
          document.cookie = 'comprobamos=---' + token + '--' + userRes.numdni + '---;expires=' + this.FunctionsService.generateTime()
          userRes.token = token
          this.FunctionsService.createSessionStorage(userRes)
          setTimeout(() => {
            this.router.navigate(['/Dashboard']);

          }, 1000)
        } else {
          this.passwordincorrect = true
        }

      } else {
        this.dontExist = true
      }
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
}
