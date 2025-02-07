import axios from "axios";

var storageToken = localStorage.getItem("token");
var backupStorageToken = localStorage.getItem("backup");
 if (storageToken === null) {
var tokenAccess = ''
}
else{
  var token = JSON && JSON?.parse(storageToken) ;
  var tokenAccess = token && token.access;
}
//for franchise switch when logged in is franchise we need to use admin token where it is in backup
if (backupStorageToken === null) {
  var backuptokenAccess = ''
  }
  else{
    var backuptoken = JSON && JSON.parse(backupStorageToken) ;
    var backuptokenAccess = backuptoken && backuptoken.access;
  }
//ends

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const franchiseaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_FRANCHISE,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}

});

export const helpdeskaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_HELPDESK,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}

});

export const adminaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_ADMIN,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const adminaxiosWithoutToken = axios.create({
  baseURL: process.env.REACT_APP_API_URL_ADMIN
});

export const servicesaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_SERVICES,  
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const networkaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_NETWORK,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
  
});

export const customeraxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_CUSTOMER,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const customeraxiosForm = axios.create({
  baseURL: process.env.REACT_APP_API_URL_CUSTOMER,
  headers: {"Authorization" : `Bearer ${tokenAccess}`, 'content-type': 'application/json'}
});

export const billingaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_BILLING,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const staffaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_STAFF,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
  
});

export const campaignaxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL_CAMPAIGN,
  headers: {"Authorization" : `Bearer ${tokenAccess}`}
});

export const iptvaxios = axios.create({
  baseURL: 'http://125.62.213.82:9081/admin/',
  headers: {"Authorization": `Bearer ${localStorage.getItem('iptvtoken')}`}
});

//for franchise switch when logged in is franchise we need to use admin token where it is in backup
export const adminaxiosFranchiseSwitch = axios.create({
  baseURL: process.env.REACT_APP_API_URL_ADMIN,
  headers: {"Authorization" : `Bearer ${backuptokenAccess}`}
});
export const franchiseaxiosSwitch = axios.create({
  baseURL: process.env.REACT_APP_API_URL_FRANCHISE,
  headers: {"Authorization" : `Bearer ${backuptokenAccess}`}

});
// export const webSocket = axios.create({
//   baseURL: process.env.REACT_APP_WS_URL,
//   headers: {"Authorization" : `Bearer ${tokenAccess}`}
// });