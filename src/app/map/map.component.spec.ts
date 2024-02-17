import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkerClusterGroup, Marker } from 'leaflet';
import { of } from 'rxjs';
import { MapComponent } from './map.component';
import { Spot } from '../core/models/spot.model';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the clusterGroup', () => {
    expect(component.clusterGroup).toBeInstanceOf(MarkerClusterGroup);
  });

  it('should handle the "clusterclick" event', () => {
    // Mock data
    const cluster = {
      layer: {
        getAllChildMarkers: jasmine.createSpy().and.returnValue([
          new Marker({ lat: 0, lng: 0 }),
          new Marker({ lat: 1, lng: 1 }),
        ]),
        getLatLng: jasmine.createSpy().and.returnValue({ lat: 0, lng: 0 }),
      },
    };
    
    const spots = [
      { id: 1, coordinates: { lat: 0, lng: 0 } } as Spot,
      { id:2, coordinates: { lat: 1, lng: 1 } } as Spot,
    ];

    const spots$ = of(spots);

    // Set up component properties
    component.spots$ = spots$;

    // Assertions
    expect(component.map.closePopup).toHaveBeenCalled();
    expect(cluster.layer.getAllChildMarkers).toHaveBeenCalled();
    expect(cluster.layer.getLatLng).toHaveBeenCalled();
    expect(component.showSpotsComponent.instance.spots).toEqual(spots);
    expect(component.ngZone.run).toHaveBeenCalled();
    expect(component.subscriptions.add).toHaveBeenCalled();
  });

  // Add more test cases as needed
});