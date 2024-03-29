import React from "react";
import { MapContainer, TileLayer, Popup, Marker, Polyline } from 'react-leaflet';


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
    iconAnchor: new L.Point(5, 5),
});


export default function Map(props) {
  // constant controls how many waypoints are generated. Larger number = less waypoints
  const DIV = props.granularity;
  const coordinates = props.json["GIS_coordinates"];
  

  const GenerateMarkers = (array) => {
    const timeRatio = props.json["time_taken"] / coordinates.length;
    return array.map( (coord, id) => {
      return (
        <Marker position={[coord[0], coord[1]]} key={id} >
            <Popup>
              {secondsToDhms(id*DIV*timeRatio)} 
              <br />
              {/* MUST CHANGE VALUE OF 400 IF SHORTENED SOC ARRAY LENGTH CHANGED */}
              state of charge: {Math.round(props.json["state_of_charge"][Math.round(id*DIV*timeRatio/400)]*100)}%
              <br />  
              distance: {Math.round(props.json["distances"][Math.round(id*DIV*timeRatio/400)])}km
            </Popup>
        </Marker>
      );
    })
  }
    
  if(coordinates) {
    // shortened coordinate array
    const coords = coordinates.filter((el, n) => n % DIV === DIV-1);
    const colorOptions = { color: '#085cb4' }
    return (
        // Important! Always set the container height explicitly
        <div>
           <MapContainer id='MapCont' center={[coordinates[0][0], coordinates[0][1]]} zoom={8} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline pathOptions={colorOptions} positions={coords} />
            {GenerateMarkers(coords)}
          </MapContainer>
        </div>
      );
  } else {
    // TODO replace with icon
    return (<div>RUN SIMULATION TO DISPLAY MAP</div>)
  }
}


