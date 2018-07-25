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
  statusNewCustomer;
  statusEditCustomer;
  editCustomer;
  typeId;  
  EditCustomer = new FormGroup({
    imageProfile: new FormControl(),
    nombreContacto: new FormControl(null),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mailUser: new FormControl(),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    TipoIdentificacion: new FormControl(),
    numeroIdentificacion: new FormControl(null),
    checModusEdit: new FormControl(),

  });
  constructor(private cdRef: ChangeDetectorRef, private _FunctionsService: FunctionsService, private _customersService: CustomersService) {
    this.loadingMore = true;
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.statusNewCustomer = 'Activo';
    this.ExistUser = false;
    this.editCustomer = false
    this._FunctionsService.getAllDocumentsType().then(res => {
      this.typeId = res;
    });
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this._customersService.getAllCustomers().then((res) => {
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
      .confirm("Clientes", "¿Eliminar al Cliente " + data.mailUser + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mailUser).then(msg => {
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
  onSubmitEdtitCustomer() {

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

  changeStatusCustomer() {
    this.statusNewCustomer === 'Activo' ? this.statusNewCustomer = 'Inactivo' : this.statusNewCustomer = 'Activo'
  }
  editCustomerf(customer, i) {
    console.log(customer.TipoIdentificacion, 'Veaamos', i)
    let tipo=(customer.TipoIdentificacion).trim();
    this.statusEditCustomer= customer.status? 'Activo':'Inactivo';
    this.editCustomer = true;
    this.EditCustomer.patchValue({
      imageProfile: null,
      nombreContacto: customer.nombreContacto,
      nombre: customer.nombre,
      apellido: customer.apellido,
      mailUser: customer.mailUser,
      direccion: customer.direccion,
      telefono: customer.telefono,
      TipoIdentificacion: tipo,
      numeroIdentificacion: customer.numeroIdentificacion,
      checModusEdit: customer.status,
    });
  }

}
