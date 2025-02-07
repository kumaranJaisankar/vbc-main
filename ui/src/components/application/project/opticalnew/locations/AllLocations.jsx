import React from 'react';

export const AllLocations = (props) => {
  const clientId = '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==';
  const clientSecret = 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb';
  const grantType = 'client_credentials';
  const apiKey = 'f7f45dfbed02afe98e83d034955a78d3';



  const zoom = 8;
  const size = '1920x1080';
  const validMarkers = props.nasLocation
    .filter((marker) => marker.latitude != null && marker.longitude != null)
    .map(({ latitude, longitude }) => ({ lat: latitude, lon: longitude }));
  const markersParam = validMarkers.map((marker) => `${marker.lat},${marker.lon}`).join('|');

  const centerLatitude = validMarkers.reduce((acc, marker) => acc + marker.lat, 0) / validMarkers.length;
  const centerLongitude = validMarkers.reduce((acc, marker) => acc + marker.lon, 0) / validMarkers.length;

  const mapUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/still_image?center=${centerLatitude},${centerLongitude}&zoom=${zoom}&size=${size}&ssf=1&markers=${markersParam}&client_secret=${clientSecret}&client_id=${clientId}&grant_type=${grantType}`;

  return (
    <div style={{ position: 'relative' }}>
      <img src={mapUrl} alt="MapMyIndia Static Map" />

    </div>
  );
};



export const OLtAllLocations = (props) => {
  const clientId = '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==';
  const clientSecret = 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb';
  const grantType = 'client_credentials';
  const apiKey = 'f7f45dfbed02afe98e83d034955a78d3';



  const zoom = 8;
  const size = '1920x1080';
  const validMarkers = props.oltLocation
    .filter((marker) => marker.latitude != null && marker.longitude != null)
    .map(({ latitude, longitude }) => ({ lat: latitude, lon: longitude }));
  const markersParam = validMarkers.map((marker) => `${marker.lat},${marker.lon}`).join('|');

  const centerLatitude = validMarkers.reduce((acc, marker) => acc + marker.lat, 0) / validMarkers.length;
  const centerLongitude = validMarkers.reduce((acc, marker) => acc + marker.lon, 0) / validMarkers.length;

  const mapUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/still_image?center=${centerLatitude},${centerLongitude}&zoom=${zoom}&size=${size}&ssf=1&markers=${markersParam}&client_secret=${clientSecret}&client_id=${clientId}&grant_type=${grantType}`;

  return (
    <div style={{ position: 'relative' }}>
      <img src={mapUrl} alt="MapMyIndia Static Map" />

    </div>
  );
};


export const PdpAllLocations = (props) => {
  const clientId = '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==';
  const clientSecret = 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb';
  const grantType = 'client_credentials';
  const apiKey = 'f7f45dfbed02afe98e83d034955a78d3';


  const zoom = 8;
  const size = '1920x1080';
  const validMarkers = props.pdpLocations
    .filter((marker) => marker.latitude != null && marker.longitude != null)
    .map(({ latitude, longitude }) => ({ lat: latitude, lon: longitude }));
  const markersParam = validMarkers.map((marker) => `${marker.lat},${marker.lon}`).join('|');

  const centerLatitude = validMarkers.reduce((acc, marker) => acc + marker.lat, 0) / validMarkers.length;
  const centerLongitude = validMarkers.reduce((acc, marker) => acc + marker.lon, 0) / validMarkers.length;

  const mapUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/still_image?center=${centerLatitude},${centerLongitude}&zoom=${zoom}&size=${size}&ssf=1&markers=${markersParam}&client_secret=${clientSecret}&client_id=${clientId}&grant_type=${grantType}`;

  return (
    <div style={{ position: 'relative' }}>
      <img src={mapUrl} alt="MapMyIndia Static Map" />

    </div>
  );
};



export const CdpAllLocations = (props) => {
  const clientId = '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==';
  const clientSecret = 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb';
  const grantType = 'client_credentials';
  const apiKey = 'f7f45dfbed02afe98e83d034955a78d3';


  const zoom = 8;
  const size = '1920x1080';
  const validMarkers = props?.cdpLocations
    .filter((marker) => marker.latitude != null && marker.longitude != null)
    .map(({ latitude, longitude }) => ({ lat: latitude, lon: longitude }));
  const markersParam = validMarkers.map((marker) => `${marker.lat},${marker.lon}`).join('|');

  const centerLatitude = validMarkers.reduce((acc, marker) => acc + marker.lat, 0) / validMarkers.length;
  const centerLongitude = validMarkers.reduce((acc, marker) => acc + marker.lon, 0) / validMarkers.length;

  const mapUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/still_image?center=${centerLatitude},${centerLongitude}&zoom=${zoom}&size=${size}&ssf=1&markers=${markersParam}&client_secret=${clientSecret}&client_id=${clientId}&grant_type=${grantType}`;

  return (
    <div style={{ position: 'relative' }}>
      <img src={mapUrl} alt="MapMyIndia Static Map" />

    </div>
  );
};



export const CpeAllLocations = (props) => {
  const clientId = '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==';
  const clientSecret = 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb';
  const grantType = 'client_credentials';
  const apiKey = 'f7f45dfbed02afe98e83d034955a78d3';


  const zoom = 8;
  const size = '1920x1080';
  const validMarkers = props.cpeLocations
    .filter((marker) => marker.latitude != null && marker.longitude != null)
    .map(({ latitude, longitude }) => ({ lat: latitude, lon: longitude }));
  const markersParam = validMarkers.map((marker) => `${marker.lat},${marker.lon}`).join('|');

  const centerLatitude = validMarkers.reduce((acc, marker) => acc + marker.lat, 0) / validMarkers.length;
  const centerLongitude = validMarkers.reduce((acc, marker) => acc + marker.lon, 0) / validMarkers.length;

  const mapUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/still_image?center=${centerLatitude},${centerLongitude}&zoom=${zoom}&size=${size}&ssf=1&markers=${markersParam}&client_secret=${clientSecret}&client_id=${clientId}&grant_type=${grantType}`;

  return (
    <div style={{ position: 'relative' }}>
      <img src={mapUrl} alt="MapMyIndia Static Map" />

    </div>
  );
};


