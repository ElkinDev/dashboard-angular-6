import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { adminsService } from './admins.service';
import { FunctionsService } from '../functions.service'
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
  urlMainServerPhotos;
  messageErrorQuery;
  today: number;
  checModusEdit
  nameUserPhoto;
  fileToUpload: File = null;
  indexNowEdit;
  ListAdminsnull;
  senData;
  sendImage;
  fileImageEdit;
  idUserEditNow;
  EditUser = new FormGroup({

    imgProfile: new FormControl(),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mail: new FormControl(),
    checModusEdit: new FormControl(),

  });
  session = {
    mail: 'sonickfaber7@yahoo.es',
    token: 'edbee4f4050c98ad293df52d'
  }
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();

  constructor(private _adminService: adminsService, private cdRef: ChangeDetectorRef, private _FunctionsService: FunctionsService, private _wsSocket: WebSocketService) {
    this.EditAdmin = false
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.RoleUser = "Administrador";
    this.loadingMore = true;
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/'
    this.today = Date.now();
    this.indexNowEdit = null;
    this.nameUserPhoto = null;
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.ListAdmins = [];
    this.senData = null;
    this.sendImage = null;
    this.fileImageEdit = null;
    this.idUserEditNow = null;
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
    let resd: any = null;
    this.senData = data;
    this.senData.RoleUser = this.RoleUser;
    console.log('traeme toda la data del submit', data);
    if (data.imgProfile) {
      this.sendImage = this.senData.imageProfileFile;
    }
    this._FunctionsService.CreateUser(this.senData, 3).then(res => {
      resd = res;
      if (resd.type == 'createdUserNew') {
        alertify.alert("Confirma el registro de usuario", function () {
          window.open(resd.link, "_blank")

        });
      }

    }, err => {
      alertify.error(err);


    })


    this._wsSocket.on('createUser').subscribe((res) => {
      if (res.mail === this.senData.emailUser) {
        var formdata = new FormData();
        if (formdata && this.sendImage != null) {
          formdata.append('imgProfile', this.sendImage)
          formdata.append('id', res.id)
          formdata.append('opt', '0')
          formdata.append('mail', this.session.mail)
          formdata.append('token', this.session.token)
          this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
            let resp1 = JSON.parse(resp);
            this.senData.imgProfile = resp1.imageProfile;
            this.ListAdminsnull = false;
            this.senData.fecha = this.today;
            this.senData.id = res.id;
            this.ListAdmins = this.ListAdmins || [];
            let resultAdmin = this.ListAdmins.find(obj => {
              return obj.emailUser === this.senData.emailUser
            });
            if (!resultAdmin) {
              this.ListAdmins.push(this.senData)
              this.addAdmin = false;
              this.ListAllInfo = false;

              this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
              alertify.success('Usuario Creado Exitosamente');
            };



          });
        } else {
          console.log('see metee veaaa')
          this.ListAdminsnull = false;
          alertify.success('Usuario Creado Exitosamente');
          this.senData.fecha = this.today;
          this.senData.id = res.id;
          this.ListAdmins = this.ListAdmins || [];
          let resultAdmin = this.ListAdmins.find(obj => {
            return obj.emailUser === this.senData.emailUser
          });
          if (!resultAdmin) {
            this.ListAdmins.push(this.senData)
            this.addAdmin = false;
            this.ListAllInfo = false;

            this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
            alertify.success('Usuario Creado Exitosamente');
          };

        }
      }

    }, (error) => {

    })

  }
  progressImage(ev) {
    // console.log('veaa veaa veaa',ev)
  }
  editAdminUser(data, index): void {
    console.log(data, 'veas6erg6rea');
    this.indexNowEdit = index;
    this.EditUser.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      mail: data.mail,
      checModusEdit: data.status,
      imgProfile: null
    });

    if (data.imgProfile) {
      this.hrefImageUpload2 = data.imgProfile
    } else {
      this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    }
    this.idUserEditNow = data.id;
    data.status ? this.modusEditUser = 'Activo' : this.modusEditUser = 'Inactivo'
    this.ListAllInfo = true
    this.addAdmin = false
    this.EditAdmin = true

  }
  onSubmitEditUser(data: NgForm) {
    console.log('quiero verte esotoo', data.value)
    var dataSend = {
      nombre: data.value.nombre,
      apellido: data.value.apellido,
      mail: data.value.mail,
      status: data.value.checModusEdit,
      id: this.idUserEditNow
    }
    this._adminService.editUser(dataSend).then(msg => {
      let respF: any = msg;
      if (respF.type === 'updateData' && !this.fileImageEdit) {
        alertify.error('No haz realizado ningún cambio');

      }
      else {
        if (this.fileImageEdit) {

          var formdata = new FormData();
          if (formdata) {

            formdata.append('imgProfile', this.fileImageEdit)
            formdata.append('id', dataSend.id)
            formdata.append('opt', '0')
            formdata.append('mail', this.session.mail)
            formdata.append('token', this.session.token)
            this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
              let respF: any = JSON.parse(resp)
              this.ListAdmins[this.indexNowEdit].nombre = data.value.nombre
              this.ListAdmins[this.indexNowEdit].apellido = data.value.apellido
              this.ListAdmins[this.indexNowEdit].status = data.value.checModusEdit
              this.ListAdmins[this.indexNowEdit].mail = data.value.mail

              this.ListAdmins[this.indexNowEdit].imgProfile = respF.imageProfile;
              alertify.success('Usuario ' + dataSend.mail + ' editado exitosamente');
              this.EditAdmin = false;
              this.ListAllInfo = false;

            });
          }
        } else {
          this.ListAdmins[this.indexNowEdit].nombre = data.value.nombre
          this.ListAdmins[this.indexNowEdit].apellido = data.value.apellido
          this.ListAdmins[this.indexNowEdit].status = data.value.checModusEdit
          this.ListAdmins[this.indexNowEdit].mail = data.value.mail
          this.EditAdmin = false;
          this.ListAllInfo = false;
          alertify.success('Usuario ' + dataSend.mail + ' editado exitosamente');
        }

      }

    }, err => {

      alertify.error(err.sjsj);


    })
  }

  removeAdmin(data, index): void {
    alertify
      .confirm("Administradores", "¿Eliminar al Administrador " + data.mail + "?",
        (() => {
          this._adminService.RemoveUserAdmin(data.mail, data.id).then(msg => {
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
      this.fileImageEdit = event.target.files[0];
      this.nameUserPhoto = file.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUpload2 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }

}
