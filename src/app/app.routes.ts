import { Routes } from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardAirportsComponent } from './pages/dashboard/airports/airports.component';
import { DashboardModelPlanesComponent } from './pages/dashboard/model-planes/model-planes.component';
import { AirportEditComponent } from './pages/dashboard/airports/airport-edit.component';
import { ModelPlaneEditComponent } from './pages/dashboard/model-planes/model-planes-edit.component';


export const routes: Routes = [

  { path: 'dashboard/airports', component: DashboardAirportsComponent },
  { path: 'dashboard/airports/edit/:id', component: AirportEditComponent },
  { path: 'dashboard/model-planes', component: DashboardModelPlanesComponent },
  { path: 'dashboard/model-planes/edit/:id', component: ModelPlaneEditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: HomeComponent },
];
