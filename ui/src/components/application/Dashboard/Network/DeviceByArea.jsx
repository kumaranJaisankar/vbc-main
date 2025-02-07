import React, { useEffect, useRef, useState } from 'react';
import { Card, Input } from 'reactstrap';

const deviceList = ['ChildDp', 'ParentDp', 'Olt', 'Nas', 'Cpe'];

const DeviceByArea = props => {
  const [selectDeviceType, setSelectDeviceType] = useState('Olt');


  const googleMapRef = useRef(null);
  let googleMap = null;

  useEffect(() => {
    googleMap = initGoogleMap();
    var bounds = new window.google.maps.LatLngBounds();
    const deviceLocationsByCategory = props.deviceLocations.filter((d)=>d.category==selectDeviceType);
    deviceLocationsByCategory.map(x => {
      if (x.latitude && x.longitude) {
        const marker = createMarker(x);
        const infowindow = new window.google.maps.InfoWindow({
          content: `<div>
          ${x.name && `<div>Name: <strong>${x.name}</strong></div>`}
          ${x.category && `<div>Category:  <strong>${x.category}</strong></div>`}
          ${x.zone && `<div>Zone:  <strong>${x.zone}</strong></div>`}
          ${x.available_ports && `<div>Available Ports: <strong> ${x.available_ports}</strong></div>`}
          ${x.no_of_ports && `<div>no of ports: <strong>${x.no_of_ports}  </strong></div>`}
      </div>`,
          maxWidth: 200
        });
        infowindow.open(marker.get('deviceByAreaMap'), marker);
        marker.addListener('click', function () {
          infowindow.open(marker.get('deviceByAreaMap'), marker);
        });

        bounds.extend(marker.position);
      }
    });
    googleMap.fitBounds(bounds); // the map to contain all markers
  }, [selectDeviceType]);

  // initialize the google map
  const initGoogleMap = () => {
    return new window.google.maps.Map(googleMapRef.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }


  // create marker on google map
  const createMarker = (markerObj) => new window.google.maps.Marker({
    position: { lat: markerObj.latitude, lng: markerObj.longitude },
    map: googleMap
  });

  return (
    <Card className="device-by-area-map-container" >
      <div className="title">Device Located By Areas</div>
      <div className="input_wrap allocated-devices-dropdown device-by-area-category">
        <Input
          type="select"
          name="allocatedDevice"
          className={`form-control digits ${selectDeviceType ? 'not-empty' : ''}`}
          onChange={(e) => setSelectDeviceType(e.target.value)}
          value={selectDeviceType}
        >
          {deviceList.map((d) => {
            return (
              <option key={d} value={d}>
                {d}
              </option>
            )
          })}


        </Input>
      </div>
      <div id="deviceByAreaMap" ref={googleMapRef} className="device-by-area-map"></div>
    </Card>
  );
};

DeviceByArea.propTypes = {

};

export default DeviceByArea;