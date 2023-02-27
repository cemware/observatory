import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { LatLngExpression, icon, Marker as IMarker, geoJSON } from 'leaflet';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import { useTranslation } from "react-i18next";

const MARKER_ICON = icon({ iconUrl: markerIcon });

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  onChangePosition(latLng: { lat: number, lng: number }): void;
}
export const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude, longitude, onChangePosition,
}) => {
  const center = useMemo<LatLngExpression>(() => [latitude, longitude], [latitude, longitude]);
  const markerRef = useRef<IMarker>(null);
  const { t } = useTranslation();
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression>([latitude, longitude]);

  const eventHandlers = useMemo(() => ({
    dragend() {
      if (markerRef.current) {
        const latLng = markerRef.current.getLatLng();
        setMarkerPosition(latLng);
        onChangePosition({ lat: latLng.lat, lng: latLng.lng });
      }
    },
  }), []);

  useEffect(() => {
    setMarkerPosition([latitude, longitude]);
  }, [latitude, longitude]);

  return (
    <Wrapper>
      <MapContainer center={center} zoom={6}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={markerPosition}
          icon={MARKER_ICON}
          draggable
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup>
            {t('드래그하여 관측 위치를 바꿀 수 있습니다.')}
          </Popup>
        </Marker>
      </MapContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 300px;
  height: 300px;
  position: relative;

  > div {
    height: 100%;
  }
`;