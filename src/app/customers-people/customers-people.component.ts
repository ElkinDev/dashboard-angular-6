import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { CustomersService } from './customers-service.service';
import { FunctionsService } from '../functions.service'

declare let alertify: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-customers-people',
  templateUrl: './customers-people.component.html',
  styleUrls: ['./customers-people.component.css']
})
export class CustomersPeopleComponent implements OnInit {
  loadingMore: boolean;
  hrefImageUploaded;
  hrefImageUpload2;
  urlMainServer;
  ListCustomers;
  messageErrorQuery;
  ListAdminsnull;
  nameUserPhoto;
  ExistUser;
  statusEditCustomer;
  editCustomer;
  typeId;
  indexNowEdit;
  idNowEdit;
  sendData;
  mask: any[] = ['+57', '', '', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  urlMainServerPhotos;
  EditCustomer = new FormGroup({
    imgProfile: new FormControl(),
    contactPerson: new FormControl(null),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mail: new FormControl(),
    address: new FormControl(null),
    phone: new FormControl(null),
    typeIdentification: new FormControl(),
    cedula: new FormControl(null),
    checModusEdit: new FormControl(),
    fecha: new FormControl,

  });
  constructor(private cdRef: ChangeDetectorRef, private _FunctionsService: FunctionsService, private _customersService: CustomersService) {
    this.loadingMore = true;
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/';
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.ExistUser = false;
    this.editCustomer = false
    this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    });
    this.indexNowEdit, this.idNowEdit, this.nameUserPhoto, this.sendData = null;

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this._customersService.getAllCustomers().then((res) => {
      console.log(res, 'quejestooo');
      if (!res) {
        this.ListCustomers = null
        this.messageErrorQuery = "No Hay resultados"
      } else {
        this.ListCustomers = res;

      }
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)


    }, (err) => {
      this.ListCustomers = null
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!'
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

      console.log(err, 'cuaaal es')

    })
  }
  removeCustomer(data, index): void {

    alertify
      .confirm("Clientes", "¿Eliminar al Cliente " + data.mail + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mail, 5, 8).then(msg => {
            alertify.success(msg);
            this.ListCustomers.splice(index, 1);
            if (this.ListCustomers.length <= 0) {
              this.ListAdminsnull = true;
              this.messageErrorQuery = "- no hay Resultados -"

            }
          }, err => {
            alertify.error(err)
          })
        })
        , () => {
        }
      )
      .set({

        'labels': {
          'ok': 'Eliminar',
          'cancel': 'Cancelar'
        }
      }).autoCancel(15);
  }
  onSubmitEdtitCustomer(data: NgForm) {
    console.log(data.value, 'VEAAMOS');
    if (data.value.typeIdentification) {
      this.sendData = {
        opt: 18,
        userEdit: {
          nombre: data.value.nombre,
          apellido: data.value.apellido,
          typeIdentification: data.value.typeIdentification,
          mail: data.value,
          id: this.idNowEdit,
          address: data.value.address,
          nit: data.value.cedula,
          status: data.value.checModusEdit,
          phone: data.value.celular
        }
      }
    } else {
      this.sendData = {
        opt: 14,
        userEdit: {
          nombre: data.value.nombre,
          mail: data.value.mail,
          id: this.idNowEdit,
          address: data.value.address,
          nit: data.value.cedula,
          contactPerson: data.value.contactPerson,
          status:data.value.checModusEdit,
          phone: data.value.phone,
          typeIdentification:data.value.typeIdentification
        }

      }
    }


    this._FunctionsService.editUser(this.sendData).then(msg => {

      console.log('vengaaaaa',this.sendData);
      // alertify.success(msg);
      // this.ListCustomers[this.indexNowEdit] = sendData;
      // if (this.nameUserPhoto) {
      //   this.ListCustomers[this.indexNowEdit].imgProfile = this.urlMainServer + this.nameUserPhoto;
      // } else {
      //   this.ListCustomers[this.indexNowEdit].imgProfile = this.hrefImageUpload2;
      // }
      // this.editCustomer ? this.editCustomer = false : this.editCustomer = true

    }, err => {
      alertify.error(err);


    })

  }
  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.nameUserPhoto = file.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUpload2 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }

  changeStatusCustomer() {
    this.statusEditCustomer === 'Activo' ? this.statusEditCustomer = 'Inactivo' : this.statusEditCustomer = 'Activo'
  }
  editCustomerf(customer, i) {
    console.log(customer, 'Veaamos')
    let tipo = (customer.typeIdentification).trim();
    this.statusEditCustomer = customer.status ? 'Activo' : 'Inactivo';
    this.editCustomer = true;
    this.hrefImageUpload2 = customer.imgProfile ? customer.imgProfile : this.hrefImageUpload2;
    this.EditCustomer.patchValue({
      imgProfile: null,
      contactPerson: customer.contactPerson,
      nombre: customer.nombre,
      apellido: customer.apellido,
      mail: customer.mail,
      address: customer.address,
      phone: customer.celular,
      typeIdentification: tipo,
      cedula: customer.cedula,
      checModusEdit: customer.status,
      fecha: customer.fecha
    });
    this.indexNowEdit = i;
    this.idNowEdit = customer.id

  }

}
