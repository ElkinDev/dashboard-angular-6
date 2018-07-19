import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { adminsService } from './admins.service';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
declare let alertify: any;

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  hrefImageUploaded;
  hrefImageUpload2;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusEditUser: string;
  loadingMore: boolean;
  addAdmin = false;
  RoleUser: string;
  EditAdmin: boolean;
  ListAllInfo: boolean;
  ListAdmins;
  urlMainServer;
  messageErrorQuery;
  today: number;
  checModusEdit
  nameUserPhoto;
  fileToUpload: File = null;
  indexNowEdit;
  ListAdminsnull;
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

  @Output() CloseFormtUserAdmin = new EventEmitter<object>();

  constructor(private _adminService: adminsService, private cdRef: ChangeDetectorRef) {
    this.EditAdmin = false
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.RoleUser = "Administrador";
    this.loadingMore = true;
    this.urlMainServer = environment.ws_url + '/public/dashboard/assets/images/'
    this.today = Date.now();
    this.indexNowEdit = null;
    this.nameUserPhoto = null;
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this._adminService.getAllAdmins().then((res) => {

      if (!res) {
        this.ListAdmins = null
        this.messageErrorQuery = "No Hay resultados"
      } else {
        this.ListAdmins = res;

      }
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)


    }, (err) => {
      this.ListAdmins = null
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!'
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

      console.log(err, 'cuaaal es')

    })

  }
  openFormAdmins() {
    this.EditAdmin = false
    this.addAdmin ? this.addAdmin = false : this.addAdmin = true
    this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true


  }

  receiveMessage($event) {
    if ($event.type == 'function') {
      switch ($event.event) {
        case 'CloseFormAdmins':
          if ($event.formType) {
            this.ListAllInfo = false

            this.EditAdmin ? this.EditAdmin = false : this.EditAdmin = true

          } else {
            this.addAdmin ? this.addAdmin = false : this.addAdmin = true
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
    this._adminService.CreateUserAdmin(senData).then(res => {
      this.ListAdminsnull = false;
      alertify.success(res);
      senData.fecha = this.today;
      this.ListAdmins.push(senData)
      this.addAdmin ? this.addAdmin = false : this.addAdmin = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
      this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    }, err => {
      alertify.error(err);


    })

  }
  editAdminUser(data, index): void {
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
    this.addAdmin = false
    this.EditAdmin = true

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
    this._adminService.editUser(dataSend).then(msg => {
      alertify.success(msg);
      this.ListAdmins[this.indexNowEdit].nombre = data.value.nombre
      this.ListAdmins[this.indexNowEdit].apellido = data.value.apellido
      this.ListAdmins[this.indexNowEdit].status = data.value.checModusEdit
      this.ListAdmins[this.indexNowEdit].mail = data.value.mail

      this.EditAdmin ? this.EditAdmin = false : this.EditAdmin = true
      this.ListAllInfo ? this.ListAllInfo = false : this.ListAllInfo = true
      if (this.nameUserPhoto) {
        this.ListAdmins[this.indexNowEdit].imageProfile = this.urlMainServer + this.nameUserPhoto
      }
    }, err => {
      alertify.error(err);


    })
  }

  removeAdmin(data, index): void {

    alertify
      .confirm("Administradores", "¿Eliminar al Administrador " + data.mail + "?",
        (() => {
          this._adminService.RemoveUserAdmin(data.mail).then(msg => {
            alertify.success(msg);
            this.ListAdmins.splice(index, 1);
            if (this.ListAdmins.length <= 0) {
              this.ListAdminsnull = true;
              this.messageErrorQuery = "- Sin usuarios Administradores -"

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

    this.EditAdmin ? this.EditAdmin = false : this.EditAdmin = true
    this.ListAllInfo = false



  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    console.log('file uploaded', files)
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
