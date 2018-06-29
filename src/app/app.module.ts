import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule, Route, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FunctionsService} from './functions.service';
import { DashboardComponent } from './dashboard/dashboard.component'
export const appRoutes:Routes = [
  {
    path:'login',
    component:LoginComponent,
    
  },
  {
    path:'Dashboard',
    component:DashboardComponent,
  }

];
@NgModule({
  declarations: [
    AppComponent,
      LoginComponent,
      DashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
  ],
  providers: [FunctionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
