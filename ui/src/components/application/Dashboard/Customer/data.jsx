import moment from "moment";
import React from "react";
import MUILink from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography"
import KYCCIRCLE from "../../../../assets/images/Customer-Circle-img/KycCircle.png";
import EXPCIRCLE from "../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import HLDCIRCLE from "../../../../assets/images/Customer-Circle-img/HoldCircle.png";
import { CUSTOMER_LIST } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
export const statusType = {
  "KYC": "KYC Confirmed",
  "PROV": "Provisioning",
  "INS": "Installation",
  "ACT": "Active",
  "DCT": "Deactive",
  "EXP": "Expired",
  "SPD": "Suspended",
  "HLD": "Hold",
}

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
}

export const getCustomerListsTableColumns = ({
  noOfSessionClickHandler,
  redirectToCustomerDetails,
}) => {
  const customerListsTableColumns = [

    {
      name: "User ID",
      selector: "username",
      width: '130px',
      //   cell: (row) => {
      // return (

      //     <Link to={`${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${row.user}/${row.username}/${row.radius_info}/vbc`} target="_blank">
      //     {row.username}
      //     </Link>
      // )


      // },
      cell: (row) => (
        <>
          {token.permissions.includes(CUSTOMER_LIST.READ) ? (
            <a onClick={() => redirectToCustomerDetails(row)} href="#" style={{ whiteSpace: "initial" }} >
              {row.username}
            </a>
          ) : (
            <span style={{ whiteSpace: "initial" }}> {row.username}</span>
          )}
        </>
      ),

    },
    {
      selector: "acctstoptime",
      sortable: true,
      name: "Status",
      cell: (row) => {
        return (
          <div style={{ display: "flex", width: "100%" }}>
            {row.acctstoptime === 'ONLINE' ? (
              <>
                <img src={KYCCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Online</p>
              </>
            ) : row.acctstoptime === "OFFLINE" ? (
              <>
                <img src={EXPCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Offline</p>
              </>
            ) : row.acctstoptime === "" ? (
              <img src={HLDCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
            ) : (
              ""
            )}
          </div>
        );
      },
      // cell: (row) => (
      //   <h6 style={{ marginBottom: 0 }}>
      //     {row.acctstoptime === null ? (
      //       <Chip
      //         color="success"
      //         size="small"
      //         label="Online"
      //       />
      //     ) : row.acctstoptime != "NYL" ? (
      //       <Chip
      //         color="error"
      //         size="small"
      //         label="Offline"
      //       />
      //     ) : (
      //       <Chip
      //         color="info"
      //         size="small"
      //         label="Not yet Logged"
      //       />
      //     )}
      //   </h6>
      // ),
    },
    {
      name: "A/C Status",
      selector: "account_status",
      width: '120px',
      sortable: true,
      cell: (row) => (
        <Typography variant="caption">
          {statusType[row.account_status]}
        </Typography>
      ),
    },
    {
      name: "Name",
      selector: "first_name",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: "register_mobile",
      cell: (row) => (
        <a style={{ whiteSpace: "nowrap" }}>{row.register_mobile}</a>
      ),
      sortable: true,
    },
    {
      name: "Plan",
      selector: "package_name",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.package_name}>{row.package_name}</div>
      )
    },

    {
      name: "Static IP",
      cell: (row) => {
        return (
          <span>
            {row
              ? row.static_ip
              : "---"}
          </span>
        );
      },
    },
    {
      name: "Branch",
      selector: "branch",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.branch}>{row.branch}</div>
      )
    },
    {
      name: "Zone",
      selector: "zone",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.zone}>{row.zone}</div>
      )
    },
    {
      name: "Area",
      selector: "area",
      cell: (row) => (
        <div className="ellipsis" title={row.area || ''}>{row.area ? row.area : "---"}</div>
      ),
      sortable: true,
    },

    {
      name: "Franchise",
      selector: "franchise",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.franchise || ''}>{row.franchise ? row.franchise : "---"}</div>
      )
    },

    {
      name: "Invoice No",
      selector: "last_invoice_id",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.last_invoice_id}>{row.last_invoice_id}</div>
      )
    },

    {
      name: "Created",
      selector: "created",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created).format("DD MMM YY")}
        </span>
      ),
    },
    {
      name: "Plan Updated",
      selector: "plan_updated",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.plan_updated).format("DD MMM YY")}
        </span>
      ),
    },
    {
      name: "Account Type",
      selector: "account_type",
      sortable: true,
      cell: (row) => {
        let accttype = accountType.find((s) => s.id == row.account_type);

        return <span>{accttype ? accttype.name : row.account_type}</span>;
      },
    },

    {
      name: "Plan Due date",
      selector: "expiry_date",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.expiry_date).format("DD MMM YY")}
        </span>
      ),
    },
    {
      name: "Download",
      selector: "download",
      sortable: true,
    },
    {
      name: "Upload",
      selector: "upload",
      sortable: true,
    },
    {
      name: "Installation Charges",
      selector: "user_advance_info.installation_charges",
      sortable: true,
      cell: (row) => {
        return (
          <span>
            {row.user_advance_info
              ? row.user_advance_info.installation_charges
              : "---"}
          </span>
        );
      },
    },
    {
      name: "Security Deposit",
      selector: "user_advance_info.security_deposit",
      cell: (row) => {
        return (
          <span>
            {row.user_advance_info
              ? row.user_advance_info.security_deposit
              : "---"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns ">{"Address"}</b>,
      selector: "address",

      sortable: false,
      cell: (row) => (
        <div className="ellipsis First_Letter1 " title={`${row && row.address && row.address.house_no},${row && row.address && row.address.landmark
          },${row && row.address && row.address.street},${row && row.address && row.address.city
          },${row && row.address && row.address.district},${row && row.address && row.address.state
          },${row && row.address && row.address.pincode},${row && row.address && row.address.country
          }`}>
          <span>


            {row?.address ? (`${row && row.address && row.address.house_no},${row && row.address && row.address.landmark
              },${row && row.address && row.address.street},${row && row.address && row.address.city
              },${row && row.address && row.address.district},${row && row.address && row.address.state
              },${row && row.address && row.address.pincode},${row && row.address && row.address.country
              }`) : "---"}
          </span>

        </div>
      ),

    },
  ];

  return customerListsTableColumns;
};

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
      }
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
      }
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
}

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
}
