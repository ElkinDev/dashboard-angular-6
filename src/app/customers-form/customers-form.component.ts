import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import {CustomersService} from '../customers-people/customers-service.service';
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
  RoleUser:string;
  newCustomerPeople = new FormGroup({
    imageProfile: new FormControl(null),
    nombre: new FormControl(null),
    apellido: new FormControl(null),
    mailUser: new FormControl(null),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    TipoIdentificacion: new FormControl(null),
    numeroIdentificacion: new FormControl(null),
    checkmodusNew: new FormControl(null),
  });
  newCompanyCustomer = new FormGroup({
    imageProfile: new FormControl(null),
    nombre: new FormControl(null),
    nombreContacto: new FormControl(null),
    mailUser: new FormControl(null),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    TipoIdentificacion: new FormControl('NIT'),
    numeroIdentificacion: new FormControl(null),
    checkmodusNew: new FormControl(null),
  });
  constructor(private _location: Location, private cdRef: ChangeDetectorRef,private _CustomersService:CustomersService,private router: Router) {
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.modusNewCustomer = 'Persona'
    this.statusNewCustomer = 'Activo'
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.NotEqualsPassword = false;
    this.checkedActivoUser = false;
    this.submittedFormPeople = false;
    this.typeId = [
      { name: 'CE', description: 'Cedula de Extranjeria' },
      { name: 'TI', description: 'Tarjeta de Identidad' },
      { name: 'CC', description: 'Cedula de Ciudadanía' },

    ]
    this.newCustomerPeople.controls['TipoIdentificacion'].setValue("CC");
    this.newCompanyCustomer.controls['TipoIdentificacion'].setValue("CC");
    this.newCompanyCustomer.controls['checkmodusNew'].setValue(true);
    this.newCustomerPeople.controls['checkmodusNew'].setValue(true);
    this.ExistUser = false;
    this.RoleUser='NaturalCustomer'

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
      this.newCustomerPeople.controls['mailUser'].setValue(null);
      this.newCustomerPeople.controls['direccion'].setValue(null);
      this.newCustomerPeople.controls['telefono'].setValue(null);
      this.newCustomerPeople.controls['numeroIdentificacion'].setValue(null);
      this.newCustomerPeople.controls['imageProfile'].setValue(null);
    }else{
      this.newCompanyCustomer.controls['TipoIdentificacion'].setValue("CC");
      this.newCompanyCustomer.controls['checkmodusNew'].setValue(true);
      this.newCompanyCustomer.controls['nombre'].setValue(null);
      this.newCompanyCustomer.controls['nombreContacto'].setValue(null);
      this.newCompanyCustomer.controls['mailUser'].setValue(null);
      this.newCompanyCustomer.controls['direccion'].setValue(null);
      this.newCompanyCustomer.controls['telefono'].setValue(null);
      this.newCompanyCustomer.controls['numeroIdentificacion'].setValue(null);
      this.newCompanyCustomer.controls['imageProfile'].setValue(null);
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
      senData.RoleUser =this.RoleUser;
      if (data.value.imageProfile) {
        senData.imageProfile = this.urlMainServer + this.nameUserPhoto
      }
      this._CustomersService.createCustomer(senData).then(res => {
        
        alertify.success(res);
        setTimeout(()=>{
          this.router.navigate(['/Dashboard/customers'])

        },3000)
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
