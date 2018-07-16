import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  hrefImageUploaded;
  ExistUser: boolean;
  NotEqualsPassword: boolean;
  checkedActivoUser: boolean = true;
  modusNewUser: string;
  newUser: NgForm;
  nameUserPhoto;
  fileToUpload: File = null;
  
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();
  @Input() rolUser: string;

  constructor() {

    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusNewUser = 'Activo'

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
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  onSubmitNewUser(newUser: NgForm): void {
    if (newUser.value.password == newUser.value.passwordRepeat) {
      let dataSend: any = newUser;
      this.nameUserPhoto ? dataSend.value.imageProfile = this.nameUserPhoto : null;
      let data = {
        type: 'function',
        event: 'SubmitNewUser',
        data: dataSend
      }

      this.CloseFormtUserAdmin.emit(data)
      newUser.resetForm(); // or form.reset();
      this.modusNewUser ='Inactivo'
    } else {
      this.NotEqualsPassword=true
    }

  }
  changeModusUser() {
    this.modusNewUser === 'Activo' ? this.modusNewUser = 'Inactivo' : this.modusNewUser = 'Activo'
  }
  clearForm() {
    this.hrefImageUploaded = 'assets/images/noimage.png';
    let data = {
      type: 'function',
      event: 'CloseFormAdmins'
    }
    this.CloseFormtUserAdmin.emit(data)
    this.modusNewUser = 'Inactivo'

  }
  ngOnInit() {
    console.log(this.rolUser)
  }
  disabledPassErr():void{
    this.NotEqualsPassword=false
    
  }

}
