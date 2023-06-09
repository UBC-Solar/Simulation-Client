import React from "react";
import GoogleMapReact from 'google-map-react';

export default function Map(props) {
    const coordinates = props.coordinates;

    const defaultProps = {
        center: {
          lat: 10.99835602,
          lng: 77.01502627
        },
        zoom: 11
      };
      
      if(coordinates) {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAEIKfbYWSmSxWjXglP_taDZAOndjARt_4" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
              >
                <div lat={10.99835602} lng={77.01502627}> HELLOOOOOO </div>
              </GoogleMapReact>
            </div>
          );
      } else {
        return (<div>RUN SIMULATION TO DISPLAY MAP</div>)
      }
}

const Marker = props => {
  return <div className="SuperAwesomePin"></div>
}
