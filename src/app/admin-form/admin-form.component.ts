import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebSocketService } from '../websocket.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  checkedActivoUser: boolean = true;
  modusNewUser: string;
  newUser: NgForm;
  nameUserPhoto;
  fileToUpload: File = null;
  NotEqualsPassword;
  fileImage;
  PowerPassword;
  classPassword;
  passwordinput;
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();
  @Input() rolUser: string;

  constructor(private _FunctionsService: FunctionsService, private _wsSocket: WebSocketService) {

    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false;
    this.checkedActivoUser = true;
    this.modusNewUser = 'Activo';
    this.NotEqualsPassword = false;
    this.fileImage = null;
    this.PowerPassword = null;
    this.classPassword = 'fa-asterisk';
    this.passwordinput = '';
  }

  ngOnInit() {


  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileImage = event.target.files[0];
      this.nameUserPhoto = this.fileImage.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  onSubmitNewUser(newUser: NgForm): void {

    let dataSend = newUser.value;
    dataSend.status = dataSend.status == null ? false : dataSend.status;
    if (newUser.value.password == newUser.value.passwordRepeat) {
      this.nameUserPhoto ? dataSend.imgProfile = this.nameUserPhoto : null;
      dataSend.imageProfileFile = this.fileImage
      var datasendF = {
        type: 'function',
        event: 'SubmitNewUser',
        data: dataSend
      }
      console.log(dataSend,'quejestoo?')
      this.CloseFormtUserAdmin.emit(datasendF)
      newUser.setValue({
        imgProfile:null,
        nombre: null,
        apellido: null,
        emailUser:null,
        status:true,
        password:'',
        passwordRepeat:'',
      });
      this.checkedActivoUser=true;
      this.hrefImageUploaded = 'assets/images/noimage.png';
      this.NotEqualsPassword = false;
      datasendF=null;
      this.nameUserPhoto=null;
      this.fileImage=null;
      
      this.modusNewUser = 'Activo'
    } else {
      this.NotEqualsPassword = true
    }

  }

  changeModusUser() {
    this.modusNewUser === 'Activo' ? this.modusNewUser = 'Inactivo' : this.modusNewUser = 'Activo'
  }
  clearForm() {
    this.hrefImageUploaded = 'assets/images/noimage.png';
    let data = {
      type: 'function',
      event: 'CloseFormAdmins'
    }
    this.CloseFormtUserAdmin.emit(data)
    this.modusNewUser = 'Inactivo'

  }

  ValidatePasswordPower(event: any) {
    if (event.target.value) {
      let statusPass = this._FunctionsService.ValidationSecurityPassword(event.target.value);
      this.PowerPassword = statusPass;
      switch (statusPass) {
        case 'Débil':
          break;
        case 'Aceptable':
          break;
        case 'Fuerte':
          break;
      }
      this.passwordinput = event.target.value;
    } else {

      this.PowerPassword = null;
    }

  }

  validatePasswordRepeat(event: any, password) {
    if (event.target.value != password.value && password.value.length && event.target.value.length) {
      if (password.value.length != 0 && event.target.value.length != 0) {
        this.NotEqualsPassword = true;
      }
    } else {
      this.NotEqualsPassword = false;
    }
  }

  disabledPassErr(): void {
    this.NotEqualsPassword = false;


}
}
