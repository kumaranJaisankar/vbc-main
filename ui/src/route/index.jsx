// dashbaord  //
import Default from "../components/dashboard/default";
// Project app
import ProjectList from "../components/application/project/project";
import NewProject from "../components/application/project/new-project";
import UserLog from "../components/application/project/userlog";
import ProfileList from "../components/application/project/profileList";

//list moniters
import DeviceManagement from "../components/application/project/devicemanagement/devicemanagement";
import UserProfile from "../components/application/project/userprofile";

import FranchiseList from "../components/application/franchise/franchiselist";

// Test Franchise
// import TestFranchiseList from '../components/application/franchise/TestFranchise/TestFranchiselist'

// NewFranchise by Marieya
import NewFranchise from "../components/application/franchise/NewFranchise/NewFranchise";

//leads
import LeadDetails from "../components/application/leads/leaddetails";
import AddLeads from "../components/application/leads/addleads";
import LeadsContainer from "../components/application/leads/leadsContainer";

//user
import ConsolidatedOnline from "../components/application/customermanagement/consolidatedonline";
import SessionHistory from "../components/application/customermanagement/sessionhistory";
import Disconnected from "../components/application/customermanagement/disconnected";
import Feedback from "../components/application/customermanagement/feedback";

//internal tickets
import AddTicket from "../components/application/internaltickets/addticket";

//inventory mgmt
import Vendor from "../components/application/inventory/vendor";
import ProductCategory from "../components/application/inventory/productcategory";
import Products from "../components/application/inventory/products";
import AddStock from "../components/application/inventory/addstock";
import ManageStock from "../components/application/inventory/managestock";
import UploadHistory from "../components/application/inventory/uploadhistory";

//log
import AuditLogs from "../components/application/logs/auditlogs";
import LoginHistory from "../components/application/logs/loginhistory";
import LoginFail from "../components/application/logs/loginfail";

//Communications
import Communications from "../components/application/communications/communication";

// todo-firebase-app
import TodoFirebase from "../components/application/todo-firebase-app";

//admin
import AdminUsers from "../components/application/administration/adminuser/adminusers";
import Branch from "../components/application/administration/branch";
// import Department from '../components/application/administration/department'
import Roles from "../components/application/administration/roles";
import Permission from "../components/application/administration/permission";

//ticketing in admin
import TicketCategory from "../components/application/administration/ticketing/category";
import SubCategory from "../components/application/administration/ticketing/subcateg";
import Priority from "../components/application/administration/ticketing/priority";

//leads in admin
import LeadSource from "../components/application/administration/leads/leadsource";
import LeadType from "../components/application/administration/leads/leadtype";
import LeadStatus from "../components/application/administration/leads/leadstatus";

//franchises in admin
import FranchiseRole from "../components/application/administration/adminfranchise/franchiserole";
import FranchiseType from "../components/application/administration/adminfranchise/franchisetype";
import SmsGateway from "../components/application/administration/adminfranchise/smsgateway";
import AdminStatus from "../components/application/administration/adminfranchise/adminstatus";

//serviceplan
import ServicePlan from "../components/application/services/serviceplan";
import IptvPlan from "../components/application/services/iptv-plans";
import Combo from "../components/application/services/combo/combo";
import NewServiceList from "../components/application/services/NewServiceList";
import OfferList from "../components/application/services/Addoffer/Offerlist";

//IPTV By Phani
import OpenBouquet from "../components/application/services/iptv-phani/new_iptv_plans";

//New offer List

//customer management
import CustomerKYCForm from "../components/application/customermanagement/KYCForm/index";

// New KYC Form
// import NewCustomerKYCForm from "../components/application/customermanagement/KYCForm/NewKycDocument";

import CustomerLists from "../components/application/customermanagement/NewCustomerLists";
import CustomerDetails from "../components/application/customermanagement/customer-details/customer-details";

//billingandpayment
import BillingAndPayment from "../components/application/billingandpayments/billing";
import DashboardNewDesign from "../components/application/Dashboard";
//NewBillingandpayment
import NewBillingAndPayment from "../components/application/billingandpayments/NewBillingLists";
import BillingFields from "../components/application/billingupdates/billingfields";
import BillingField from "../components/application/billingupdates/billingfield";

//radiuscpanel
import Nas from "../components/application/project/nas/nas";
import Ippool from "../components/application/project/ippool/ipool";

//device mang

import Node from "../components/application/project/devicemanagement/devices/node";
import Pop from "../components/application/project/devicemanagement/devices/pop";
import Switch from "../components/application/project/devicemanagement/devices/switch";
import Olt from "../components/application/project/devicemanagement/opticalnetwork/olt";
import Distribution from "../components/application/project/devicemanagement/opticalnetwork/distribution";
import Customer from "../components/application/project/devicemanagement/opticalnetwork/customer";

//all optical
import AllOptical from "../components/application/project/opticalnew/alloptical";
import Campaign from "../components/application/campaignmanagement/campaign";
import CampaignTable from "../components/application/campaignmanagement/campaigntable";
import Zone from "../components/application/administration/zones/zone";
import Area from "../components/application/administration/zones/area";
import RadiusHealthCheck from "../components/application/project/opticalnew/networkhealthcheck/radiushealthcheck";

//payments
import PaymentList from "../components/application/administration/payment/paymentlist";
import NewPaymentList from "../components/application/administration/payment/NewPaymentList";
import Tabbed from "../components/application/fieldteam/tabbed";
import BranchList from "../components/application/branchmanagement/branchlist";
import Wallet from "../components/application/wallets/wallet";
//new ticket
import NewTicketList from "../components/application/internaltickets/NewTicketList";
// end
//old ticket
import AllTickets from "../components/application/internaltickets/allticketsnew";
//end

// import RadiusHealthCheck from "../components/application/project/radiushealthcheck";
import NewLeadList from "../components/application/leads/NewLeadlist";
import NewReportCards from "../components/application/newreports/newreportcards";
import ReportDetails from "../components/application/newreports/allreports";
// import AllReports from "../components/application/newreports/Reports/allreports"
import AllReports from "../components/application/Reports/Reports/allreports";
import Newwallet from "../components/application/wallets/newwallet";
import FranchiseReportss from "../components/application/Reports/customerreports/franchiseReports";
import HelpdeskReportss from "../components/application/Reports/customerreports/helpdeskReports";
import RevenueReportss from "../components/application/Reports/customerreports/revenueReports";
import InoviceFields from "../components/application/Reports/billingreports/invoicefields";
import CustomerReports from "../components/application/Reports/customerreports/customerreports";
import LedgerReports from "../components/application/Reports/billingreports/ledgerfields";
import GstReports from "../components/application/Reports/billingreports/gstfields";
import SecurityReports from "../components/application/Reports/billingreports/securityfields";

import NetworkFields from "../components/application/Reports/networkreports/networkfields";
import CableTable from "../components/application/services/Cable/cable";
import OttTable from "../components/application/services/OTT/ott";
import IPTVTable from "../components/application/services/IPTV/iptv";
import LeadsReports from "../components/application/Reports/customerreports/leadsReports";
import { Component } from "react";
import Promotions from "../components/application/promotions/Promotions";
import GitamUsers from "../components/application/administration/gitamuser/GitamUsers";
import UserDetailPage from "../components/application/administration/gitamuser/UserDetailPage";

// content

export const routes = [
  { path: "/dashboard/default/:layout/", Component: Default },

  { path: "/app/project/user-list/:layout", Component: ProjectList },
  { path: "/app/project/create-user/:layout", Component: NewProject },

  { path: "/app/project/userlog/:username/:layout", Component: UserLog },
  { path: "/app/project/profile-list/:layout", Component: ProfileList },
  { path: "/app/project/userprofile/:layout", Component: UserProfile },
  //list moniters
  {
    path: "/app/project/devicemanagement/device-management/:layout",
    Component: DeviceManagement,
  },

  { path: "/app/todo-app/todo-firebase/:layout", Component: TodoFirebase },

  // { path: "/app/franchise/franchise-list/:layout", Component: FranchiseList, permissionId: 392 },

  //Path for TestFranchise by Marieya
  // { path: "/app/franchise/TestFranchise/TestFranchiselist/:layout", Component: TestFranchiseList},

  // Path for NewFranchise by Marieya
  {
    path: "/app/franchise/NewFranchise/NewFranchise/:vbc",
    Component: NewFranchise,
    permissionId: 392,
  },
  //reports
  // leads management
  { path: "/app/leads/leaddetails/:id/:layout", Component: LeadDetails },
  { path: "/app/leads/add-lead/:layout", Component: AddLeads },
  {
    path: "/app/leads/leadsContainer/:layout",
    Component: LeadsContainer,
    permissionId: 349,
  },
  //user
  { path: "/app/user/user-con-online/:layout", Component: ConsolidatedOnline },

  { path: "/app/user/user-session-history/:layout", Component: SessionHistory },
  { path: "/app/user/perm-disconnected/:layout", Component: Disconnected },
  { path: "/app/user/feedback/:layout", Component: Feedback },
  //internal tickets
  { path: "/app/ticket/add/:layout", Component: AddTicket },
  { path: "/app/ticket/all/:layout", Component: AllTickets, permissionId: 374 },

  //inventory management
  { path: "/app/inventory/vendor/:layout", Component: Vendor },
  {
    path: "/app/inventory/product-category/:layout",
    Component: ProductCategory,
  },
  { path: "/app/inventory/products/:layout", Component: Products },
  { path: "/app/inventory/add-stock/:layout", Component: AddStock },
  { path: "/app/inventory/stock/:layout", Component: ManageStock },
  { path: "/app/inventory/upload-history/:layout", Component: UploadHistory },
  //logs
  { path: "/app/logs/audit_log/:layout", Component: AuditLogs },
  {
    path: "/app/logs/login_history/:layout",
    Component: LoginHistory,
    permissionId: 395,
  },
  { path: "/app/logs/failed_attempts/:layout", Component: LoginFail },
  //Communications

  //adminstration

  //adminstration

  {
    path: "/app/administration/adminuser/adminusers/:username",
    Component: AdminUsers,
    permissionsId: 321,
  },
  {
    path: "/app/administration/gitamuser/gitamusers/:username",
    Component: GitamUsers,
    permissionsId: 321,
  },
  {
    path: "/app/administration/branch/:layout",
    Component: Branch,
    permissionId: 390,
  },
  // { path: "/app/administration/department/:layout", Component: Department, permissionId: 324 },
  {
    path: "/app/administration/roles/:layout",
    Component: Roles,
    permissionId: 322,
  },
  { path: "/app/administration/permission/:layout", Component: Permission },
  {
    path: "/app/administration/ticketing/category/:layout",
    Component: TicketCategory,
    permissionId: 396,
  },
  {
    path: "/app/administration/ticketing/subcategory/:layout",
    Component: SubCategory,
    permissionId: 397,
  },
  {
    path: "/app/administration/ticketing/priority/:layout",
    Component: Priority,
    permissionId: 398,
  },

  //adminstration

  // network device
  {
    path: "/app/project/devicemanagement/devices/node/:layout",
    Component: Node,
  },
  { path: "/app/project/devicemanagement/devices/pop/:layout", Component: Pop },
  {
    path: "/app/project/devicemanagement/devices/switch/:layout",
    Component: Switch,
  },
  {
    path: "/app/project/devicemanagement/opticalnetwork/olt/:layout",
    Component: Olt,
  },
  {
    path: "/app/project/devicemanagement/opticalnetwork/distribution/:layout",
    Component: Distribution,
  },
  {
    path: "/app/project/devicemanagement/opticalnetwork/customer/:layout",
    Component: Customer,
  },
  {
    path: "/app/project/opticalnew/all/:layout",
    Component: AllOptical,
    permissionId: 331,
  },
  //radius health check
  {
    path: "/app/project/opticalnew/opticalheathcheck/radiushealthcheck/:layout",
    Component: RadiusHealthCheck,
    permissionId: 336,
  },
  //

  //admin level leadssrc,leadtype
  {
    path: "/app/administration/leads/leadsource/:layout",
    Component: LeadSource,
    permissionId: 400,
  },
  {
    path: "/app/administration/leads/leadtype/:layout",
    Component: LeadType,
    permissionId: 401,
  },
  {
    path: "/app/administration/leads/leadstatus/:layout",
    Component: LeadStatus,
  },
  //admin level franchise
  {
    path: "/app/administration/adminfranchise/franchiserole/:layout",
    Component: FranchiseRole,
    permissionId: 404,
  },
  {
    path: "/app/administration/adminfranchise/franchisetype/:layout",
    Component: FranchiseType,
    permissionId: 405,
  },
  {
    path: "/app/administration/adminfranchise/smsgateway/:layout",
    Component: SmsGateway,
    permissionId: 406,
  },
  {
    path: "/app/administration/adminfranchise/status/:layout",
    Component: AdminStatus,
    permissionId: 407,
  },
  //service plan
  {
    path: "/app/services/serviceplan/:layout",
    Component: ServicePlan,
    permissionId: 338,
  },
  {
    path: "/app/services/Cable/cable/:layout",
    Component: CableTable,
    permissionId: 338,
  },
  {
    path: "/app/services/OTT/ott/:layout",
    Component: OttTable,
    permissionId: 338,
  },
  {
    path: "/app/services/IPTV/iptv/:layout",
    Component: IPTVTable,
    permissionId: 388,
  },

  {
    path: "/app/services/iptvplan/:layout",
    Component: IptvPlan,
    permissionId: 341,
  },
  {
    path: "/app/services/newiptvplan/:layout",
    Component: OpenBouquet,
    permissionId: 428,
  },
  { path: "/app/services/Combo/:layout", Component: Combo, permissionId: 348 },
  {
    path: "/app/services/newservicelist/:layout",
    Component: NewServiceList,
    permissionId: 338,
  },
  {
    path: "/app/services/offerlist/:layout",
    Component: OfferList,
    permissionId: 428,
  },
  //customer management
  {
    path: "/app/customermanagement/kycform/:layout",
    Component: CustomerKYCForm,
    permissionId: 364,
  },
  // {
  //   path: "/app/customermanagement/kycform/:layout",
  //   Component: NewCustomerKYCForm,
  //   permissionId: 364,
  // },
  {
    path: "/app/customermanagement/customerlists/:layout",
    Component: CustomerLists,
    permissionId: 365,
  },
  {
    path: "/app/customermanagement/customerlists/customerdetails/:id/:username/:radius_info/:layout",
    Component: CustomerDetails,
  },
  {
    path: "/app/administration/gitamuser/:username/:layout",
    Component: UserDetailPage,
  },
  //billing and payments
  {
    path: "/app/billingandpayments/billing/:layout",
    Component: BillingAndPayment,
    permissionId: 380,
  },
  //New Billing and payments
  {
    path: "/app/billingandpayments/NewBillingLists/:vbc",
    Component: NewBillingAndPayment,
    // permissionId: 380,
  },
  {
    path: "/app/billingupdates/billingfields/:layout",
    Component: BillingFields,
    permissionId: 380,
  },
  {
    path: "/app/billingupdates/billingfield/:layout",
    Component: BillingField,
    permissionId: 380,
  },

  //dashboard
  {
    path: "/app/dashboard/:layout",
    Component: DashboardNewDesign,
    permissionId: 281,
  },

  //radius capnel
  { path: "/app/radiuscpanel/nas/:layout", Component: Nas },
  {
    path: "/app/radiuscpanel/ippool/:layout",
    Component: Ippool,
    permissionId: 330,
  },
  //campaign management
  { path: "/app/campaignmanagement/campaign/:layout", Component: Campaign },
  {
    path: "/app/campaignmanagement/campaigntable/:layout",
    Component: CampaignTable,
  },

  //zone
  {
    path: "/app/administration/zone/:layout",
    Component: Zone,
    permissionId: 402,
  },
  {
    path: "/app/administration/area/:layout",
    Component: Area,
    permissionId: 403,
  },
  //payemt
  {
    path: "/app/administration/payment/paymentlist/:layout",
    Component: NewPaymentList,
    permissionId: 328,
  },
  //fieldteam
  { path: "/app/fieldteam/tabbed/:layout", Component: Tabbed },
  //branch management
  { path: "/app/branchmanagement/branch-list/:layout", Component: BranchList },
  { path: "/app/wallets/wallet/:layout", Component: Wallet, permissionId: 385 },
  //new ticket commented
  { path: "/app/internaltickets/newticket/:layout", Component: NewTicketList },

  //old ticket
  // { path: "/app/ticket/all/:layout", Component: AllTickets,permissionId: 374 },
  // content
  { path: "/app/leads/NewLeadList/:layout", Component: NewLeadList },
  //path for new reports
  {
    path: "/app/newreports/newreportcards/:layout",
    Component: ReportDetails,
    permissionId: 412,
  },
  {
    path: "/app/Reports/Reports/allreports/:layout",
    Component: AllReports,
    permissionsId: 412,
  },
  {
    path: "/app/Reports/customerreports/franchiseReports/:layout",
    Component: FranchiseReportss,
  },
  {
    path: "/app/Reports/customerreports/helpdeskReports/:layout",
    Component: HelpdeskReportss,
  },
  {
    path: "/app/Reports/customerreports/revenueReports/:layout",
    Component: RevenueReportss,
  },
  {
    path: "/app/Reports/billingreports/invoicefields/:layout",
    Component: InoviceFields,
  },
  {
    path: "/app/Reports/customerreports/customerreports/:layout",
    Component: CustomerReports,
  },
  {
    path: "/app/Reports/billingreports/ledgerfields/:layout",
    Component: LedgerReports,
  },
  {
    path: "/app/Reports/billingreports/gstfields/:layout",
    Component: GstReports,
  },
  {
    path: "/app/Reports/billingreports/securityfields/:layout",
    Component: SecurityReports,
  },
  {
    path: "/app/Reports/customerreports/leadsReports/:layout",
    Component: LeadsReports,
  },

  {
    path: "/app/Reports/networkreports/networkfields/:layout",
    Component: NetworkFields,
  },

  //Communications added by Marieya
  // {path: "/app/communications/communication/:layout", Component:Communications,permissionsId:412},
  {
    path: "/app/communications/communication/:layout",
    Component: Communications,
    permissionsId: 412,
  },

  //end
  //new wallet
  { path: "/app/wallets/newwallet/:layout", Component: Newwallet },

  // promotion
  { path: "/app/promotions/push_notification/:layout", Component: Promotions },

  //end
];
