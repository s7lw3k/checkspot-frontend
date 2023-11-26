import {
  Component,
  ComponentRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewContainerRef,
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
  Icon,
  Point,
} from 'leaflet';
import { NewSpotComponent } from './new-spot/new-spot.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { Spot } from '../core/models/spot.model';
import { Action, Store } from '@ngrx/store';
import {
  AddSpot,
  AddSpots,
  SpotActionTypes,
} from '../core/store/spot/spot.action';
import { AppState } from '../core/store/app.state';
import { SpotState } from '../core/store/spot/spot.state';
import { selectAllSpots } from '../core/store/spot/spot.selectors';
import { ShowSpotsComponent } from './show-spots/show-spots.component';
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
    </div>
    <new-spot
      [newCords]="newCords"
      (submitNewSpot)="handleNewSpotSubmit()"
      [(visible)]="isAddSpotComponentVisible"
    ></new-spot>
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
    ShowSpotsComponent,
  ],
})
export class MapComponent implements OnInit, OnDestroy {
  private bounds = latLngBounds([
    [50, 19.8],
    [50.15, 20.2],
  ]);

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

  private zoom: number = 0;

  private spots$: Observable<Spot[]>;

  private newSpotMarker: Marker;

  public newCords: LatLng;

  public isAddSpotComponentVisible: boolean = false;

  private clusterGroup: MarkerClusterGroup;

  private showSpotsComponent: ComponentRef<ShowSpotsComponent>;

  private detailSpot: Spot;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef
  ) {
    this.spots$ = this.store.select(selectAllSpots);
    this.subscriptions.add(
      this.store
        .select((store) => store.spots)
        .subscribe((spots: SpotState) => {
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
						<div>Opinia: ${newSpot.opinion}</div>
						<div>cords: ${newSpot.coordinates}</div>
					`);
            this.clusterGroup.addLayer(layer);
            this.clusterGroup.addTo(this.map);
          }
        })
    );
  }

  ngOnInit() {
    this.clusterGroup = new MarkerClusterGroup({
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: false,
      showCoverageOnHover: false,
    });
    this.clusterGroup.on('clusterclick', (cluster: any) => {
      this.map.closePopup();
      let spots: Spot[] = [];
      for (const marker of cluster.layer.getAllChildMarkers() as Marker[]) {
        let finedSpot: Spot | undefined;
        this.spots$
          .subscribe((spots) => {
            finedSpot = spots.find(
              (spot: Spot) =>
                spot.coordinates.lat === marker.getLatLng().lat &&
                spot.coordinates.lng === marker.getLatLng().lng
            );
          })
          .unsubscribe();
        if (finedSpot) {
          spots.push(finedSpot);
        }
      }

      this.showSpotsComponent?.destroy();
      this.showSpotsComponent =
        this.viewContainerRef.createComponent(ShowSpotsComponent);
      this.showSpotsComponent.instance.spots = spots;
      this.ngZone.run(() => {
        const popup = new Popup()
          .setLatLng(cluster.layer.getLatLng())
          .setContent(this.showSpotsComponent.location.nativeElement)
          .openOn(this.map);
      });
      this.subscriptions.add(
        this.showSpotsComponent.instance.selectedSpot.subscribe(
          (spotToDisplay) => {
            this.detailSpot = spotToDisplay;
          }
        )
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.map.clearAllEventListeners;
    this.map.remove();
  }

  public onMapReady(map: Map) {
    this.map = map;
    this.zoom = map.getZoom();

    this.map.setView([50.05, 19.95], 13);

    this.map.setMaxBounds(this.bounds);
    this.map.on('click', this.createNewSpotPin);
  }

  public onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
    this.map.closePopup();
  }

  private createNewSpotPin = (event: any) => {
    if (this.newSpotMarker) this.map.removeLayer(this.newSpotMarker);

    const icon = this.getNewSpotMarkerIcon();

    this.newSpotMarker = new Marker(event.latlng, {
      draggable: true,
      icon,
    });

    this.map.addLayer(this.newSpotMarker);

    this.newSpotMarker.on('click', (event) => {
      this.ngZone.run(() => {
        this.isAddSpotComponentVisible = true;
        this.newCords = event.latlng;
      });
    });
    this.newSpotMarker.on('dragend', () => {
      this.ngZone.run(() => {
        this.newCords = this.newSpotMarker.getLatLng();
      });
    });
  };

  public genRandomSpots(): void {
    const newSpots: Spot[] = [];
    for (let i = 0; i < 300; i++) {
      newSpots.push({
        id: Math.floor(Math.random() * 10000),
        name: 'los',
        des: 'los',
        coordinates: {
          lat: Math.random() * 0.05 + 50.05,
          lng: Math.random() * 0.2 + 19.9,
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
        lat: Math.random() * 0.05 + 50.05,
        lng: Math.random() * 0.2 + 19.9,
      } as LatLng,
    };
    this.store.dispatch(new AddSpot({ spot: newSpot }));
  }

  private getNewSpotMarkerIcon(): Icon {
    return new Icon({
      iconUrl: '../../assets/addMarker_big.png',
      iconSize: new Point(30, 80),
      className: 'cs-marker-popup--bg-icon',
    });
  }

  public handleNewSpotSubmit(): void {
    this.map.removeLayer(this.newSpotMarker);
  }
}
