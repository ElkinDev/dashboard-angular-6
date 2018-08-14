import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { WebSocketService } from '../websocket.service';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { CustomersService } from '../customers-people/customers-service.service';
import { FunctionsService } from '../functions.service'

declare let alertify: any;
@Component({
  selector: 'app-customers-form',
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.css']
})
export class CustomersFormComponent implements OnInit {
  checkedActivoUser: boolean;
  modusNewCustomer: string;
  statusNewCustomer: String;
  hrefImageUploaded: string;
  NotEqualsPassword: boolean;
  nameUserPhoto;
  fileToUpload: File = null;
  urlMainServer;
  typeId;
  ExistUser: boolean;
  urlMainServerPhotos;
  PowerPassword;
  passwordinput;
  newCustomerPeople: NgForm;
  newCompanyCustomer: NgForm;
  mask: any[] = ['+57', '', '', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  senData;
  sendImage;
  session;
  roleUser;
  constructor(private _location: Location, private cdRef: ChangeDetectorRef, private _CustomersService: CustomersService, private router: Router, private _FunctionsService: FunctionsService, private _wsSocket: WebSocketService) {
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/'
    this.modusNewCustomer = 'Persona'
    this.statusNewCustomer = 'Activo'
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.NotEqualsPassword = false;
    this.checkedActivoUser = true;
    this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    }); this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    });
    this.ExistUser = false;
    this.senData, this.PowerPassword = null, this.sendImage = null;
    this.passwordinput = '';
    this.roleUser='customer';
    this.session=this._FunctionsService.returnCurrentSession()

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {

    this._wsSocket.on('createUser:' + this.roleUser).subscribe((res) => {
      if (res.mail.match(new RegExp(this.senData.emailUser, 'gi'))) {      
        var formdata = new FormData();
        if (formdata && this.sendImage != null) {
          formdata.append('imgProfile', this.sendImage)
          formdata.append('id', res.id)
          if (this.senData.typeIdentification) {
            formdata.append('opt', '4')
          } else {
            formdata.append('opt', '3');
          }
          formdata.append('mail', this.session.mail)
          formdata.append('token', this.session.token)
          this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
            let resp1 = JSON.parse(resp);
            this.router.navigate(['/Dashboard/customers'])




          });
        } else {
          this.router.navigate(['/Dashboard/customers'])



        }
      }

    }, (error) => {

    })
  }
  backClicked() {
    this._location.back();
  }
  changeModusUser(newCustomerPeople: NgForm, newCompanyCustomer: NgForm) {

    this.PowerPassword = null;
    this.NotEqualsPassword = false;
    this.statusNewCustomer = 'Activo'
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.modusNewCustomer === 'Persona' ? this.modusNewCustomer = 'Empresa' : this.modusNewCustomer = 'Persona'
    this.sendImage = null;
    if (this.modusNewCustomer != 'Persona') {
      newCustomerPeople.setValue({
        nombre: null,
        imgProfile: null,
        apellido: null,
        address: null,
        phone: null,
        typeIdentification: 'CC',
        cedula: null,
        mail: null,
        password: '',
        passwordRepeat: '',
        checkmodusNew: true

      }); // or form.reset();

    } else {
      newCompanyCustomer.setValue({
        nombre: null,
        imgProfile: null,
        address: null,
        phone: null,
        cedula: null,
        mail: null,
        password1: '',
        passwordRepeat1: '',
        checkmodusNew: true,
        contactPerson: null,

      }); // or form.reset();
      console.log(newCompanyCustomer.value)


    }
  }
  changeStatusCustomer() {
    this.statusNewCustomer === 'Activo' ? this.statusNewCustomer = 'Inactivo' : this.statusNewCustomer = 'Activo'
  }
  onSubmitNewCustomerPeople(data: NgForm) {
    let resd: any = null;

    console.log(data.value);
    if (data.valid) {
      if (data.value.password1 != data.value.passwordRepeat1) {
        this.NotEqualsPassword = true;
      } else {
        let senData = {
          nit: data.value.cedula,
          nombre: data.value.nombre,
          apellido: data.value.apellido,
          emailUser: data.value.mail,
          address: data.value.address,
          password: data.value.password,
          passwordRepeat: data.value.passwordRepeat,
          typeIdentification: data.value.typeIdentification,
          status: data.value.checkmodusNew,
          opt: 16,
          phone: data.value.phone
        }
        this.senData = senData;
        this._CustomersService.createCustomer(this.senData).then(res => {
          resd = res;
          if (resd.type == 'createdUserNew') {
            alertify.alert("Confirma el registro de usuario", function () {
              window.open(resd.link, "_blank")

            });
          }
        }, err => {
          alertify.error(err.msg)
        })

        this._wsSocket.on('createUser').subscribe((res) => {
          if (res.mail === this.senData.emailUser) {

            var formdata = new FormData();
            if (formdata && this.sendImage != null) {
              formdata.append('imgProfile', this.sendImage)
              formdata.append('id', res.id)
              formdata.append('opt', '4')
              formdata.append('mail', this.session.mail)
              formdata.append('token', this.session.token)
              this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
                let resp1 = JSON.parse(resp);
                console.log('vieneee que es resp', resp1)
                this.router.navigate(['/Dashboard/customers'])




              });
            } else {
              this.router.navigate(['/Dashboard/customers'])



            }
          }

        }, (error) => {

        })


      }
    } else {

    }
  }

  onSubmitNewCustomerCompany(data: NgForm) {
    let resd: any = null;

    console.log(data.value);
    if (data.valid) {
      if (data.value.password1 != data.value.passwordRepeat1) {
        this.NotEqualsPassword = true;
      } else {
        let senData = {
          nit: data.value.cedula,
          nombre: data.value.nombre,
          emailUser: data.value.mail,
          address: data.value.address,
          password: data.value.password1,
          passwordRepeat: data.value.passwordRepeat1,
          status: data.value.checkmodusNew,
          contactPerson: data.value.contactPerson,
          opt: 12,
          phone: data.value.phone
        }
        this.senData = senData;
        console.log('traeme toda la data del submit', data);
        this._CustomersService.createCustomer(this.senData).then(res => {
          resd = res;
          if (resd.type == 'createdUserNew') {
            alertify.alert("Confirma el registro de usuario", function () {
              window.open(resd.link, "_blank")

            });
          }
        }, err => {
          alertify.error(err.msg)
        })

        this._wsSocket.on('createUser').subscribe((res) => {
          if (res.mail === this.senData.emailUser) {

            var formdata = new FormData();
            if (formdata && this.sendImage != null) {
              console.log(this.sendImage, 'VEAAMOS QUE LO QUE');
              formdata.append('imgProfile', this.sendImage)
              formdata.append('id', res.id)
              formdata.append('opt', '3')
              formdata.append('mail', this.session.mail)
              formdata.append('token', this.session.token)
              this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
                let resp1 = JSON.parse(resp);
                this.router.navigate(['/Dashboard/customers'])




              });
            } else {
              this.router.navigate(['/Dashboard/customers'])



            }
          }

        }, (error) => {

        })


      }
    } else {

    }
  }
  progressImage(ev) {
    // console.log('veaa veaa veaa',ev)
  }
  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.sendImage = event.target.files[0];
      this.nameUserPhoto = file.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
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
    if (event.target.value != password.value) {
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
