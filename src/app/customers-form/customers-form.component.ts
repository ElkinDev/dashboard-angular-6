import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
@Component({
  selector: 'app-customers-form',
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.css']
})
export class CustomersFormComponent implements OnInit {
  checkedActivoUser: boolean;
  modusNewCustomer: string;
  hrefImageUploaded: string;
  NotEqualsPassword: boolean;
  nameUserPhoto;
  fileToUpload: File = null;
  urlMainServer;
  submittedFormPeople:boolean;
  typeId;
  newCustomerPeople = new FormGroup({
    imageProfile: new FormControl(),
    nombre: new FormControl(),
    apellidos: new FormControl(),
    mail: new FormControl(),
    direccion: new FormControl(),
    telefono: new FormControl(),
    TipoIdentificacion:new FormControl(),
    // PasswordUserEdit: new FormControl(),
    passwordUserRepeat1: new FormControl(),
    passwordUserRepeat: new FormControl(),
    checModusEdit: new FormControl(),
  });

  constructor(private _location: Location, private cdRef: ChangeDetectorRef) {
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.modusNewCustomer = 'Persona'
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.NotEqualsPassword = false;
    this.checkedActivoUser = false;
    this.submittedFormPeople=false;
    this.typeId=[
      {name:'CC',description:'Cedula de Ciudadanía'},
      {name:'CE',description:'Cedula de Extranjeria'},
      {name:'TI',description:'Tarjeta de Identidad'},
    ]

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
  }
  onSubmitNewCustomerPeople(data: NgForm) {

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
