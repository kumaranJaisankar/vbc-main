import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import qs from 'qs';
var mappls, mapObject = null, clusterMarker;

function ClusterMarkers(props) {
  const [token, setToken] = useState(null);
  console.log(props.nasLocation, "gettingnasdata");
  console.log("function");

  const styleMap = { width: "99%", height: "99vh", display: "inline-block" };

  const mapRef1 = useRef(null);
  useEffect(() => {
    if (clusterMarker) {
      window.mappls.remove({ map: mapObject, layer: clusterMarker });
    }
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
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if(token) {
      initialize(token, () => {
        // if (clusterMarker) {
        //   window.mappls.remove({ map: mapObject, layer: clusterMarker });
        // }    
        console.log("hiii");
        afterScriptsLoaded(props);
      });
    }
  }, [token]);

  // useEffect(() => {
  //   // if (!mapObject || !props.nasLocation) {
  //   //   return;
  //   // }

   
  // }, [props.nasLocation, mapObject]);

  const afterScriptsLoaded = (props) => {
    // if (clusterMarker) {
    //   window.mappls.remove({ map: mapObject, layer: clusterMarker });
    // }
    // if (mapObject === null) {
      mapObject = window.mappls.Map(mapRef1.current, {
        center: [17.385, 78.4867],
        zoomControl: true,
        zoom: 12,
        location: true,
      });

      mapObject.addListener("load", function () {
        console.log(props.nasLocation,"checkdsata")
        mapObject.resize();
         const all_data = props.nasLocation.map((location) => ({
      type: "Feature",
      properties: {
        htmlPopup: location.branch,
        "icon-size1": 0.55,
      },
      geometry: {
        type: "Point",
        coordinates: [location.latitude, location.longitude],
      },
    }));

    if (clusterMarker) {
      window.mappls.remove({ map: mapObject, layer: clusterMarker });
    }

    clusterMarker = new window.mappls.Marker({
      map: mapObject,
      position: {
        id: "ravi",
        type: "FeatureCollection",
        features: all_data,
      },
      icon_url: "https://apis.mapmyindia.com/map_v3/2.png",
      clusters: true,
      fitbounds: true,
    });
      });
    // }
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

  return (
    <div>
      <div id="map1" style={styleMap} ref={mapRef1}></div>
    </div>
  );
}

export default ClusterMarkers;
