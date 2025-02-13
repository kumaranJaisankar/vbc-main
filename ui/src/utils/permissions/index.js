const CUSTOMER_LIST = {
  TOGGLE_COLUMN: 373,
  KYC_CONFIRMED: 367,
  INSTALLATION: 368,
  ACTIVE: 369,
  EXPIRE: 370,
  SUSPENDED: 371,
  ONLINE: 372,
  BUFFERTIME: 446,
  HOLDBUTTON: 447,
  LIST: 365,
  READ: 12,
  RENEW_PLAN: 445,
  CHANGE_PLAN: 444,
  EXPORT: 304,
  FILTERS: 305,
  PASSWORD: 448,
  ADD_MONEY: 311,
  DISCONNECT: 310,
  NEW_COMPLAINT: 226,
  CUSTOMER_UPDATE: 13,
  CUNSUMPTION_LOGS: 450,
  FRANCHISE_SHIFTING:457,
  AREA_SHIFTING:456,
  EXTENSION:458,
  CLIENT_CN:460,
  // CUSTOMER_STATIC_IP:461,
}

const HELP_DESK = {
  CREATE: 226,
  READ: 227,
  UPDATE: 228,
  EXPORT: 375,
  FILTERS: 376,
  LIST: 374,
  HELPDESK_TICKET_ASSIGN : 454,
  HELPDESK_TICKET_REASSIGN : 455
}

const DASHBOARD = {
  NETWORK: 275,
  LEAD: 276,
  CUSTOMER: 277,
  TICKET: 278,
  PAYMENT: 279
}

const LEAD = {
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  IMPORT: 301,
  EXPORT: 302,
  FILTERS: 303,
}

const ADMINISTRATION = {
  USER_TYPE_EDIT:462,
  USERLIST: 237,
  USERCREATE: 238,
  USERREAD: 239,
  USERUPDATE: 240,
  // role
  ROLELIST: 243,
  NEWROLE: 244,
  MANAGEUSER: 323,
  ROLEREAD: 245,
  ROLEUPDATE: 246,
  // dept
  DEPTLIST: 263,
  DEPTCREATE: 264,
  DEPTREAD: 265,
  DEPTUPDATE: 266,
  // cat
  TICKETCATCREATE: 166,
  TICKETCATREAD: 167,
  TICKETCATUPDATE: 168,
  // subcat
  TICKETSUBCATCREATE: 181,
  TICKETSUBCATREAD: 182,
  TICKETSUBCATUPDATE: 183,
  // priority
  TICKETPARCREATE: 176,
  TICKETPARREAD: 177,
  TICKETPARUPDATE: 178,
  // leadsource
  LEADCREATE: 61,
  LEADREAD: 62,
  LEADUPDATE: 63,
  // leadtype
  LEADTYPECREATE: 66,
  LEADTYPEREAD: 67,
  LEADTYPEUPDATE: 68,
  // zones
  ZONELIST: 253,
  ZONECREATE: 254,
  ZONEREAD: 255,
  ZONEUPDATE: 256,
  // AREA
  AREALIST: 258,
  AREACREATE: 259,
  AREAREAD: 260,
  AREAUPDATE: 261,
  // franchise type
  FRANTYPECREATE: 111,
  FRANTYPEREAD: 112,
  FRANTYPEUPDATE: 113,
  // franchise smsgateway
  FRANSMSCREATE: 106,
  FRANSMSREAD: 107,
  FRANSMSUPDATE: 108,
  // franchise status
  FRANSTATUSCREATE: 101,
  FRANSTATUSREAD: 102,
  FRANSTATUSUPDATE: 103,
  // payment
  // PAYMENTLIST:
  PAYMENTCREATE: 116,
  PAYMENTREAD: 117,
  PAYMENTUPDATE: 118,
}

const NETWORK = {
  // IP Pool
  IPPOOLCREATE: 31,
  IPPOOLREAD: 32,
  IPPOOLUPDATE: 33,

  // optical network NAS

  OPTICALNASCREATE: 26,
  OPTICALNASREAD: 27,
  OPTICALNASUPDATE: 28,
  NAS_LIST:332,
  NAS_TYPE_EDIT:459,
  NAS_BRANCH_EDIT:469,
  IPPOOL_NAS_EDIT:468,
  IPPOOL_RANGE_EDIT:467,
  FRANCHISE_INVOICE_CODE_EDIT:466,
  BRANCH_INVOICE_CODE_EDIT:465,
  BRANCH_CODE_EDIT:464,
  // USER_TYPE_EDIT:462,
  

  // optical network OLT

  OPTICALOLTCREATE: 36,
  OPTICALOLTREAD: 37,
  OPTICALOLTUPDATE: 38,
  OLT_LIST:333,

  // optical network parentDP

  OPTICALPARENTDPCREATE: 41,
  OPTICALPARENTDPREAD: 42,
  OPTICALPARENTDPUPDATE: 43,

  // optical network childDP
  OPTICALCHILDDPCREATE: 46,
  OPTICALCHILDDPREAD: 47,
  OPTICALCHILDDPUPDATE: 48,
  DP_LIST:334,
  // optical network cpe
  OPTICALCPECREATE: 51,
  OPTICALCPEREAD: 52,
  OPTICALCPEUPDATE: 53,
  CPE_LIST:335,
  // RADIUs health check

  RADIUSCREATE: 291,
  RADIUSREAD: 292,
  RADIUSUPDATE: 293

}

const SERVICEPLAN = {
  SERVICECREATE: 71,
  SERVICEREAD: 72,
  SERVICEUPDATE: 73,
  OFFERCREATE: 429,
  OFFERREAD: 430,
  SERVICE_PACKAGE_CREATE:434,
  SERVICE_PACKAGE_STATUS:451
}

// BRANCH
const BRANCH = {
  LIST: 248,
  CREATE: 249,
  READ: 250,
  UPDATE: 251,
  BASICINFO: 419,
  BRANCHWALLET: 420,
  BRANCHLEDGER: 421,
  FILTERS: 391
}

// franchise
const FRANCHISE = {
  LIST: 392,
  EXPORT: 393,
  BASICINFO: 408,
  ASSIGNEDPACK: 409,
  WALLET: 410,
  LEDGER: 411,
  FILTERS: 394,
  CREATE: 6,
  READ: 7,
  UPDATE:8
}
// reports
const REPORTS = {
  ALLREPORTS: 413,
  CUSTOMER: 414,
  FRANCHISE: 415,
  TICKET: 416,
  BILLING: 417,
  DATE_RANGE: 418,
  EXPORT:427,
  NETWORK:417,
}
// history
const LOGINHISTORY = {
  HISTORY: 395
}
const GLOBALSEARCH = {
  SERACH: 318
}
// Finance
const BILLING = {
  BILLING_LIST: 380,
  DATE_SEARCH: 381,
  EXPORT: 382,
  FILTERS: 383,
  SUMMARYTABLE: 384,
}
// WAllet
const WALLET = {
  WALLET_LIST: 385,
  DATE_SEARCH: 386,
  EXPORT: 387,
  FILTERS: 388,
  SUMMARYTABLE: 389,
}

export {
  CUSTOMER_LIST,
  HELP_DESK,
  DASHBOARD,
  LEAD,
  ADMINISTRATION,
  NETWORK,
  SERVICEPLAN,
  BRANCH,
  FRANCHISE,
  REPORTS,
  LOGINHISTORY,
  GLOBALSEARCH,
  BILLING,
  WALLET
};