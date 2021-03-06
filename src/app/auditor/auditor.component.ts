import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentProd } from '../../environments/environment.prod';
import { WebSocketService } from '../websocket.service';
import { AuditorService } from './auditor.service';
import { FunctionsService } from '../functions.service';
import * as $ from 'jquery';

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
  urlMainServerPhotos;
  senData;
  sendImage;
  fileImageEdit;
  idUserEditNow;
  session;
  EditUser = new FormGroup({
    nit: new FormControl(),
    imgProfile: new FormControl(),
    nombre: new FormControl(),
    apellido: new FormControl(),
    mail: new FormControl(),
    checModusEdit: new FormControl(),

  });

  constructor(private _auditorService: AuditorService, private cdRef: ChangeDetectorRef, private _FunctionsService: FunctionsService, private _wsSocket: WebSocketService) {
    this.EditAuditor = false
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusEditUser = 'Activo'
    this.ListAllInfo = false
    this.loadingMore = true;
    this.RoleUser = "auditor";
    this.urlMainServerPhotos = environment.ws_url + '/public/dashboard/assets/images/'
    this.urlMainServer = environment.ws_url + '/public/imgs/'
    this.today = Date.now();
    this.indexNowEdit = null;
    this.nameUserPhoto = null;
    this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
    this.hrefImageUploaded = this.urlMainServer + 'noimage.png';
    this.ListEditors = [];
    this.senData = null;
    this.sendImage = null;
    this.fileImageEdit = null;
    this.idUserEditNow = null;
    this.session = this._FunctionsService.returnCurrentSession()


  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this._auditorService.getAllEditors().then((res) => {

      if (!res) {
        this.ListEditors = []
        this.ListEditorsNull = true;
        this.messageErrorQuery = "No Hay resultados"

      } else {
        this.ListEditors = res;

      }
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)

    }, (err) => {
      this.ListEditors = [];
      this.ListEditorsNull = true;
      this.messageErrorQuery = err.msg ? err.msg : '¡Error inesperado, inténtelo nuevamente!';
      setTimeout(() => {
        this.loadingMore = false;
      }, 1000)
    })

    this._wsSocket.on('createUser:' + this.RoleUser).subscribe((res) => {
      if (res.mail.match(new RegExp(this.senData.emailUser, 'gi'))) {
        var formdata = new FormData();
        this.ListEditorsNull = false;

        this.senData.cedula = this.senData.nit;

        if (formdata && this.sendImage != null) {
          console.log('aqui see meteee');
          formdata.append('imgProfile', this.sendImage)
          formdata.append('id', res.id)
          formdata.append('opt', '2')
          formdata.append('mail', this.session.mail)
          formdata.append('token', this.session.token)
          this.ListEditorsNull = false;
          this.senData.fecha = res.dateCreate;
          this.senData.id = res.id;
          this.ListEditors = this.ListEditors || [];
          this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
            let resp1 = JSON.parse(resp);
            this.senData.imgProfile = resp1.imageProfile;
            console.log(resp1, 'quee nos traeeeee');
            if (this.ListEditors != [] && this.ListEditors != null) {
              let resultAdmin = this.ListEditors.find(obj => {
                return obj.emailUser === this.senData.emailUser
              });
              if (!resultAdmin) {

                this.senData.mail = this.senData.emailUser;
                this.sendImage = null;
                console.log(this.senData)
                this.ListEditors.push(this.senData)
                this.addAuditor = false;
                this.ListAllInfo = false;
                this.senData = null;
                this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
                alertify.success('Usuario Creado Exitosamente');
              };
            } else {

              this.senData.mail = this.senData.emailUser;
              this.sendImage = null;
              this.ListEditors.push(this.senData)
              this.addAuditor = false;
              this.ListAllInfo = false;
              this.senData = null;
              this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
              alertify.success('Usuario Creado Exitosamente');
            }





          });
        } else {
          this.senData.fecha = res.dateCreate;
          this.senData.id = res.id;
          if (this.ListEditors != [] && this.ListEditors != null) {

            let resultAdmin = this.ListEditors.find(obj => {
              return obj.emailUser === this.senData.emailUser
            });
            if (!resultAdmin) {
              this.senData.mail = this.senData.emailUser;

              this.sendImage = null;
              this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
              this.ListEditors.push(this.senData);
              this.addAuditor = false;
              this.ListAllInfo = false;
              this.senData = null;
              alertify.success('Usuario Creado Exitosamente');
            };
          } else {
            this.senData.mail = this.senData.emailUser;

            this.sendImage = null;
            this.hrefImageUpload2 = this.urlMainServer + 'noimage.png';
            this.ListEditors.push(this.senData)
            this.addAuditor = false;
            this.ListAllInfo = false;
            this.senData = null;
            alertify.success('Usuario Creado Exitosamente');
          }
        }
      }

    }, (error) => {

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
  progressImage(ev) {

  }


  submitNewUserAdmin(data): void {
    let resd: any = null;
    this.senData = data;
    this.senData.RoleUser = this.RoleUser;
    if (this.senData.imageProfileFile != null) {
      this.sendImage = this.senData.imageProfileFile;
    }
    this._FunctionsService.CreateUser(this.senData, 9).then(res => {
      resd = res;
      if (resd.type == 'createdUserNew') {
        alertify.alert("Confirma el registro de usuario", function () {
          window.open(resd.link, "_blank")

        });
      }

    }, err => {
      alertify.error(err);


    })


  }

  editAuditorUser(data, index): void {
    console.log(data, 'veas6erg6rea');
    this.indexNowEdit = index;
    this.EditUser.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      nit: data.cedula,
      cedula: data.cedula,
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
    this.addAuditor = false
    this.EditAuditor = true

  }
  onSubmitEditUser(data: NgForm) {
    var dataSend = {
      userEdit: {
        nombre: data.value.nombre,
        apellido: data.value.apellido,
        mail: data.value.mail,
        nit: data.value.cedula,
        cedula: data.value.cedula,
        status: data.value.checModusEdit,
        id: this.idUserEditNow
      },
      opt: 10
    }
    this._FunctionsService.editUser(dataSend).then(msg => {
      let respF: any = msg;
      if (respF.type === 'updateData' && !this.fileImageEdit) {
        alertify.error('No haz realizado ningún cambio');

      }
      else {
        if (this.fileImageEdit) {

          var formdata = new FormData();
          if (formdata) {

            formdata.append('imgProfile', this.fileImageEdit)
            formdata.append('id', dataSend.userEdit.id)
            formdata.append('opt', '2')
            formdata.append('mail', this.session.mail)
            formdata.append('token', this.session.token)
            this._FunctionsService.ajaxHttpRequest(formdata, this.progressImage, resp => {
              let respF: any = JSON.parse(resp)
              console.log('traaemelloooo que es??', respF)

              this.ListEditors[this.indexNowEdit].nombre = data.value.nombre
              this.ListEditors[this.indexNowEdit].apellido = data.value.apellido
              this.ListEditors[this.indexNowEdit].status = data.value.checModusEdit
              this.ListEditors[this.indexNowEdit].mail = data.value.mail

              this.ListEditors[this.indexNowEdit].imgProfile = respF.imageProfile;
              alertify.success('Usuario ' + dataSend.userEdit.mail + ' editado exitosamente');
              this.EditAuditor = false;
              this.ListAllInfo = false;

            });
          }
        } else {
          this.ListEditors[this.indexNowEdit].nombre = data.value.nombre
          this.ListEditors[this.indexNowEdit].apellido = data.value.apellido
          this.ListEditors[this.indexNowEdit].status = data.value.checModusEdit
          this.ListEditors[this.indexNowEdit].mail = data.value.mail
          this.EditAuditor = false;
          this.ListAllInfo = false;
          alertify.success('Usuario ' + dataSend.userEdit.mail + ' editado exitosamente');
        }

      }

    }, err => {

      alertify.error(err.sjsj);


    })

  }

  removeAuditor(data, index): void {

    alertify
      .confirm("Auditores", "¿Eliminar al Auditor " + data.mail + "?",
        (() => {
          this._FunctionsService.RemoveUser(data.mail, data.id, 11).then(msg => {
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
