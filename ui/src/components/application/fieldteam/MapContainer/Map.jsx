import React, { useState, useEffect } from "react";
//import Header from "components/Header";

import { MapContainer, TileLayer, FeatureGroup,Marker,Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import osm from "../osm-providers";
import { useRef } from "react";
import useWindowDimensions from './windowDimensions';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import axios from "axios";

const PolygonMap = (props) => {
  const [center, setCenter] = useState({ lat:17.3850, lng: 78.4867 });
  const [mapLayers, setMapLayers] = useState([]);

  const ZOOM_LEVEL = 12;
  const mapRef = useRef();

  useEffect(()=>{

window.dispatchEvent(new Event('resize'));
  })


  const _onCreate = (e) => {
    console.log(e);

    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const _onEdited = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };

  const _onDeleted = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

 

  return (
    <>
      <div title="React Leaflet - Polygon" />

    

          {/* <div className="col"  style={{height: '100vh',width:"100%"}}> */}
            {/* <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} >
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={_onCreate}
                  onEdited={_onEdited}
                  onDeleted={_onDeleted}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                  }}
                />
              </FeatureGroup>
              <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
            </MapContainer> */}
    
            <MapContainer scrollWheelZoom={false} center={center} zoom={ZOOM_LEVEL} ref={mapRef} style={{height:"630px"}}
            whenReady={()=>window.dispatchEvent(new Event('resize'))}
            whenCreated={()=>window.dispatchEvent(new Event('resize'))}>
            {/* <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={_onCreate}
                  onEdited={_onEdited}
                  onDeleted={_onDeleted}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                  }}
                />
              </FeatureGroup> */}
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {/* <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker> */}

</MapContainer>

            {/* <pre className="text-left">{JSON.stringify(mapLayers, 0, 2)}</pre> */}
          {/* </div> */}
      
   
    </>
  );
};

export default PolygonMap;