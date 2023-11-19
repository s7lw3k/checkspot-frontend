import { Injectable } from '@angular/core';
import { LatLng, Popup } from 'leaflet';

@Injectable({ providedIn: 'root' })
export class PopupService {
	popup: Popup;
	constructor() {}

	public closePopup(): void {
		this.popup.close();
	}

	set newPopup(popup: Popup) {
		this.popup = popup;
	}
}
