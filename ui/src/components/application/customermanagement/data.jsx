import moment from "moment";
import React from "react";
import Typography from "@mui/material/Typography";
import MoreActions from "./more-actions";
import { CUSTOMER_LIST } from "../../../utils/permissions";
import KYCCIRCLE from "../../../assets/images/Customer-Circle-img/KycCircle.png";
import ACTCIRCLE from "../../../assets/images/Customer-Circle-img/ActiveCircle.png";
import DCTCIRCLE from "../../../assets/images/Customer-Circle-img/DctCircle.png";
import EXPCIRCLE from "../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import INSCIRCLE from "../../../assets/images/Customer-Circle-img/InstallationCircle.png";
import PROVCIRCLE from "../../../assets/images/Customer-Circle-img/ProvisioningCircle.png";
import HLDCIRCLE from "../../../assets/images/Customer-Circle-img/HoldCircle.png";
import SPDCIRCLE from "../../../assets/images/Customer-Circle-img/SuspendedCircle.png";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

export const statusType = {
  KYC: "KYC Confirmed",
  PROV: "Provisioning",
  INS: "Installation",
  ACT: "Active",
  DCT: "Deactive",
  EXP: "Expired",
  SPD: "Suspended",
  HLD: "Hold",
};

export const statusList = [
  {
    id: "ACT",
    name: "Active",
  },
  {
    id: "INA",
    name: "Inactive",
  },
];

export const accountType = [
  {
    id: "REG",
    name: "Regular",
  },
  {
    id: "ARN",
    name: "Auto_renewal",
  },
];

export const paymentStatus = [
  {
    id: "PD",
    name: "Paid",
  },
  {
    id: "UPD",
    name: "Unpaid",
  },
];

const stickyColumnStyles = {
  whiteSpace: "nowrap",
  position: "sticky",
  zIndex: "1",
  backgroundColor: "white",
};

const tokenInfo = JSON.parse(localStorage.getItem("token"));
let Showpassword = false;
if (
  (tokenInfo && tokenInfo.user_type === "Admin") ||
  (tokenInfo && tokenInfo.user_type === "Franchise Owner")
) {
  Showpassword = true;
}

export const getCustomerListsTableColumns = ({
  userIdClickHandler,
  noOfSessionClickHandler,
  changePlanClickHandler,
  RefreshHandler,
  redirectToCustomerDetails,
}) => {
  const customerListsTableColumns = [
    // {
    //   name: (
    //     <div className="checkbox_header">
    //       <input type="checkbox" class="rounded-checkbox" id="checkbox" />{" "}
    //       {/* <label for="checkbox"></label> */}
    //     </div>
    //   ),
    //   width: "80px",
    //   sortable: false,
    //   right: true,
    //   cell: (row) => (
    //     <div >
    //       <input type="checkbox" class="rounded-checkbox" id="checkbox" />{" "}
    //       {/* <label for="checkbox"></label> */}
    //     </div>
    //   ),
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "0px",
    //   },
    // },

    {
      name: "",
      selector: "action",
      width: "80px",
      center: true,
      cell: (row) => (
        <MoreActions
          row={row}
          refresh={RefreshHandler}
          changePlanClickHandler={changePlanClickHandler}
          userIdClickHandler={userIdClickHandler}
          redirectToCustomerDetails={redirectToCustomerDetails}
          permissions={tokenInfo?.permissions}
        />
      ),
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
    },

    {
      name: <b className="Table_columns" id="columns_right">{"Customer ID"}</b>,
      selector: "username",
      width: "140px",

      cell: (row) => (
        <>
          {token.permissions.includes(CUSTOMER_LIST.READ) ? (
            <a onClick={() => redirectToCustomerDetails(row)} href="#" id="columns_right" style={{ whiteSpace: "initial" }}>
              {row?.username}
            </a>
          ) : (
            <span id="columns_right" style={{ whiteSpace: "initial" }}> {row?.username}</span>
          )}
        </>
      ),
      style: {
        ...stickyColumnStyles,
        left: "128px !important",
      },
    },

    {
      selector: "acctstoptime",
      sortable: false,
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} id="columns_right">{"Current Status"}</b>,

      cell: (row) => {
        return (
          <div id="columns_right" style={{ display: "flex", width: "100%" }}>
            {row?.acctstoptime === 'ONLINE' ? (
              <>
                <img src={KYCCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Online</p>
              </>
            ) : row?.acctstoptime === "OFFLINE" ? (
              <>
                <img src={EXPCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Offline</p>
              </>
            ) : row?.acctstoptime === "" ? (
              <img src={HLDCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
            ) : (
              ""
            )}
          </div>
        );
      },
      style: {
        ...stickyColumnStyles,
        left: "265px !important",
      },
    },


    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }} id="columns_right">{"Phone Number"} &nbsp;</b>,
      selector: "register_mobile",
      width: "95px",
      cell: (row) => (
        <a style={{ whiteSpace: "nowrap" }} id="columns_right">{row?.register_mobile}</a>
      ),
      sortable: false,
      style: {
        ...stickyColumnStyles,
        left: "375px !important",
        // left: "265px !important",
        borderRight: "1px solid #CECCCC",
      },
    },

    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap", fontSize: "12px" }}>{"Account Status"}</b>,
      selector: "account_status",
      // width: "120px",
      sortable: false,
      cell: (row) => {
        return (
          <div style={{ whiteSpace: "nowrap", marginRight: "30rem" }}>
            {row?.account_status === "ACT" ? (
              <img src={ACTCIRCLE} />
            ) : row?.account_status === "KYC" ? (
              <img src={KYCCIRCLE} />
            ) : row?.account_status === "DCT" ? (
              <img src={DCTCIRCLE} />
            ) : row?.account_status === "EXP" ? (
              <img src={EXPCIRCLE} />
            ) : row?.account_status === "SPD" ? (
              <img src={SPDCIRCLE} />
            ) : row?.account_status === "HLD" ? (
              <img src={HLDCIRCLE} />
            ) : row?.account_status === "PROV" ? (
              <img src={PROVCIRCLE} />
            ) : row?.account_status === "INS" ? (
              <img src={INSCIRCLE} />
            ) : (
              ""
            )}
            &nbsp; &nbsp;
            <Typography variant="caption">
              {statusType[row?.account_status]}
            </Typography>
          </div>
        );
      },
    },
    // Sailaja changed Line no 242,246 on 12th
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Name"}</b>,
      selector: "first_name",
      sortable: false,
      cell: (row) => (
        <div className="ellipsis" title={row?.first_name}>
          {row?.first_name}
        </div>
      ),
      // cell: (row) => (
      //   <span className="First_Letter"style={{position:"relative",left:"20px"}}> { row?.first_name}</span>
      // ),

    },
    {
      name: <b className="Table_columns">{"Plan"}</b>,
      selector: "package_name",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.package_name}>
          {row?.package_name}
        </div>
      ),
    },
 // Sailaja Modified Year Format As YYYY  for Customer List->Plan Updated column on 20th March 2023
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Plan Updated"}</b>,
      selector: "plan_updated",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row?.plan_updated).format("DD MMM YYYY")}
        </span>
      ),
    },
 // Sailaja Modified Year Format As YYYY  for Customer List->Plan Due Date column on 20th March 2023
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Plan Due Date"}</b>,
      selector: "expiry_date",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row?.expiry_date).format("DD MMM YYYY")}
        </span>
      ),
    },


    {
      name: <b className="Table_columns">{"Branch"}</b>,
      selector: "branch",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.branch}>
          {row?.branch}
        </div>
      ),
    },
    {
      name: <b className="Table_columns">{"Franchise"}</b>,
      selector: "franchise",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.franchise || ""}>
          {row?.franchise ? row?.franchise : "---"}
        </div>
      ),
    },


    {
      name: <b className="Table_columns">{"Zone"}</b>,
      selector: "zone",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.zone}>
          {row?.zone}
        </div>
      ),
    },
    {
      name: <b className="Table_columns">{"Area"}</b>,
      selector: "area",
      cell: (row) => (
        <div className="ellipsis" title={row?.area || ""}>
          {row?.area ? row?.area : "---"}
        </div>
      ),
      sortable: true,
    },



    {
      name: <b className="Table_columns" style={{ position: "relative" }}>{"Email"}</b>,
      selector: "registered_email",
      cell: (row) => (
        <div className="ellipsis" title={row?.registered_email} style={{ color: "#285295", position: "relative", }}>
          {row?.registered_email}
        </div>
      ),

      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Invoice No"}</b>,
      selector: "last_invoice_id",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.last_invoice_id}>
          {row?.last_invoice_id}
        </div>
      ),
    },

    //Sailaja  Removed  space between GST IN Line No: 409 on 11th July
    {
      name: <b className="Table_columns">{"GSTIN"}</b>,
      selector: "user_advance_info.GSTIN",
      cell: (row) => {
        return (
          <span>
            {row?.user_advance_info?.GSTIN ? row?.user_advance_info?.GSTIN : "---"}
          </span>
        );
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Static IP"}</b>,
      cell: (row) => {
        return <span>{row?.static_ip ? row?.static_ip : "---"}</span>;
      },
    },

    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap", fontSize: "12px" }}>{"Installation Charges"}</b>,
      selector: "user_advance_info.installation_charges",
      sortable: true,
      cell: (row) => {
        return (
          <span>
            {row?.user_advance_info
              ? row?.user_advance_info.installation_charges
              : "---"}
          </span>
        );
      },
    },

    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap", fontSize: "12px" }}> &nbsp;&nbsp;{"Security Deposit"}</b>,
      selector: "user_advance_info.security_deposit",
      cell: (row) => {
        return (
          <span>
            {row?.user_advance_info
              ? row?.user_advance_info.security_deposit
              : "---"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Password"}</b>,

      cell: (row) => {
        return Showpassword ? (
          <span>{row?.cleartext_password ? row?.cleartext_password : "---"}</span>
        ) : (
          "---"
        );
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Setup Box No"}</b>,
      selector: "stb_serial_no",
      cell: (row) => {
        return (
          <span

          >

            {row?.stb_serial_no ? row?.stb_serial_no : "---"}
          </span>
        );
      },
      sortable: true
    },
    {
      name: <b className="Table_columns">{"Download"}</b>,
      selector: "download",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Upload"}</b>,
      selector: "upload",
      sortable: true,
    },
     // Sailaja Modified Year Format As YYYY  for Customer List->Created column on 20th March 2023
    {
      name: <b className="Table_columns">{"Created"}</b>,
      selector: "created",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row?.created).format("DD MMM YYYY")}
        </span>
      ),
    },


    // {
    //   name: "Wallet Amount",
    //   selector: "wallet_amount",
    //   sortable: true,
    //   cell: (row) => (
    //     <div className="ellipsis" title={row?.wallet_amount}>{row?.wallet_amount}</div>
    //   )
    // },
    // {
    //   name: <b className="Table_columns">{"Traffic"}</b>,
    //   selector: "session_count",
    //   cell: (row) => (
    //     <MUILink
    //       component="button"
    //       variant="body2"
    //       underline="none"
    //       onClick={() => noOfSessionClickHandler(row)}
    //     >
    //       <span style={{ marginLeft: "20px" }}> {row?.session_count || 0}</span>
    //     </MUILink>
    //   ),
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Account Type"}</b>,
      selector: "account_type",
      sortable: true,
      cell: (row) => {
        let accttype = accountType.find((s) => s.id == row?.account_type);

        return <span>{accttype ? accttype.name : row?.account_type}</span>;
      },
    },





    {
      name: <b className="Table_columns">{"Preview"}</b>,
      selector: "link_preview",
      cell: (row) => {
        return (
          <a
            href={row?.network_info && row?.network_info.workorder_link_preview}
            target="_blank"
            download
          >
            <i className="fa fa-eye"></i>
          </a>
        );
      },
      sortable: true,
    },
    // Changed selector name for preview and download by Marieya
    {
      name: <b className="Table_columns">{"Download"}</b>,
      selector: "download_link_preview",
      cell: (row) => {
        return (
          <a
            href={row?.network_info && row?.network_info.workorder_link_download}
            download
          >
            <i className="fa fa-download"></i>
          </a>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns ">{"Address"}</b>,
      selector: "address",

      sortable: false,
      cell: (row) => (
        <div className="ellipsis First_Letter1 " title={`${row && row?.address && row?.address.house_no},${row && row?.address && row?.address.landmark
          },${row && row?.address && row?.address.street},${row && row?.address && row?.address.city
          },${row && row?.address && row?.address.district},${row && row?.address && row?.address.state
          },${row && row?.address && row?.address.pincode},${row && row?.address && row?.address.country
          }`}>
          <span>


            {row?.address ? (`${row && row?.address && row?.address.house_no},${row && row?.address && row?.address.landmark
              },${row && row?.address && row?.address.street},${row && row?.address && row?.address.city
              },${row && row?.address && row?.address.district},${row && row?.address && row?.address.state
              },${row && row?.address && row?.address.pincode},${row && row?.address && row?.address.country
              }`) : "---"}
          </span>

        </div>
      ),

    },


  ];

  return customerListsTableColumns;
};

const selectRowHandler = (e) => {

}
export const getAppliedFiltersObj = () => {
  return {
    first_name: {
      value: {
        type: "text",
        strVal: "",
        label: "First name {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },
    username: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      },
    },
    register_mobile: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      },
    },
    last_name: {
      value: {
        type: "text",
        strVal: "",
        label: "Last name {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },

    created_at_status: {
      value: {
        type: "text",
        strVal: "",
        label: "{statusplaceholder}",
      },
    },
    static_ip: {
      value: {
        type: "text",
        strVal: "",
        label: "{statusplaceholder}",
      },
    },

    gst_number: {
      value: {
        type: "radio",
        strVal: "",
        label: "GST {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },
    created_at_from_date: {
      value: {
        type: "date",
        strVal: "",
        label: "Created from date {dateplaceholder}",
      },
    },
    created_at_to_date: {
      value: {
        type: "date",
        strVal: "",
        label: "Created to date {dateplaceholder}",
      },
    },
    expiry_date: {
      value: {
        type: "date",
        strVal: null,
        label: "Expiry from {dateplaceholder}",
      },
    },
    expiry_date_end: {
      value: {
        type: "date",
        strVal: null,
        label: "Expiry to {dateplaceholder}",
      },
    },
    branch: {
      value: {
        type: "array",
        results: [],
      },
    },
    zone: {
      value: {
        type: "array",
        results: [],
      },
    },
    area: {
      value: {
        type: "array",
        results: [],
      },
    },
  };
};




export const getAdditionalFiltersObj = () => {
  return {
    franchiseBranches: {
      value: {
        type: "array",
        strVal: [],
        idVal: [],
      },
    },
    franchises: {
      value: {
        type: "array",
        strVal: [],
        idVal: [],
      },
    },
  };
};


export const getAppliedServiceFiltersObj = () => {
  return {
    framedipaddress: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      }
    },
    callingstationid: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      }
    },
  }
}