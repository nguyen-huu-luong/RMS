"use client";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import React, { useState, useEffect } from "react";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import MapMarkerIcon from "../../../public/marker.png";

const customIcon = new L.Icon({
  iconUrl: MapMarkerIcon.src,
  iconSize: [35, 35],
});

const default_lat = 10.772148767808112;
const default_lon = 106.65794471088427;

const Map = ({ form, setFee }: { form: any; setFee: any }) => {
    const [coord, setCoord] = useState<LatLngTuple>([
        10.772148767808112, 106.65794471088427,
    ]);
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>([
        10.772148767808112, 106.65794471088427,
    ]);
    const [searchResult, setSearchResult] = useState<{
        name?: string;
        lat: number;
        lon: number;
    } | null>({
        lat: 51.505,
        lon: -0.09,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [address, setAddress] = useState("");

    const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setCoord([lat, lng]);
    };
    const [distance, setDistance] = useState<any>(0);
    useEffect(() => {
        calculateDistance();
    }, [markerPosition]);
    useEffect(() => {
        getUserLocation();
    }, []);
    const getUserLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCoord([latitude, longitude]);
            setMarkerPosition([latitude, longitude]);
            calculateDistance();
        });
    };
    const UseMapEventsWrapper = ({
        handleMapClick,
    }: {
        handleMapClick: any;
    }) => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };
    function getShippingCost(distance: any) {
        const roundedDistance = Math.ceil(distance);
        if (roundedDistance <= 5) {
            return 0;
        } else if (roundedDistance <= 10) {
            return 20000;
        } else if (roundedDistance <= 20) {
            return 35000;
        } else {
            const extraDistance = roundedDistance - 20;
            const additionalCost = extraDistance * 4000;
            return 35000 + additionalCost;
        }
    }
    const calculateDistance = async () => {
        let latlng1 = L.latLng(markerPosition[0], markerPosition[1]);
        let latlng2 = L.latLng(default_lat, default_lon);
        let dist = latlng1.distanceTo(latlng2) / 1000;
        if (
            markerPosition[0] != 10.772148767808112 &&
            markerPosition[1] != 106.65794471088427
        ) {
            form.setFieldsValue({
                address: await getLocationName(),
            });
        }
        setFee(getShippingCost(dist));
        setDistance(dist);
    };
    function MyComponent() {
        const map = useMap();
        map.setView(coord);
        return null;
    }
    const getLocationName = async () => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerPosition[0]}&lon=${markerPosition[1]}`
            );
            if (response.data && response.data.display_name) {
                const locationName = response.data.display_name;
                setAddress(locationName);
                return locationName;
            } else {
                return "Unknown Location";
            }
        } catch (error) {
            console.error("Error getting location name:", error);
            return;
        }
    };
    // Map search
    const handleSearch = async () => {
        try {
            const values = form.getFieldsValue();
            setSearchTerm(values.address);
            if (!values.address) {
                form.setFieldsValue({
                    address: await getLocationName(),
                });
            } else {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${values.address}`
                );
                if (response.data.length > 0) {
                    const result = response.data[0];
                    setCoord([parseFloat(result.lat), parseFloat(result.lon)]);
                    setMarkerPosition([
                        parseFloat(result.lat),
                        parseFloat(result.lon),
                    ]);
                    form.setFieldsValue({
                        address: result.display_name,
                    });
                    console.log(response);
                }
            }
            return;
        } catch (error) {
            console.error("Error searching location:", error);
        }
    };
    return (
        <div className="z-0">
            <MapContainer
                style={{
                    height: "250px",
                    width: "100%",
                    zIndex: 0,
                }}
                center={coord}
                zoom={20}
                scrollWheelZoom={true}
            >
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <Marker position={markerPosition} icon={customIcon}>
                    <Popup>Your location!</Popup>
                </Marker>
                <UseMapEventsWrapper handleMapClick={handleMapClick} />
                <MyComponent />
            </MapContainer>
        </div>
    );
};

export default Map;
