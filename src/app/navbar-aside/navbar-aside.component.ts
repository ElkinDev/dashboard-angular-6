import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar-aside',
  templateUrl: './navbar-aside.component.html',
  styleUrls: ['./navbar-aside.component.css']
})
export class NavbarAsideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	console.log('hacer el emit acá, para ver todos los tipos de usuarios')
  	
  }

}
