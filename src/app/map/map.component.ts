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
  Layer,
} from 'leaflet';
import { NewSpotComponent } from './new-spot/new-spot.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { SimpleSpot, Spot } from '../core/models/spot.model';
import { Action, Store } from '@ngrx/store';
import {
  AddSpot,
  AddSpots,
  SpotActionTypes,
} from '../core/store/spot/spot.action';
import { AppState } from '../core/store/app.state';
import { SpotState } from '../core/store/spot/spot.state';
import { selectAllSpots } from '../core/store/spot/spot.selectors';
import { ShowSpotsComponent } from './show-spot/show-spots/show-spots.component';
import { ShowSpotDetailComponent } from './show-spot/show-spot-detail/show-spot-detail.component';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router } from '@angular/router';
import { Opinion } from '../core/models/opinion.model';
import { ShowSpotComponent } from './show-spot/show-spot/show-spot.component';
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
    <button
      class="see-on-hover"
      style="z-index: 10000; position: absolute; margin: 20px 20px;"
      mat-raised-button
      (click)="genRandomSpots()"
    >
      GenLos
    </button>
    <button
      class="see-on-hover"
      style="z-index: 10000; position: absolute; margin: 20px 110px;"
      mat-raised-button
      (click)="addSpot()"
    >
      addSpot
    </button>
    <button
      class="see-on-hover"
      style="z-index: 10000; position: absolute; margin: 20px 200px;"
      mat-raised-button
      (click)="authenticationService.setLoginState = false"
    >
      logOut
    </button>
    <new-spot
      [newCords]="newCords"
      (submitNewSpot)="handleNewSpotSubmit()"
      [(visible)]="isAddSpotComponentVisible"
    ></new-spot>
    <show-spot-detail [spot]="detailSpot"></show-spot-detail>
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
    ShowSpotDetailComponent,
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

  public detailSpot: Spot | undefined;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    public authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentLoggedUser.subscribe((user) => {
      if (user === undefined || !user.isLogin) router.navigate(['login']);
    });
    this.spots$ = this.store.select(selectAllSpots);
    this.subscriptions.add(
      this.store
        .select((store) => store.spots)
        .subscribe((spots: SpotState) => {
          this.clusterGroup?.clearLayers();
          for (const id of spots.ids) {
            const spot = spots.entities[id];
            if (spot === undefined) return;
            const newSpot: SimpleSpot = {
              id: spot.id,
              opinion: spot.opinion.shortContent,
              rating: this.getAverageRate(spot?.opinion),
              coordinates: spot.coordinates,
              issuedDate: spot.issuedDate,
              address: spot.address,
            };
            if (newSpot === undefined) return;
            const marker = new Marker(newSpot.coordinates, {
              icon: this.getMarkerIcon(),
            });
            let layer: Layer;
            const showSpotComponent =
              this.viewContainerRef.createComponent(ShowSpotComponent);
            showSpotComponent.instance.spot = newSpot;
            this.ngZone.run(() => {
              layer = marker.bindPopup(
                showSpotComponent.location.nativeElement
              );
              this.clusterGroup.addLayer(layer);
              this.clusterGroup.addTo(this.map);
            });
            this.subscriptions.add(
              showSpotComponent.instance.selectedSpot.subscribe(
                (spotToDisplay) => {
                  this.detailSpot = spots.entities[spotToDisplay.id];
                  marker.closePopup();
                }
              )
            );
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
    let finedSpots: SimpleSpot[] = [];
    this.clusterGroup.on('clusterclick', (cluster: any) => {
      finedSpots = [];
      this.map.closePopup();
      for (const marker of cluster.layer.getAllChildMarkers() as Marker[]) {
        this.spots$
          .subscribe((spots) => {
            const finedSpot = spots.find(
              (spot: Spot) =>
                spot.coordinates.lat === marker.getLatLng().lat &&
                spot.coordinates.lng === marker.getLatLng().lng
            );
            if (finedSpot) {
              finedSpots.push({
                id: finedSpot.id,
                opinion: finedSpot.opinion.shortContent,
                rating: this.getAverageRate(finedSpot.opinion),
                coordinates: finedSpot.coordinates,
                issuedDate: finedSpot.issuedDate,
                address: finedSpot.address,
              });
            }
          })
          .unsubscribe();
      }

      this.showSpotsComponent?.destroy();
      this.showSpotsComponent =
        this.viewContainerRef.createComponent(ShowSpotsComponent);
      this.showSpotsComponent.instance.spots = finedSpots;
      this.ngZone.run(() => {
        new Popup()
          .setLatLng(cluster.layer.getLatLng())
          .setContent(this.showSpotsComponent.location.nativeElement)
          .openOn(this.map);
      });
      this.subscriptions.add(
        this.showSpotsComponent.instance.selectedSpot.subscribe(
          (spotToDisplay) => {
            this.spots$.subscribe((spots) => {
              this.detailSpot = spots.find(
                (spot) => spot.id === spotToDisplay.id
              );
            });
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
        issuedDate: new Date(),
        issuedBy: this.authenticationService.stableUser,
        opinion: {
          shortContent: 'Jest to losowo wygenerowana opinia',
          content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          internetRating: this.getRandom(),
          neighborhoodRating: this.getRandom(),
          neighborRating: this.getRandom(),
          communicationRating: this.getRandom(),
        },
        address: {
          streetName: 'string',
          houseNumber: `${this.getRandom(100)}`,
        },
        coordinates: {
          lat: Math.random() * 0.05 + 50.05,
          lng: Math.random() * 0.2 + 19.9,
        } as LatLng,
      });
    }
    this.store.dispatch(new AddSpots({ spots: newSpots }));
  }

  public addSpot(): void {
    const newSpot: Spot = {
      id: Math.floor(Math.random() * 10000),
      issuedDate: new Date(),
      issuedBy: this.authenticationService.stableUser,
      opinion: {
        shortContent: 'los',
        content: 'los',
        internetRating: this.getRandom(),
        neighborhoodRating: this.getRandom(),
        neighborRating: this.getRandom(),
        communicationRating: this.getRandom(),
      },
      address: {
        streetName: 'string',
        houseNumber: `${this.getRandom(100)}`,
      },
      coordinates: {
        lat: Math.random() * 0.05 + 50.05,
        lng: Math.random() * 0.2 + 19.9,
      } as LatLng,
    };
    this.store.dispatch(new AddSpot({ spot: newSpot }));
  }

  private getNewSpotMarkerIcon(): Icon {
    return new Icon({
      iconUrl: '../../assets/addMarker.png',
      iconSize: [30, 40],
      iconAnchor: [20, 40],
      className: 'cs-marker-popup--bg-icon',
    });
  }

  private getMarkerIcon(): Icon {
    return new Icon({
      iconUrl: '../../assets/marker.png',
      iconSize: [40, 40],
      popupAnchor: [0, -40],
      iconAnchor: [20, 40],
      className: 'cs-marker-popup--bg-icon',
    });
  }

  public handleNewSpotSubmit(): void {
    this.map.removeLayer(this.newSpotMarker);
  }

  private getRandom(to: number = 10): number {
    return Math.round(Math.random() * to);
  }
  private getAverageRate(opinion: Opinion | undefined): number {
    return opinion
      ? Math.floor(
          (opinion.internetRating +
            opinion.neighborRating +
            opinion.neighborhoodRating +
            opinion.communicationRating) /
            4
        )
      : 0;
  }
}
