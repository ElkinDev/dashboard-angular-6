import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { AuditorService } from './auditor.service'
declare let alertify: any;

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styleUrls: ['./auditor.component.css']
})
export class AuditorComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean
  addAuditor = false
  RoleUser: string;
  EditAuditor: boolean
  ListAllInfo: boolean;
  ListEditors;
  urlMainServer;
  messageErrorQuery;
  today;
  nameUserPhoto;
  indexNowEdit;
  hrefImageUpload2;
  ListEditorsNull;
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

  constructor(private _auditorService: AuditorService, private cdRef: ChangeDetectorRef) {
    this.EditAuditor = false
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.loadingMore = true;
    this.RoleUser = "Auditor";
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
    this._auditorService.getAllEditors().then((res) => {

      if (!res) {
        this.ListEditors = null
        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.ListEditors = res;

      }
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.ListEditors = null;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)
    })
  }
  openFormAuditors() {
    this.EditAuditor = false
    this.addAuditor ? this.addAuditor = false : this.addAuditor = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.EditAuditor ? this.EditAuditor = false : this.EditAuditor = true

          } else {
            this.addAuditor ? this.addAuditor = false : this.addAuditor = true
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
    console.log('seee metee', data)
    let senData = data.value;
    senData.RoleUser = this.RoleUser;
    if (data.value.imageProfile) {
      senData.imageProfile = this.urlMainServer + data.value.imageProfile
    }
    this._auditorService.CreateAuditorUser(senData).then(res => {
      this.ListEditorsNull=false
      alertify.success(res);
      senData.fecha = this.today
      this.ListEditors.push(senData)
      this.addAuditor ? this.addAuditor = false : this.addAuditor = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
    }, err => {
      alertify.error(err);
    })

  }

  editAuditorUser(data, index): void {
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
    this.addAuditor = false
    this.EditAuditor = true

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
    this._auditorService.editUser(dataSend).then(msg => {
      alertify.success(msg);
      this.ListEditors[this.indexNowEdit].nombre = data.value.nombre
      this.ListEditors[this.indexNowEdit].apellido = data.value.apellido
      this.ListEditors[this.indexNowEdit].mail = data.value.mail
      this.ListEditors[this.indexNowEdit].status = data.value.checModusEdit
      this.EditAuditor ? this.EditAuditor = false : this.EditAuditor = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
      if (this.nameUserPhoto) {
        console.log('que es esto', this.nameUserPhoto)
        this.ListEditors[this.indexNowEdit].imageProfile = this.urlMainServer + this.nameUserPhoto
      }
    }, err => {
      alertify.error(err);


    })
  }

  removeAuditor(data, index): void {

    alertify
      .confirm("Administradores", "¿Eliminar al Administrador " + data.mail + "?",
        (() => {
          this._auditorService.RemoveUserAdmin(data.mail).then(msg => {
            alertify.success(msg);
            this.ListEditors.splice(index, 1);
            if (this.ListEditors.length <= 0) {
              this.ListEditorsNull = true;
              this.messageErrorQuery = "- Sin usuarios Auditores -"

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

    this.EditAuditor ? this.EditAuditor = false : this.EditAuditor = true
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
