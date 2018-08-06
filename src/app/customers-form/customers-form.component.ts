import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
  RoleUser: string;
  urlMainServerPhotos;
  fileImageEdit;
  PowerPassword;
  passwordinput;
  newCustomerPeople: NgForm;
  newCompanyCustomer: NgForm;
  mask: any[] = ['+57', '', '', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private _location: Location, private cdRef: ChangeDetectorRef, private _CustomersService: CustomersService, private router: Router, private _FunctionsService: FunctionsService) {
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
    this.RoleUser = 'NaturalCustomer'
    this.fileImageEdit = null;
    this.PowerPassword = null;
    this.passwordinput = '';

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
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
      console.log(newCompanyCustomer.value)


    }
  }
  changeStatusCustomer() {
    this.statusNewCustomer === 'Activo' ? this.statusNewCustomer = 'Inactivo' : this.statusNewCustomer = 'Activo'
  }
  onSubmitNewCustomerPeople(data: NgForm) {
    if (data.valid) {
      let senData = data.value;
      senData.RoleUser = this.RoleUser;
      if (data.value.imgProfile) {
        senData.imgProfile = this.urlMainServer + this.nameUserPhoto
      }
      this._CustomersService.createCustomer(senData).then(res => {

        alertify.success(res);
        setTimeout(() => {
          this.router.navigate(['/Dashboard/customers'])

        }, 3000)
      }, err => {
        alertify.error(err);
      })
    } else {

    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.fileImageEdit = event.target.files[0];
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
      console.log('que es veamoslooo?', statusPass)
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
      console.log('se meteee');

      this.PowerPassword = null;
    }

  }

  validatePasswordRepeat(event: any, password) {
    if (event.target.value != password.value) {
      this.NotEqualsPassword = true;
    } else {
      this.NotEqualsPassword = false;
    }
    console.log('veamos el pass escrito', password);
  }

  disabledPassErr(): void {
    this.NotEqualsPassword = false;

  }
}
