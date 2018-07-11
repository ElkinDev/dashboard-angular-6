import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
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
  newUser:NgForm;
  @Output() CloseFormtUserAdmin = new EventEmitter<object>();
  @Input() rolUser: string;

  constructor() {

    this.hrefImageUploaded = 'assets/images/noimage.png';
    this.ExistUser = false
    this.NotEqualsPassword = false
    this.checkedActivoUser = true
    this.modusNewUser = 'Activo'

  }
  fileToUpload: File = null;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    console.log('file uploaded', files)
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.hrefImageUploaded = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  onSubmitNewUser(newUser: NgForm): void {
    console.log('veaaaloooo', newUser.value)
  }
  changeModusUser() {
    this.modusNewUser === 'Activo' ? this.modusNewUser = 'Inactivo' : this.modusNewUser = 'Activo'
  }
  clearForm(){
    this.hrefImageUploaded = 'assets/images/noimage.png';
    let data={
      type:'function',
      event:'CloseFormAdmins'
    }
    this.CloseFormtUserAdmin.emit(data)
    

  }
  ngOnInit() {
    console.log(this.rolUser)
  }

}
