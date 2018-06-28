import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userList, Users } from '../users';
import {FunctionsService} from '../functions.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dontExist = false
  constructor(private FunctionsService:FunctionsService) { }
  errorUsername: string
  model: any = {};


  ngOnInit() {
  }
  onSubmit(login: NgForm) {

    if (login.valid) {
      let userRes = userList.find(x => x.email === login.value.email)
      let token
      if (userRes) {
        token='masmda65282374a'
        document.cookie = 'comprobamos=---'+token+'--'+userRes.numdni+'---;expires='+this.FunctionsService.generateTime()
        userRes.token=token
        this.FunctionsService.createSessionStorage(userRes)
      } else {
        this.dontExist = true
      }
    }
  }


  keyPress(event) {
    if (this.dontExist) {
      console.log('semeteeeee')
      event.target.classList.remove('is-invalid'); // To Remove
      this.dontExist=false
    }
  }
}
