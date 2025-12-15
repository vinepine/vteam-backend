/* global L */

import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

export default class ScooterMap extends HTMLElement {
    constructor() {
        super();
        this.markers = new Map();
        this.map = null;
    }

    async connectedCallback() {
        this.innerHTML = `<div id="map" class="map"></div>`;
        this.renderMap();
        this.loadScooters();
        this.initSocket();
    }

    renderMap() {
        this.map = L.map("map").setView([55.6050, 13.0038], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(this.map);
    }

    async loadScooters() {
        const response = await fetch("/v1/bike");
        const data = await response.json();

        data.scooters.forEach(scooters => {

            const [lat, lng] = scooters.coordinates.split(",");

            const marker = L.marker([lat, lng]).addTo(this.map);

            this.markers.set(scooters.scooter_id, marker);
        });
    }

    initSocket() {
        const socket = io("http://localhost:3000");
        const scooterIcon = L.icon({
            iconUrl: "/img/scooter_pin.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        socket.on("scooter-update", (data) => {
            const { id, lat, lng } = data;

            if (this.markers.has(id)) {
                this.markers.get(id).setLatLng([lat, lng]);
            } else {
                const marker = L.marker([lat, lng], { icon: scooterIcon }).addTo(this.map);
                this.markers.set(id, marker);
            }
        });
    }
}
