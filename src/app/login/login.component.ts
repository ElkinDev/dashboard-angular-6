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
  constructor(
    private _FunctionsService: FunctionsService,
    private router: Router
  ) {
    this.msgError=null;
    
   }
  errorUsername: string
  model: any = {};


  ngOnInit() {
  }
  onSubmit(login: NgForm) {
    this.msgError=null;
    let sendData={
      opt:0,
      mail:login.value.email,
      psw:login.value.password
    };
    if (login.valid) {
    console.log('entraaaaaaaaaaa');
      
    this._FunctionsService.logInLogOutDashboar(sendData).then(data => {
      let dataResponse:any=data;
      if(dataResponse.err){
        this.dontExist = true
        this.msgError=dataResponse.msg
        
      }else{
        if (dataResponse.res){
          this._FunctionsService.createSessionStorage({token:dataResponse.token,name:dataResponse.name,role:dataResponse.role}).then(resp => {
            let resp1:any=resp
            if(!resp1.err){
              setTimeout(() => {
                this.router.navigate(['/Dashboard']);
    
              }, 1000)
            }
          })
        }else{
          this.dontExist = true
        this.msgError= 'Error inesperado - intente nuevamente.';
        }
      }

    },err=>{

    })
        
       
          // this.passwordincorrect = true
        

      
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
