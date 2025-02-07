import {
  Home,
  Box,
  Rss,
  Users,
  Cpu,
  Settings,
  CreditCard,
  Globe,
  UserPlus,
  Layers,
  BarChart,
  Bell,
} from "react-feather";

export const MENUITEMS = [
  {
    path: `${process.env.PUBLIC_URL}/app/dashboard`,
    icon: Home,
    title: "Dashboard",
    type: "link",
    id: 1,
    permissionId: 281,
    active: false,
  },
  // {
  //   title: "Administration",
  //   icon: Box,
  //   id: 2,
  //   permissionId: 320,
  //   type: "sub",
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     {
  //       id: 21,
  //       permissionId: 321,
  //       path: `${process.env.PUBLIC_URL}/app/administration/adminuser/adminusers`,
  //       type: "link",
  //       title: "Users",
  //     },
  //     {
  //       icon: Settings,
  //       title: "Services",
  //       type: "sub",
  //       id: 4,
  //       permissionId: 337,
  //       active: false,
  //       children: [
  //         // {
  //         //   id: 41,
  //         //   permissionId: 338,
  //         //   path: `${process.env.PUBLIC_URL}/app/services/serviceplan`,
  //         //   title: 'Internet',
  //         //   type: 'link'
  //         // },
  //         {
  //           id: 41,
  //           permissionId: 338,
  //           path: `${process.env.PUBLIC_URL}/app/services/newservicelist`,
  //           title: "Internet",
  //           type: "link",
  //         },
  //         {
  //           id: 42,
  //           // permissionId: 341,
  //           path: `${process.env.PUBLIC_URL}/app/services/iptvplan`,
  //           title: "IPTV",
  //           type: "link",
  //         },
  //         // {id: 44,
  //         //   permissionId: 428,
  //         //   path: `${process.env.PUBLIC_URL}/app/services/newiptvplan`,
  //         //   title: 'NEW IPTV',
  //         //   type: 'link'
  //         // },
  //         {
  //           id: 43,
  //           permissionId: 348,
  //           path: `${process.env.PUBLIC_URL}/app/services/Combo`,
  //           title: "Combo",
  //           type: "link",
  //         },
  //         {
  //           id: 44,
  //           permissionId: 428,
  //           path: `${process.env.PUBLIC_URL}/app/services/offerlist`,
  //           title: "Add Offer",
  //           type: "link",
  //         },
  //         {
  //           id: 44,
  //           permissionId: 338,
  //           path: `${process.env.PUBLIC_URL}/app/services/Cable/cable`,
  //           title: "CATV/IPTV",
  //           type: "link",
  //         },
  //         {
  //           id: 44,
  //           permissionId: 338,
  //           path: `${process.env.PUBLIC_URL}/app/services/OTT/ott`,
  //           title: "OTT",
  //           type: "link",
  //         },

  //         // {
  //         //   // id: 43,
  //         //   // permissionId: 348,
  //         //   path: `${process.env.PUBLIC_URL}/app/services/newofferlist`,
  //         //   title: 'Add New Offer',
  //         //   type: 'link'
  //         // },
  //       ],
  //     },
  //     {
  //       id: 22,
  //       permissionId: 322,
  //       path: `${process.env.PUBLIC_URL}/app/administration/roles`,
  //       type: "link",
  //       title: "Roles and Permissions",
  //     },
  //     // {
  //     //   id: 23,
  //     //   permissionId: 324,
  //     //   path: `${process.env.PUBLIC_URL}/app/administration/department`,
  //     //   type: "link",
  //     //   title: "Department",
  //     // },
  //     {
  //       id: 24,
  //       permissionId: 325,
  //       title: "Tickets",
  //       type: "sub",
  //       children: [
  //         {
  //           id: 241,
  //           permissionId: 396,
  //           title: "Category",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/ticketing/category`,
  //         },
  //         {
  //           id: 242,
  //           permissionId: 397,
  //           title: "Sub Category",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/ticketing/subcategory`,
  //         },
  //         {
  //           id: 243,
  //           permissionId: 398,
  //           title: "Priority",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/ticketing/priority`,
  //         },
  //       ],
  //     },
  //     {
  //       id: 25,
  //       permissionId: 399,
  //       title: "Leads",
  //       type: "sub",
  //       children: [
  //         {
  //           id: 251,
  //           permissionId: 400,
  //           title: "Lead Source",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/leads/leadsource`,
  //         },
  //         {
  //           id: 252,
  //           permissionId: 401,
  //           title: "Lead Type",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/leads/leadtype`,
  //         },
  //       ],
  //     },
  //     {
  //       id: 26,
  //       permissionId: 326,
  //       title: "Zone Configuration",
  //       type: "sub",
  //       children: [
  //         {
  //           id: 261,
  //           permissionId: 402,
  //           title: "Zones",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/zone`,
  //         },
  //         {
  //           id: 262,
  //           permissionId: 403,
  //           title: "Area",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/area`,
  //         },
  //       ],
  //     },
  //     {
  //       id: 27,
  //       permissionId: 327,
  //       title: "Franchise",
  //       type: "sub",
  //       children: [
  //         // {
  //         //   id: 271,
  //         //   permissionId: 404,
  //         //   title: "Role",
  //         //   type: "link",
  //         //   path: `${process.env.PUBLIC_URL}/app/administration/adminfranchise/franchiserole`,
  //         // },
  //         {
  //           id: 272,
  //           permissionId: 405,
  //           title: "Type",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/adminfranchise/franchisetype`,
  //         },
  //         {
  //           id: 273,
  //           permissionId: 406,
  //           title: "SMS Gateway",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/adminfranchise/smsgateway`,
  //         },
  //         {
  //           id: 274,
  //           permissionId: 407,
  //           title: "Status",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/app/administration/adminfranchise/status`,
  //         },
  //       ],
  //     },

  //     {
  //       id: 28,
  //       permissionId: 328,
  //       path: `${process.env.PUBLIC_URL}/app/administration/payment/paymentlist`,
  //       type: "link",
  //       title: "Payment Configuration",
  //     },
  //   ],
  // },
  {
    id: 21,
    permissionId: 321,
    icon: Users,
    path: `${process.env.PUBLIC_URL}/app/administration/gitamuser/gitamusers`,
    type: "link",
    title: "Users",
    active: false,
  },
  {
    icon: Settings,
    title: "Services",
    type: "sub",
    id: 4,
    permissionId: 337,
    active: false,
    children: [
      {
        id: 41,
        permissionId: 338,
        path: `${process.env.PUBLIC_URL}/app/services/newservicelist`,
        title: "Internet Plans",
        type: "link",
      },
    ],
  },
  // {
  //   title: "Administration",
  //   icon: Box,
  //   id: 20,
  //   permissionId: 320,
  //   type: "sub",
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     {
  //       id: 21,
  //       permissionId: 321,
  //       path: `${process.env.PUBLIC_URL}/app/administration/gitamuser/gitamusers`,
  //       type: "link",
  //       title: "Users",
  //     },
  //     {
  //       icon: Settings,
  //       title: "Services",
  //       type: "sub",
  //       id: 4,
  //       permissionId: 337,
  //       active: false,
  //       children: [
  //         {
  //           id: 41,
  //           permissionId: 338,
  //           path: `${process.env.PUBLIC_URL}/app/services/newservicelist`,
  //           title: "Internet",
  //           type: "link",
  //         },
  //       ],
  //     },
  //     {
  //       id: 22,
  //       permissionId: 322,
  //       path: `${process.env.PUBLIC_URL}/app/administration/roles`,
  //       type: "link",
  //       title: "Roles and Permissions",
  //     },
  //   ],
  // },
  // {
  //   title: "Network",
  //   icon: Rss,
  //   permissionId: 329,
  //   type: "sub",
  //   id: 3,
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     {
  //       id: 31,
  //       permissionId: 330,
  //       path: `${process.env.PUBLIC_URL}/app/radiuscpanel/ippool`,
  //       icon: Users,
  //       title: "IP Pool",
  //       type: "link",
  //     },

  //     {
  //       id: 32,
  //       permissionId: 331,
  //       path: `${process.env.PUBLIC_URL}/app/project/opticalnew/all`,
  //       icon: Users,
  //       title: "Optical Network",
  //       type: "link",
  //     },
  //     {
  //       // id: 33,
  //       permissionId: 336,
  //       path: `${process.env.PUBLIC_URL}/app/project/opticalnew/opticalheathcheck/radiushealthcheck`,
  //       icon: Users,
  //       title: "Radius Health Check",
  //       type: "link",
  //     },
  //     // {
  //     //   title: "Finance",
  //     //   icon: CreditCard,
  //     //   type: "sub",
  //     //   badgetxt: "New",
  //     //   active: false,
  //     //   children: [
  //     //     {
  //     //       path: `${process.env.PUBLIC_URL}/app/billingandpayments/billing`,
  //     //       icon: Users,
  //     //       title: "Billing History",
  //     //       type: "link",
  //     //     },

  //     //     // ...(Showwallet
  //     //     //   ? [
  //     //           {
  //     //             path: `${process.env.PUBLIC_URL}/app/wallets/wallet`,
  //     //             icon: Users,
  //     //             title: "Wallet",
  //     //             type: "link",
  //     //           },
  //     //       //   ]
  //     //       // : []),
  //     //       // ...(Showwallet
  //     //       //   ? [
  //     //             {
  //     //               path: `${process.env.PUBLIC_URL}/app/wallets/newwallet`,
  //     //               icon: Users,
  //     //               title: "New Wallet",
  //     //               type: "link",
  //     //             },
  //     //         //   ]
  //     //         // : []),
  //     //   ],
  //     // },
  //     // {
  //     //   path: `${process.env.PUBLIC_URL}/app/ticket/all`,
  //     //   icon: Cpu,
  //     //   title: "Ticket",
  //     //   type: "link",
  //     // },
  //   ],
  // },

  // {
  //   path: `${process.env.PUBLIC_URL}/app/leads/leadsContainer`,
  //   icon: UserPlus,
  //   active: false,
  //   id: 5,
  //   permissionId: 349,
  //   title: "Leads",
  //   type: "link",
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/leads/NewLeadList`,
  //   icon: UserPlus,
  //   active: false,
  //   id: 6,
  //   permissionId: 349,
  //   title: "New Leads",
  //   type: "link",
  // },
  // {
  //   title: "Customers",
  //   icon: Users,
  //   id: 7,
  //   permissionId: 363,
  //   type: "sub",
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     // {
  //     //   id: 71,
  //     //   permissionId: 364,
  //     //   path: `${process.env.PUBLIC_URL}/app/customermanagement/kycform`,
  //     //   icon: Users,
  //     //   title: "KYC form",
  //     //   type: "link",
  //     // },
  //     {
  //       id: 71,
  //       permissionId: 364,
  //       path: `${process.env.PUBLIC_URL}/app/customermanagement/kycform`,
  //       icon: Users,
  //       title: "KYC Form",
  //       type: "link",
  //     },
  //     {
  //       id: 72,
  //       permissionId: 365,
  //       path: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists`,
  //       icon: Users,
  //       title: "Customer List",
  //       type: "link",
  //     },
  //   ],
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/ticket/all`,
  //   icon: Cpu,
  //   id: 8,
  //   permissionId: 374,
  //   title: "Complaints",
  //   type: "link",
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/internaltickets/newticket`,
  //   icon: Cpu,
  //   id: 8,
  //   permissionId: 374,
  //   title: "New Help Desk",
  //   type: "link",
  // },
  // {
  //   title: "Finance",
  //   icon: CreditCard,
  //   id: 9,
  //   permissionId: 379,
  //   type: "sub",
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     // {
  //     //   id: 91,
  //     //   permissionId: 380,
  //     //   path: `${process.env.PUBLIC_URL}/app/billingandpayments/billing`,
  //     //   icon: Users,
  //     //   title: "Billing History",
  //     //   type: "link",
  //     // },
  //     {
  //       id: 91,
  //       permissionId: 380,
  //       path: `${process.env.PUBLIC_URL}/app/billingupdates/billingfields`,
  //       icon: Users,
  //       title: " Billing History",
  //       type: "link",
  //     },
  //     // {
  //     //   id: 92,
  //     //   permissionId: 385,
  //     //   path: `${process.env.PUBLIC_URL}/app/wallets/wallet`,
  //     //   icon: Users,
  //     //   title: "Wallet",
  //     //   type: "link",
  //     // },
  //     {
  //       id: 92,
  //       permissionId: 385,
  //       path: `${process.env.PUBLIC_URL}/app/wallets/newwallet`,
  //       icon: Users,
  //       title: "Wallet",
  //       type: "link",
  //     },
  //   ],
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/administration/branch`,
  //   icon: Layers,
  //   id: 10,
  //   permissionId: 390,
  //   title: "Branch",
  //   type: "link",
  //   active: false,
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/franchise/franchise-list`,
  //   icon: Globe,
  //   id: 11,
  //   permissionId: 392,
  //   active: false,
  //   title:
  //     localStorage.getItem("token") &&
  //     JSON.parse(localStorage.getItem("token"))?.user_type === "Franchise Owner"
  //       ? "Franchise Profile"
  //       : "Franchise",
  //   type: "link",
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/franchise/TestFranchise/TestFranchiselist`,
  //   icon: Globe,
  //   id: 11,
  //   permissionId: 392,
  //   active: false,
  //   title:
  //     localStorage.getItem("token") &&
  //       JSON.parse(localStorage.getItem("token")).user_type ===
  //       "Franchise Owner"
  //       ? "Franchise Profile"
  //       : "Test Franchise",
  //   type: "link",
  // },
  // Menu Path for NewFranchise by Marieya
  // {
  //   path: `${process.env.PUBLIC_URL}/app/franchise/NewFranchise/NewFranchise`,
  //   icon: Globe,
  //   id: 11,
  //   permissionId: 392,
  //   title:
  //     localStorage.getItem("token") &&
  //     JSON.parse(localStorage.getItem("token")).user_type === "Franchise Owner"
  //       ? "Franchise Profile"
  //       : "Franchise",
  //   type: "link",
  // },

  // {
  //   path: `${process.env.PUBLIC_URL}/app/franchise/franchise-list`,
  //   icon: Globe,
  //   id: 11,
  //   permissionId: 392,
  //   active: false,
  //   title:
  //     localStorage.getItem("token") &&
  //     JSON.parse(localStorage.getItem("token"))?.user_type === "Franchise Owner"
  //       ? "Franchise Profile"
  //       : "Franchise",
  //   type: "link",
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/newreports/newreportcards`,
  //   icon: BarChart,
  //   title: "Reports",
  //   type: "link",
  //   id: 12,
  //   permissionId: 412,
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/promotions/push_notification`,
  //   icon: Bell,
  //   title: "Promotions",
  //   type: "link",
  //   id: 12,
  //   badgetxt: "New",
  //   // permissionId: 412,
  //   permissionId: 470,
  // },
  // {
  //   path: `${process.env.PUBLIC_URL}/app/Reports/Reports/allreports`,
  //   icon: BarChart,
  //   title: "Reports",
  //   type: "link",
  //   id: 13,
  //   permissionId: 412,
  // },
  // (localStorage.getItem("token") &&
  //   JSON.parse(localStorage.getItem("token"))?.user_type === "Admin") ||
  // JSON.parse(localStorage.getItem("token"))?.user_type === "Super Admin"
  //   ? {
  //       path: `${process.env.PUBLIC_URL}/app/logs/login_history`,
  //       icon: Users,
  //       id: 14,
  //       permissionId: 395,
  //       active: false,
  //       title: "Login History",
  //       type: "link",
  //     }
  //   : "",
  //Communication added by Marieya

  // {
  //   title: "Campaign",
  //   icon: Users,
  //   id: 12,
  //   permissionId: 412,
  //   type: "sub",
  //   badgetxt: "New",
  //   active: false,
  //   children: [
  //     {
  //       path: `${process.env.PUBLIC_URL}/app/communications/communication`,
  //       icon: BarChart,
  //       title: "Communication",
  //       type: "link",
  //       id: 12,
  //       permissionId: 412,
  //     },
  //     // {
  //     //   id: 72,
  //     //   permissionId: 365,
  //     //   path: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists`,
  //     //   icon: Users,
  //     //   title: "Customer List",
  //     //   type: "link",
  //     // },
  //   ],
  // },
];
