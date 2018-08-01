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
  submittedFormPeople: boolean;
  typeId;
  ExistUser: boolean;
  RoleUser: string;
  urlMainServerPhotos;
  newCustomerPeople = new FormGroup({
    imgProfile: new FormControl(null),
    nombre: new FormControl(null),
    apellido: new FormControl(null),
    mail: new FormControl(null),
    address: new FormControl(null),
    phone: new FormControl(null),
    typeIdentification: new FormControl(null),
    cedula: new FormControl(null),
    checkmodusNew: new FormControl(null),
  });
  newCompanyCustomer = new FormGroup({
    imgProfile: new FormControl(null),
    nombre: new FormControl(null),
    contactPerson: new FormControl(null),
    mail: new FormControl(null),
    address: new FormControl(null),
    phone: new FormControl(null),
    typeIdentification: new FormControl('NIT'),
    cedula: new FormControl(null),
    checkmodusNew: new FormControl(null),
  });
  mask: any[] = ['+57', '', '', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private _location: Location, private cdRef: ChangeDetectorRef, private _CustomersService: CustomersService, private router: Router, private _FunctionsService: FunctionsService) {
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/';
    this.modusNewCustomer = 'Persona'
    this.statusNewCustomer = 'Activo'
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.NotEqualsPassword = false;
    this.checkedActivoUser = false;
    this.submittedFormPeople = false;
    this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    }); this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    });
    this.newCustomerPeople.controls['typeIdentification'].setValue("C.C");
    this.newCompanyCustomer.controls['typeIdentification'].setValue("C.C");
    this.newCompanyCustomer.controls['checkmodusNew'].setValue(true);
    this.newCustomerPeople.controls['checkmodusNew'].setValue(true);
    this.ExistUser = false;
    this.RoleUser = 'NaturalCustomer'

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
  }
  backClicked() {
    this._location.back();
  }
  changeModusUser() {
    this.modusNewCustomer === 'Persona' ? this.modusNewCustomer = 'Empresa' : this.modusNewCustomer = 'Persona'
    if (this.modusNewCustomer != 'Persona') {
      this.submittedFormPeople = false;
      this.statusNewCustomer = 'Activo'
      this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
      this.newCustomerPeople.controls['checkmodusNew'].setValue(true);
      this.newCustomerPeople.controls['nombre'].setValue(null);
      this.newCustomerPeople.controls['apellido'].setValue(null);
      this.newCustomerPeople.controls['mail'].setValue(null);
      this.newCustomerPeople.controls['address'].setValue(null);
      this.newCustomerPeople.controls['phone'].setValue(null);
      this.newCustomerPeople.controls['cedula'].setValue(null);
      this.newCustomerPeople.controls['imgProfile'].setValue(null);
    } else {
      this.newCompanyCustomer.controls['typeIdentification'].setValue("CC");
      this.newCompanyCustomer.controls['checkmodusNew'].setValue(true);
      this.newCompanyCustomer.controls['nombre'].setValue(null);
      this.newCompanyCustomer.controls['contactPerson'].setValue(null);
      this.newCompanyCustomer.controls['mail'].setValue(null);
      this.newCompanyCustomer.controls['address'].setValue(null);
      this.newCompanyCustomer.controls['phone'].setValue(null);
      this.newCompanyCustomer.controls['cedula'].setValue(null);
      this.newCompanyCustomer.controls['imgProfile'].setValue(null);
      this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
      this.submittedFormPeople = false;
      this.statusNewCustomer = 'Activo';
      this.newCompanyCustomer.controls['checkmodusNew'].setValue(true);

    }
  }
  changeStatusCustomer() {
    this.statusNewCustomer === 'Activo' ? this.statusNewCustomer = 'Inactivo' : this.statusNewCustomer = 'Activo'
  }
  onSubmitNewCustomerPeople(data: NgForm) {
    this.submittedFormPeople = true;
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
      this.nameUserPhoto = file.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
}
