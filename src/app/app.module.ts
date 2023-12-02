import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterPanelComponent } from './login/register-panel/register-panel.component';
import { HttpClientModule } from '@angular/common/http';
import { NewSpotComponent } from './map/new-spot/new-spot.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './core/store/app.state';
import { StarComponent } from './shared/components/stars.component';
import { NewSpotSectionComponent } from './map/new-spot/new-spot-section/new-spot-section.component';
import { ShowSpotsComponent } from './map/show-spot/show-spots/show-spots.component';
import { ShowSpotDetailComponent } from './map/show-spot/show-spot-detail/show-spot-detail.component';
import { ShowSpotComponent } from './map/show-spot/show-spot/show-spot.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MapComponent,
    LoginComponent,
    BrowserAnimationsModule,
    RegisterPanelComponent,
    HttpClientModule,
    NewSpotComponent,
    StoreModule.forRoot(reducers),
    StarComponent,
    NewSpotSectionComponent,
    ShowSpotsComponent,
    ShowSpotDetailComponent,
    ShowSpotComponent,
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent],
})
export class AppModule {}
