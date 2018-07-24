import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Route, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FunctionsService} from './functions.service';
import {adminsService} from './admins/admins.service';
import {WebSocketService} from './websocket.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarAsideComponent } from './navbar-aside/navbar-aside.component';
import { HeaderComponent } from './header/header.component';
import { AdminsComponent } from './admins/admins.component';
import { CommercialsComponent } from './commercials/commercials.component';
import { AuditorComponent } from './auditor/auditor.component';
import { CustomersPeopleComponent } from './customers-people/customers-people.component';
import { FilterPlansComponent } from './filter-plans/filter-plans.component';
import { FilterRolesComponent } from './filter-roles/filter-roles.component';
import { LoadingTableComponent } from './loading-table/loading-table.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { CustomersFormComponent } from './customers-form/customers-form.component';

export const appRoutes:Routes = [
  { path: '', redirectTo: '/Dashboard', pathMatch: 'full' },
  {
    path:'login',
    component:LoginComponent,
    
  },
  {
    path:'Dashboard/users/admins',
    component:AdminsComponent,
  },
  {
    path:'Dashboard/users/admins/new',
    component:AdminFormComponent,
  },
  {
    path:'Dashboard/users/sellers',
    component:CommercialsComponent,
  },
  {
    path:'Dashboard/users/auditors',
    component:AuditorComponent,
  },
  {
    path:'Dashboard/customers',
    component:CustomersPeopleComponent,
  },
  {
    path:'Dashboard/customers/create',
    component:CustomersFormComponent,
  },
  {
    path:'Dashboard/filters/plans',
    component:FilterPlansComponent,
  },
  {
    path:'Dashboard/filters/roles',
    component:FilterRolesComponent,
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
      DashboardComponent,
        NavbarAsideComponent,
        HeaderComponent,
          AdminsComponent,
          CommercialsComponent,
          AuditorComponent,
          CustomersPeopleComponent,
          FilterPlansComponent,
          FilterRolesComponent,
          LoadingTableComponent,
          AdminFormComponent,
          CustomersFormComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [WebSocketService,FunctionsService,adminsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
