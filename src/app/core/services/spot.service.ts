import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Spot } from '../models/spot.model';
import { LatLng, Marker, Map as lMap, MarkerClusterGroup } from 'leaflet';
import { environment } from '../../consts';
import { Address } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class SpotService implements OnDestroy {
  newCords: LatLng;
  private map: lMap;
  private subscriptions: Subscription = new Subscription();
  private _clusterGroup: MarkerClusterGroup;
  constructor(private http: HttpClient) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public get points(): Observable<Spot[]> {
    return this.http.get<Spot[]>(`${environment.apiUrl}/spot/all`);
  }

  public set clusterGroup(newClusterGroup: MarkerClusterGroup) {
    this._clusterGroup = newClusterGroup;
  }
  public get clusterGroup() {
    return this._clusterGroup;
  }

  public createSpot(name: string, description: string): void {
    // const address = this.http.get<any>(
    // 	`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.newCords.lat}&lon=${this.newCords.lng}`
    // );
    const newAddress: Address = {
      id: Math.floor(Math.random() * 100),
      streetName: '',
      houseNumber: '',
      apartmentNumber: 0,
      floor: '',
    };
    const newCords = this.newCords;
    const newSpot = {
      id: Math.floor(Math.random() * 100),
      name,
      des: description,
      address: newAddress,
      coordinates: newCords,
    };
    const marker = new Marker(newCords);
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

  public test() {}

  set cords(cords: LatLng) {
    this.newCords = cords;
  }

  set newMap(map: lMap) {
    this.map = map;
  }
}
