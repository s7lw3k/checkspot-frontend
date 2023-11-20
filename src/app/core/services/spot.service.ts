import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Spot } from '../models/spot.model';
import { LatLng, MarkerClusterGroup } from 'leaflet';
import { environment } from '../../consts';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { AddSpot } from '../store/spot/spot.action';

@Injectable({ providedIn: 'root' })
export class SpotService implements OnDestroy {
  newCords: LatLng;
  private subscriptions: Subscription = new Subscription();
  private _clusterGroup: MarkerClusterGroup;
  constructor(private http: HttpClient, private store: Store<AppState>) {}

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
    const newSpot: Spot = {
      id: Math.floor(Math.random() * 10000),
      name: name,
      des: description,
      coordinates: this.newCords,
    };
    this.store.dispatch(new AddSpot({ spot: newSpot }));
  }

  set cords(cords: LatLng) {
    this.newCords = cords;
  }
}
