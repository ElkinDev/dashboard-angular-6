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
  sendImage;
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: 'edbee4f4050c98ad293df52d'
  };
  imgProfileActually;
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
    this.indexNowEdit, this.idNowEdit, this.nameUserPhoto, this.sendData, this.sendImage, this.imgProfileActually = null;

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


    })
  }
  removeCustomer(data, index): void {
    let opt;
    data.typeIdentification=='NIT'? opt=13:opt=17;
    alertify
      .confirm("Clientes", "¿Eliminar al Cliente " + data.mail + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mail, data.id, opt).then(msg => {
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
    var DataImport;
    let dataFi: any;
    if (data.value.typeIdentification != 'NIT') {
      console.log('vengaaaa entraa')
      this.sendData = {
        opt: 18,
        userEdit: {
          nombre: data.value.nombre,
          apellido: data.value.apellido,
          typeIdentification: data.value.typeIdentification,
          mail: data.value.mail,
          id: this.idNowEdit,
          address: data.value.address,
          nit: data.value.cedula,
          status: data.value.checModusEdit,
          phone: data.value.phone,
        }
      }
      DataImport = {
        nombre: data.value.nombre,
        apellido: data.value.apellido,
        typeIdentification: data.value.typeIdentification,
        mail: data.value.mail,
        id: this.idNowEdit,
        address: data.value.address,
        cedula: data.value.cedula,
        status: data.value.checModusEdit,
        celular: data.value.phone,
        imgProfile: this.imgProfileActually,
        fecha: data.value.fecha

      }
    } else {
      this.sendData = {
        opt: 14,
        userEdit: {
          nombre: data.value.nombre,
          apellido: '',
          mail: data.value.mail,
          id: this.idNowEdit,
          address: data.value.address,
          nit: data.value.cedula,
          contactPerson: data.value.contactPerson,
          status: data.value.checModusEdit,
          phone: data.value.phone,
          typeIdentification: data.value.typeIdentification,
        }

      }
      DataImport = {
        nombre: data.value.nombre,
        mail: data.value.mail,
        id: this.idNowEdit,
        address: data.value.address,
        cedula: data.value.cedula,
        contactPerson: data.value.contactPerson,
        status: data.value.checModusEdit,
        celular: data.value.phone,
        typeIdentification: data.value.typeIdentification,
        imgProfile: this.imgProfileActually,
        fecha: data.value.fecha


      }
    }

    this._FunctionsService.editUser(this.sendData).then(data => {
      dataFi = data;
      var formdata = new FormData();
      if (formdata && this.sendImage != null) {
        if (this.sendData.typeIdentification != 'NIT') {
          formdata.append('opt', '3')
        } else {
          formdata.append('opt', '4')
        }
        formdata.append('imgProfile', this.sendImage)
        formdata.append('id', this.idNowEdit)

        formdata.append('mail', this.session.mail)
        formdata.append('token', this.session.token)
        this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
          let resp1 = JSON.parse(resp);
          console.log('vieneee que es resp', resp1)
          if (!resp1.err) {
            DataImport.imgProfile = resp1.imageProfile

          }
          alertify.success('El usuario se actualizo corretamente');
          this.ListCustomers[this.indexNowEdit] = DataImport;


        });
      } else {
        if (dataFi.err) {
          alertify.error(dataFi.msg);

        } else {
          alertify.success(dataFi.msg);
          this.ListCustomers[this.indexNowEdit] = DataImport;
        }
        // alertify.success(msg);



      }


    }, err => {
      alertify.error(err);


    })

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
        this.hrefImageUpload2 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  changeStatusCustomer() {
    this.statusEditCustomer === 'Activo' ? this.statusEditCustomer = 'Inactivo' : this.statusEditCustomer = 'Activo'
  }
  editCustomerf(customer, i) {
    console.log(customer,'quejestooo????')
    let tipo = (customer.typeIdentification).trim();
    this.statusEditCustomer = customer.status ? 'Activo' : 'Inactivo';
    this.editCustomer = true;
    this.hrefImageUpload2 = customer.imgProfile ? customer.imgProfile : this.hrefImageUpload2;
    customer.imgProfile ? this.imgProfileActually = customer.imgProfile : this.imgProfileActually = null;
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
