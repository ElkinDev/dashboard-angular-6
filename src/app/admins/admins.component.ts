import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  loadingMore:boolean
  constructor() { }

  ngOnInit() {
    this.loadingMore=false
  }

}
