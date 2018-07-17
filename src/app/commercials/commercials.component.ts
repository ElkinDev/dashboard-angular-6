import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommercialsService } from './commercials-service.service'
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
declare let alertify: any;
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';

@Component({
  selector: 'app-commercials',
  templateUrl: './commercials.component.html',
  styleUrls: ['./commercials.component.css']
})
export class CommercialsComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean
  addSeller = false
  RoleUser: string;
  editSeller: boolean
  ListAllInfo: boolean;
  listCommercials;
  urlMainServer;
  messageErrorQuery;
  today;
  nameUserPhoto;
  indexNowEdit;
  hrefImageUpload2;
  ListSellerNull;
  EditUser = new FormGroup({

    imageProfile: new FormControl(),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mail: new FormControl(),
    // PasswordUserEdit: new FormControl(),
    passwordUserRepeat1: new FormControl(),
    passwordUserRepeat: new FormControl(),
    checModusEdit: new FormControl(),

  });
  constructor(private _commercialService: CommercialsService, private cdRef: ChangeDetectorRef) {
    this.editSeller = false;
    this.ExistUser = false;
    this.NotEqualsPassword = false;
    this.checkedActivoUser = true;
    this.modusEditUser = 'Activo';
    this.ListAllInfo = false;
    this.RoleUser = "Comercial";
    this.loadingMore = true;
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.today = new Date();
    this.indexNowEdit = null;
    this.nameUserPhoto = null;
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this._commercialService.getAllCommercials().then((res) => {

      if (!res) {
        this.listCommercials = null
        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.listCommercials = res;
      }

      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.listCommercials = null;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

      console.log(err, 'cuaaal es')
    })
  }

  openFormSellers() {
    this.editSeller = false
    this.addSeller ? this.addSeller = false : this.addSeller = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    console.log('llegaaaaaaa');
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.editSeller ? this.editSeller = false : this.editSeller = true

          } else {
            this.addSeller ? this.addSeller = false : this.addSeller = true
            this.ListAllInfo = false

          }
          break;
        case 'SubmitNewUser':
          this.submitNewUserAdmin($event.data)
          break;
        default:
          break
      }
    } else {

    }
  }
  submitNewUserAdmin(data): void {
    let senData = data.value;
    senData.RoleUser = this.RoleUser;
    if (data.value.imageProfile){
      senData.imageProfile = this.urlMainServer + data.value.imageProfile
    }
    

    this._commercialService.CreateSellerUser(senData).then(res => {
      this.ListSellerNull=false;
      alertify.success(res);
      senData.fecha = this.today
      this.listCommercials.push(senData)
      this.addSeller ? this.addSeller = false : this.addSeller = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
    }, err => {
      alertify.error(err);


    })

  }
  editSellerUser(data, index): void {
    console.log(data, 'veaa');
    this.indexNowEdit = index;
    this.EditUser.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      mail: data.mail,
      checModusEdit: data.status,
      imageProfile: null
    });

    if (data.imageProfile) {
      this.hrefImageUpload2 = data.imageProfile
    } else {
      this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';

    }
    data.status ? this.modusEditUser = 'Activo' : this.modusEditUser = 'Inactivo'
    this.ListAllInfo = true
    this.addSeller = false
    this.editSeller = true


  }
  onSubmitEditUser(data: NgForm) {
    let dataSend = {
      nombre: data.value.nombre,
      apellido: data.value.apellido,
      imageProfile: this.nameUserPhoto,
      mailUser: data.value.mail,
      password: data.value.passwordUserRepeat,
      status: data.value.checModusEdit
    }
    this._commercialService.editUser(dataSend).then(msg => {
      alertify.success(msg);
      this.listCommercials[this.indexNowEdit].nombre = data.value.nombre
      this.listCommercials[this.indexNowEdit].apellido = data.value.apellido
      this.listCommercials[this.indexNowEdit].status = data.value.checModusEdit
      this.listCommercials[this.indexNowEdit].mail = data.value.mail
      this.editSeller ? this.editSeller = false : this.editSeller = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
      if (this.nameUserPhoto) {
        console.log('que es esto', this.nameUserPhoto)
        this.listCommercials[this.indexNowEdit].imageProfile = this.urlMainServer + this.nameUserPhoto
      }
    }, err => {
      alertify.error(err);


    })
  }


  removeSeller(data, index): void {

    alertify
      .confirm("Administradores", "¿Eliminar al Administrador " + data.mail + "?",
        (() => {
          this._commercialService.RemoveUserAdmin(data.mail).then(msg => {
            alertify.success(msg);
            this.listCommercials.splice(index, 1);
            if (this.listCommercials.length <= 0) {
              this.ListSellerNull = true;
              this.messageErrorQuery = "- Sin usuarios Comerciales -"

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


  changeModusUser() {
    this.modusEditUser === 'Activo' ? this.modusEditUser = 'Inactivo' : this.modusEditUser = 'Activo'
  }
  clearForm() {

    this.editSeller ? this.editSeller = false : this.editSeller = true
    this.ListAllInfo = false



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

}
