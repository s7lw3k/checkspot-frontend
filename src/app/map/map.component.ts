import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  Map,
  MapOptions,
  tileLayer,
  latLng,
  LeafletEvent,
  latLngBounds,
  Popup,
  LatLng,
  MarkerClusterGroup,
  Marker,
} from 'leaflet';
import { NewSpotComponent } from './new-spot-popup/new-spot-popup.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { SpotService } from '../core/services/spot.service';
import { PopupService } from '../core/services/popup.service';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Spot } from '../core/models/spot.model';
import { Action, Store, select } from '@ngrx/store';
import {
  AddSpot,
  AddSpots,
  SpotActionTypes,
} from '../core/store/spot/spot.action';
import { AppState } from '../core/store/app.state';
import { SpotState } from '../core/store/spot/spot.state';
@Component({
  selector: 'cs-map',
  // templateUrl: './map.component.html',
  template: `
    <div class="map-container">
      <div class="map-frame">
        <div
          id="map"
          leaflet
          [leafletOptions]="options"
          (leafletMapReady)="onMapReady($event)"
          (leafletMapZoomEnd)="onMapZoomEnd($event)"
        ></div>
      </div>
      <ng-template #popupContent></ng-template>
      <new-spot-popup></new-spot-popup>
    </div>
    <button
      style="z-index: 10000; position: relative; margin: 20px;"
      mat-raised-button
      (click)="genRandomSpots()"
    >
      GenLos
    </button>
    <button
      style="z-index: 10000; position: relative; margin: 80px;"
      mat-raised-button
      (click)="addSpot()"
    >
      addSpot
    </button>
  `,
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    NewSpotComponent,
    LeafletModule,
    CommonModule,
    LeafletMarkerClusterModule,
    MatButtonModule,
  ],
})
export class MapComponent implements OnInit, OnDestroy {
  private clusterGroup: MarkerClusterGroup;
  private bounds = latLngBounds([
    [50, 19.8],
    [50.15, 20.2],
  ]);

  @ViewChild('popupContent')
  popContent: TemplateRef<NewSpotComponent>;
  @Input() options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 13,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        bounds: this.bounds,
      }),
    ],
    zoom: 1,
    center: latLng(0, 0),
  };
  private map: Map;
  private popup: Popup = new Popup();
  private zoom: number = 0;
  private spots$: Observable<SpotState>;
  constructor(
    private spotService: SpotService,
    private popupService: PopupService,
    private store: Store<AppState>
  ) {
    this.spots$ = this.store.select((store) => store.spots);
    this.spots$.subscribe((spots: SpotState) => {
      this.clusterGroup?.clearLayers();
      for (const id of spots.ids) {
        const newSpot = spots.entities[id];
        if (!newSpot) {
          return;
        }
        const marker = new Marker(newSpot.coordinates);
        const layer = marker.bindPopup(`
						<h1>Spot</h1>
						<div>id: ${newSpot.id}</div>
						<div>name: ${newSpot.name}</div>
						<div>des: ${newSpot.des}</div>
						<div>address: ${newSpot.address}</div>
						<div>cords: ${newSpot.coordinates}</div>
					`);
        this.clusterGroup.addLayer(layer);
        this.clusterGroup.addTo(this.map);
      }
    });
  }

  ngOnInit() {
    this.clusterGroup = new MarkerClusterGroup({
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: false,
      showCoverageOnHover: false,
    });
    this.clusterGroup
      .on('clusterclick', (cluster: any) => {
        this.map.closePopup();
        let popupContent: string = '';
        popupContent += '<h1>Markery w środku</h1>';
        for (const marker of cluster.layer.getAllChildMarkers()) {
          popupContent += `<p>${marker}</p>`;
        }
        const popup = new Popup()
          .setLatLng(cluster.layer.getLatLng())
          .setContent(
            cluster.layer.getChildCount() + ' Locations(click to Zoom)'
          )
          .openOn(this.map);
      })
      .on('mouseout', (event) => {
        // this.map.closePopup();
      });
    let createSpotAction = new AddSpot({
      spot: { id: 1, name: 'a', des: 's' } as Spot,
    });

    // this.store.dispatch(createSpotAction);

    let getSpotAction: Action = {
      type: SpotActionTypes.GET_SPOT,
    };
  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }
  public onMapReady(map: Map) {
    this.map = map;
    this.zoom = map.getZoom();

    this.map.setView([50.05, 19.95], 13);

    this.map.setMaxBounds(this.bounds);

    this.map.on('click', this.addPin);
  }

  public onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
  }

  private addPin = (event: any) => {
    this.spotService.cords = event.latlng;
    this.popupService.newPopup = this.popup;

    this.popup
      .setLatLng(event.latlng)
      .setContent(this.popContent.elementRef.nativeElement.nextElementSibling)
      .openOn(this.map);
  };

  public genRandomSpots(): void {
    const newSpots: Spot[] = [];
    for (let i = 0; i < 300; i++) {
      newSpots.push({
        id: Math.floor(Math.random() * 10000),
        name: 'los',
        des: 'los',
        coordinates: {
          lat: Math.random() * 0.15 + 50,
          lng: Math.random() * 0.4 + 19.8,
        } as LatLng,
      } as Spot);
    }
    this.store.dispatch(new AddSpots({ spots: newSpots }));
  }

  public addSpot(): void {
    const newSpot: Spot = {
      id: Math.floor(Math.random() * 10000),
      name: 'los',
      des: 'los',
      coordinates: {
        lat: Math.random() * 0.15 + 50,
        lng: Math.random() * 0.4 + 19.8,
      } as LatLng,
    };
    this.store.dispatch(new AddSpot({ spot: newSpot }));
  }
}
