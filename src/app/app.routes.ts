import { Routes } from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import { DashboardAirportsComponent } from './pages/dashboard/airports/airports.component';
import { DashboardModelPlanesComponent } from './pages/dashboard/model-planes/model-planes.component';

export const routes: Routes = [

  { path: 'dashboard/airports', component: DashboardAirportsComponent },
  { path: 'dashboard/model-planes', component: DashboardModelPlanesComponent },
  { path: '', component: HomeComponent },
];
