// import React, { useState,useEffect, useRef } from "react";
// import MIKROTIK from "../../../../../assets/images/mikrotik.png";
// import axios from 'axios';
// import qs from 'qs';


// var mappls,
//   mapObject = null,
//   newMarker

// function NasLocation(props) {
//   console.log(props,"checksinglemap")
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       const url = 'https://outpost.mapmyindia.com/api/security/oauth/token';
//       const body = qs.stringify({
//         client_id: '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==',
//         client_secret: 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb',
//         grant_type: 'client_credentials'
//       });

//       const options = {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       };

//       try {
//         const response = await axios.post(url, body, options);
//         setData(response.data);
//         initialize(response.data.access_token, () => {
//           afterScriptsLoaded(props);
//           console.log("hiii");
//         });
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };

//     fetchData();
//   }, []);
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const url = 'https://outpost.mapmyindia.com/api/security/oauth/token';
//   //     const body = {
//   //       client_id: '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==',
//   //       client_secret: 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb',
//   //       grant_type: 'client_credentials'
//   //     };

//   //     const options = {
//   //       headers: {
//   //         'Content-Type': 'application/x-www-form-urlencoded'
//   //       }
//   //     };

//   //     try {
//   //       const response = await axios.post('https://outpost.mapmyindia.com/api/security/oauth/token', body, options);
//   //       setData(response.data);
//   //       initialize(response.data.access_token, () => {
//   //         afterScriptsLoaded(props);
//   //         console.log("hiii");
//   //       });
//   //     } catch (error) {
//   //       console.error('Error fetching data: ', error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   const styleMap = { width: "99%", height: "99vh", display: "inline-block" };

//   const mapRef = useRef(null);
// console.log('viewmap')

//   useEffect(() => {
//     if (!mapObject || !props.lead) {
//       return;
//     }
//     if (!("latitude" in props.lead) || !("longitude" in props.lead)) {
//       console.warn("Lead object lacks latitude or longitude");
//       return;
//     }
//     const lat = parseFloat(props.lead.latitude);
//     const lng = parseFloat(props.lead.longitude);
// console.log(lat,"checkpropsdatalat")
//     if (isNaN(lat) || isNaN(lng)) {
//       console.warn("Could not parse latitude or longitude from lead");
//       return;
//     }

//     if (newMarker) {
//       window.mappls.remove({ map: mapObject, layer: newMarker });
//     }
//     setTimeout(() => {
//       mapObject.resize();
//     }, 500);
//     newMarker = new window.mappls.Marker({
//       map: mapObject,
//       position: {
//         lat: lat,
//         lng: lng,
//       },
//       fitbounds: true,
//       popupHtml: `
//       <style>
//       ::-webkit-scrollbar {width: 10px;} 
//       .content {
//         font-family: 'Open Sans', sans-serif;
//       }
//       .key {
//         font-weight: bold; 
//         font-size: 16px;
//       }
//       .value {
//         font-weight: normal; 
//         font-size: 16px;
//       }
//       h2 {
//         margin-bottom: -10px;
//       }
//     </style>
//     <div class="content">
//       <h2><span class="key">Serial No:</span> <span class="value">${
//         props.lead?.serial_no || "N/A"
//       }</span></h2>
//       <h2><span class="key">Device Name:</span> <span class="value">${
//         props.lead?.name || "N/A"
//       }</span></h2>
//       <h2><span class="key">City:</span> <span class="value">${
//         props.lead?.city || "N/A"
//       }</span></h2>
//       <img src="${MIKROTIK}" alt="MIKROTIK"/>
//     </div>    `,
//     });
//     const clickEvent = new MouseEvent('click', {
//       view: window,
//       bubbles: true,
//       cancelable: true,
//     });
//     newMarker.getElement().dispatchEvent(clickEvent);

//   }, [props.lead, mapObject]);

//   const afterScriptsLoaded = (props) => {
//     console.log(props.lead, "test123");
//     console.log("hello");
//     // if (mapObject === null) {
//       console.log("printcheck");
//       mapObject = window.mappls.Map(mapRef.current, {
//         center: [17.385, 78.4867],
//         zoomControl: true,
//         zoom: 12,
//         location: true,
//       });
//       mapObject.addListener("load", function () {
//         mapObject.resize();
//       });
//     // }
//   };

//   const initialize = (mmiToken, loadCallback) => {
//     if (!mmiToken) {
//       console.log("Please pass a token inside initialize()");
//       return;
//     }

//     const mapSDK_url = `https://apis.mappls.com/advancedmaps/api/${mmiToken}/map_sdk?layer=vector&v=3.0`;
//     const plugins_url = `https://apis.mappls.com/advancedmaps/api/${mmiToken}/map_sdk_plugins?v=3.0`;
//     const scriptArr = [mapSDK_url, plugins_url];

//     let count = 0;

//     const recursivelyAddScript = (script) => {
//       if (count < script.length) {
//         const el = document.createElement("script");
//         el.src = script[count];
//         el.async = true;
//         el.type = "text/javascript";
//         document.getElementsByTagName("head")[0].appendChild(el);
//         count = count + 1;
//         el.onload = function () {
//           recursivelyAddScript(script);
//         };
//       } else {
//         return loadCallback();
//       }
//     };

//     recursivelyAddScript(scriptArr);
//   };

//   return (
//     <div>
//       <div id="map" style={styleMap} ref={mapRef}></div>
//     </div>
//   );
// }

// export default NasLocation;
import React, { useState, useEffect, useCallback, useRef } from "react";
import MIKROTIK from "../../../../../assets/images/mikrotik.png";
import axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var mappls, mapObject = null, newMarker;
toast.configure()
function NasLocation(props) {
  console.log(props,"checksinglemap")
  const [data, setData] = useState(null);
  const [hasShownToast, setHasShownToast] = useState(false);
  const styleMap = { width: "99%", height: "99vh", display: "inline-block" };
  const mapRef = useRef(null);

  // Defined outside of useEffect to prevent unnecessary re-renders
  const handleLeadChange = useCallback(() => {
    if (!mapObject || !props.lead) {
      return;
    }
    if (!("latitude" in props.lead) || !("longitude" in props.lead)) {
      console.log("Lead object lacks latitude or longitude");
      return;
    }
    const lat = parseFloat(props?.lead?.latitude);
    const lng = parseFloat(props?.lead?.longitude);
    // if (isNaN(lat) || isNaN(lng)) {
    //   console.warn("Could not parse latitude or longitude from lead");
    //   return;
    // }
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      if (!hasShownToast) {
        toast.error("Invalid Latitude and Longitude.");
        setHasShownToast(true);
      }
      return;
    }
    if (newMarker) {
      window.mappls.remove({ map: mapObject, layer: newMarker });
    }
    setTimeout(() => {
      mapObject.resize();
    }, 500);
    newMarker = new window.mappls.Marker({
      map: mapObject,
      position: {
        lat: lat,
        lng: lng,
      },
      fitbounds: true,
      popupHtml: `
        <style>
        ::-webkit-scrollbar {width: 10px;} 
        .content {
          font-family: 'Open Sans', sans-serif;
        }
        .key {
          font-weight: bold; 
          font-size: 16px;
        }
        .value {
          font-weight: normal; 
          font-size: 16px;
        }
        h2 {
          margin-bottom: -10px;
        }
      </style>
      <div class="content">
        <h2><span class="key">Serial No:</span> <span class="value">${
          props.lead?.serial_no || "N/A"
        }</span></h2>
        <h2><span class="key">Device Name:</span> <span class="value">${
          props.lead?.name || "N/A"
        }</span></h2>
        <h2><span class="key">City:</span> <span class="value">${
          props.lead?.city || "N/A"
        }</span></h2>
        <h2><span class="key">Capacity:</span> <span class="value">${
          props.lead?.no_of_ports || "N/A"
        }</span></h2>
        <h2><span class="key">Available Ports:</span> <span class="value">${
          props.lead?.available_ports || "N/A"
        }</span></h2>
        <img src="${MIKROTIK}" alt="MIKROTIK"/>
      </div>    
      `,
    });
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    newMarker.getElement().dispatchEvent(clickEvent);

  }, [props.lead, mapObject]);

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://outpost.mapmyindia.com/api/security/oauth/token';
      const body = qs.stringify({
        client_id: '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==',
        client_secret: 'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb',
        grant_type: 'client_credentials'
      });
      const options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      try {
        const response = await axios.post(url, body, options);
        setData(response.data);
        initialize(response.data.access_token, () => {
          afterScriptsLoaded(props);
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const afterScriptsLoaded = (props) => {
    console.log(props.lead, "test123");
    console.log("hello");
    mapObject = window.mappls.Map(mapRef.current, {
      center: [17.385, 78.4867],
      zoomControl: true,
      zoom: 12,
      location: true,
    });
    mapObject.addListener("load", function () {
      mapObject.resize();
      handleLeadChange();
    });
  };

  const initialize = (mmiToken, loadCallback) => {
    if (!mmiToken) {
      console.log("Please pass a token inside initialize()");
      return;
    }
    const mapSDK_url = `https://apis.mappls.com/advancedmaps/api/${mmiToken}/map_sdk?layer=vector&v=3.0`;
    const plugins_url = `https://apis.mappls.com/advancedmaps/api/${mmiToken}/map_sdk_plugins?v=3.0`;
    const scriptArr = [mapSDK_url, plugins_url];
    let count = 0;
    const recursivelyAddScript = (script) => {
      if (count < script.length) {
        const el = document.createElement("script");
        el.src = script[count];
        el.async = true;
        el.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(el);
        count = count + 1;
        el.onload = function () {
          recursivelyAddScript(script);
        };
      } else {
        return loadCallback();
      }
    };
    recursivelyAddScript(scriptArr);
  };

  useEffect(handleLeadChange, [handleLeadChange]);

  return (
    <div>
      <div id="map" style={styleMap} ref={mapRef}></div>
    </div>
  );
}

export default NasLocation;
