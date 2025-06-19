import { Routes } from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardAirportsComponent } from './pages/dashboard/airports/airports.component';
import { DashboardModelPlanesComponent } from './pages/dashboard/model-planes/model-planes.component';
import { AirportEditComponent } from './pages/dashboard/airports/airport-edit.component';
import { ModelPlaneEditComponent } from './pages/dashboard/model-planes/model-planes-edit.component';
import { DashboardPlanesComponent } from './pages/dashboard/planes/planes.component';
import { PlaneEditComponent } from './pages/dashboard/planes/planes-edit.component';
import { ReservationComponent } from './pages/reservation/reservation.component';

export const routes: Routes = [

  { path: 'dashboard/airports', component: DashboardAirportsComponent },
  { path: 'dashboard/airports/edit/:id', component: AirportEditComponent },
  { path: 'dashboard/model-planes', component: DashboardModelPlanesComponent },
  { path: 'dashboard/model-planes/edit/:id', component: ModelPlaneEditComponent },
  { path: 'dashboard/planes', component: DashboardPlanesComponent },
  { path: 'dashboard/planes/edit/:id', component: PlaneEditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: '', component: HomeComponent },
];
