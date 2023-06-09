import React from "react";
import { MapContainer, TileLayer, useMap, Popup, Marker, Polyline} from 'react-leaflet';


import 'leaflet/dist/leaflet.css';
import secondsToDhms from '../HelperFunctions/TimeString'

// Change Marker settings
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('../Images/blueCircle.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: new L.Point(10, 10),
    shadowSize: new L.Point(0,0),
    iconAnchor: new L.Point(10, 10),
});


export default function Map(props) {
  // constant controls how many waypoints are generated. Larger number = less waypoints
  const DIV = props.granularity;

  let coordinates = props.coordinates;

  const GenerateMarkers = (array) => {
    return array.map( (coord, id) => {
      return (
        <Marker position={[coord[0], coord[1]]} key={id} >
            <Popup>
              lat: {coord[0]} <br /> lng: {coord[1]} <br /> {secondsToDhms(id*DIV)}
            </Popup>
        </Marker>
      );
    })
  }
    
  if(coordinates) {
    const coords = coordinates.filter((el, n) => n % DIV === 0);
    const blackOptions = { color: '#085cb4' }
    return (
        // Important! Always set the container height explicitly
        <MapContainer id='MapCont' center={[coordinates[0][0], coordinates[0][1]]} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline pathOptions={blackOptions} positions={coords} />
          {GenerateMarkers(coords)}
        </MapContainer>
      );
  } else {
    return (<div>RUN SIMULATION TO DISPLAY MAP</div>)
  }
}


