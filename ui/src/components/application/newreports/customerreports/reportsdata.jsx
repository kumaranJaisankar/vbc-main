import React from "react";
import Typography from "@mui/material/Typography";
import MUILink from "@mui/material/Link";
import moment from "moment";
import KYCCIRCLE from "../../../../assets/images/Customer-Circle-img/KycCircle.png";
import ACTCIRCLE from "../../../../assets/images/Customer-Circle-img/ActiveCircle.png";
import DCTCIRCLE from "../../../../assets/images/Customer-Circle-img/DctCircle.png";
import EXPCIRCLE from "../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import INSCIRCLE from "../../../../assets/images/Customer-Circle-img/InstallationCircle.png";
import PROVCIRCLE from "../../../../assets/images/Customer-Circle-img/ProvisioningCircle.png";
import HLDCIRCLE from "../../../../assets/images/Customer-Circle-img/HoldCircle.png";
import SPDCIRCLE from "../../../../assets/images/Customer-Circle-img/SuspendedCircle.png";

export const actstatus = [
  {
    id: "ALL5",
    name: "All",
  },
  {
    id: " ",
    name: "New Connections",
  },
  {
    id: "EXP",
    name: "Expired",
  },
  {
    id: "ACT",
    name: "Active",
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

export const statusType = {
  KYC: "KYC Confirmed",
  PROV: "Provisioning",
  INS: "Installation",
  ACT: "Active",
  DCT: "Deactive",
  EXP: "Expired",
  SPD: "Suspended",
};

// const stickyColumnStyles = {
//   whiteSpace: "nowrap",
//   position: "sticky",
//   zIndex: "1",
//   backgroundColor: "white",
// }

export const getCustomerReportTableColumn = () => {
  const customerRepotsTableColumns = [
    // {
    //   name: "",
    //   selector: "action",
    //   // style: {
    //   //   ...stickyColumnStyles,
    //   //   left: "0",
    //   // },
    //   width: '80px',
    //   center: true,

    // },
    {
      // name: "User ID",
      name: <b className="Table_columns">{"Customer ID"}</b>,

      selector: "username",
      width: "130px",
      cell: (row) => <span>{row.username}</span>,
      // style: {
      //   ...stickyColumnStyles,
      //   left: "80px",
      // },
    },
    {
      name: <b className="Table_columns">{"Name"}</b>,

      selector: "first_name",
      sortable: true,
    },

    {
      name: <b className="Table_columns"style={{ whiteSpace: "nowrap", position:"relative",
      right: "14%" }}>{"Connection Status"}</b>,

      selector: "acctstoptime",
      sortable: true,
      cell: (row) => {
        return (
          <>
            {row.acctstoptime === null ? (
              <>
                <img src={KYCCIRCLE} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Online</p>
              </>
            ) : row.acctstoptime != "NYL" ? (
              <>
                <img src={EXPCIRCLE} />
                &nbsp; &nbsp;
                <p style={{ position: "relative", top: "6px" }}>Offline</p>
              </>
            ) : row.acctstoptime != "" ? (
              <img src={HLDCIRCLE} />
            ) : (
              // <Chip color="info" size="small" label="Not yet Logged" />
              ""
            )}
            {/* <Typography variant="caption">
              {row.acctstoptime}
            </Typography> */}
          </>
        );
      },
      // name: "Status",
      // style: {
      //   ...stickyColumnStyles,
      //   left: "210px",
      // },
      // cell: (row) => (
      //   <h6 style={{ marginBottom: 0 }}>
      //     {row.acctstoptime === null ? (
      //       <Chip color="success" size="small" label="Online" />
      //     ) : row.acctstoptime != "NYL" ? (
      //       <Chip color="error" size="small" label="Offline" />
      //     ) : (
      //       <Chip color="info" size="small" label="Not yet Logged" />
      //     )}
      //   </h6>
      // ),
    },
    {
      // name: "A/C Status",
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Account Status"}</b>,

      selector: "account_status",
      width: "120px",
      sortable: true,
      cell: (row) => {
        return (
          <div style={{ whiteSpace: "nowrap" }}>
            {row.account_status === "ACT" ? (
              <img src={ACTCIRCLE} />
            ) : row.account_status === "KYC" ? (
              <img src={KYCCIRCLE} />
            ) : row.account_status === "DCT" ? (
              <img src={DCTCIRCLE} />
            ) : row.account_status === "EXP" ? (
              <img src={EXPCIRCLE} />
            ) : row.account_status === "SPD" ? (
              <img src={SPDCIRCLE} />
            ) : row.account_status === "HLD" ? (
              <img src={HLDCIRCLE} />
            ) : row.account_status === "PROV" ? (
              <img src={PROVCIRCLE} />
            ) : row.account_status === "INS" ? (
              <img src={INSCIRCLE} />
            ) : (
              ""
            )}
            &nbsp; &nbsp;
            <Typography variant="caption">
              {statusType[row.account_status]}
            </Typography>
          </div>
        );
      },
    },

    {
      // name: "A/C Status",
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Payment Status"}</b>,

      selector: "payment_status",
      width: "120px",
      sortable: true,
      cell: (row) => {
        return (
          <div style={{ position: "relative", left:"18%"}}>
          
            {row.payment_status === "PD" ? (
              <span>{"Paid"}</span>
            ) : row.payment_status === "UPD" ? (
              <span>{"Unpaid"}</span>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      name: <b className="Table_columns align_left_column">{"Branch"}</b>,

      // name: "Branch",
      selector: "branch",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.branch}>
          {row.branch}
        </div>
      ),
    },
    {
      name: <b className="Table_columns align_left_column" >{"Zone"}</b>,

      // name: "Zone",
      selector: "zone",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.zone}>
          {row.zone}
        </div>
      ),
    },
    {
      // name: "Mobile",
      name: <b className="CustomerTable_columns align_right_column"style={{ whiteSpace: "nowrap" }}>{"Mobile Number"}</b>,

      selector: "register_mobile",
      cell: (row) => (
        <a  className="align_right_column" style={{ whiteSpace: "nowrap" }}>{row.register_mobile}</a>
      ),
      sortable: true,
    },
    {
      // name: "Address",
      name: <b className="Table_columns align_left_column">{"Address"}</b>,

      selector: "address",
      sortable: true,
      cell: (row) => (
        <div
          className="ellipsis align_left_column "
          title={
            row && row.address
              ? row && row.address.house_no
              : "" + "," + row && row.address
              ? row && row.address.street
              : "" + "," + row && row.address
              ? row && row.address.landmark
              : "" + "," + row && row.address
              ? row && row.address.city
              : "" + "," + row && row.address
              ? row && row.address.pincode
              : "" + "," + row && row.address
              ? row && row.address.district
              : "" + "," + row && row.address
              ? row && row.address.state
              : "" + "," + row && row.address
              ? row && row.address.country
              : ""
          }
        >
          {row && row.address
            ? row && row.address.house_no
            : "" + "," + row && row.address
            ? row && row.address.street
            : "" + "," + row && row.address
            ? row && row.address.landmark
            : "" + "," + row && row.address
            ? row && row.address.city
            : "" + "," + row && row.address
            ? row && row.address.pincode
            : "" + "," + row && row.address
            ? row && row.address.district
            : "" + "," + row && row.address
            ? row && row.address.state
            : "" + "," + row && row.address
            ? row && row.address.country
            : ""}
        </div>
      ),
    },
    {
      // name: "Plan",
      name: <b className="Table_columns">{"Plan"}</b>,

      selector: "package_name",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis align_right_column" title={row.package_name}>
          {row.package_name}
        </div>
      ),
    },
    {
      // name: "Sessions",
      name: <b className="Table_columns">{"Sessions"}</b>,

      selector: "session_count",
      cell: (row) => (
        <MUILink
          component="button"
          variant="body2"
          underline="none"
          // onClick={() => noOfSessionClickHandler(row)}
        >
          <span style={{ marginLeft: "20px" }}> {row.session_count || 0}</span>
        </MUILink>
      ),
      sortable: true,
    },

    {
      name: <b className="Table_columns align_right_column">{"Area"}</b>,

      // name: "Area",
      selector: "area",
      cell: (row) => (
        <div className="ellipsis align_right_column" title={row.area || ""}>
          {row.area ? row.area : "---"}
        </div>
      ),
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Franchise"}</b>,

      // name: "Franchise",
      selector: "franchise",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.franchise || ""}>
          {row.franchise ? row.franchise : "---"}
        </div>
      ),
    },

    {
      name: <b className="Table_columns">{"Invoice No."}</b>,

      // name: "Invoice No",
      selector: "last_invoice_id",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.last_invoice_id}>
          {row.last_invoice_id}
        </div>
      ),
    },
    {
      name: <b className="Table_columns"style={{ whiteSpace: "nowrap" }}>{"Created Date"}</b>,

      // name: "Created",
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
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Plan Updated"}</b>,

      // name: "Plan Updated",
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
      name: <b className="Table_columns"style={{ whiteSpace: "nowrap" }}>{"Account Type"}</b>,

      // name: "Account Type",
      selector: "account_type",
      sortable: true,
      cell: (row) => {
        let accttype = accountType.find((s) => s.id == row.account_type);

        return <span>{accttype ? accttype.name : row.account_type}</span>;
      },
    },

    {
      name: <b className="Table_columns"style={{ whiteSpace: "nowrap" }}>{" Plan Due Date"}</b>,

      // name: "Plan Due date",
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
      name: <b className="Table_columns">{"Download"}</b>,
      // align_left_column
      // name: "Download",
      selector: "download",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Upload"}</b>,

      // name: "Upload",
      selector: "upload",
      sortable: true,
    },
    {
      name: <b className="CustomerTable_columns"style={{ whiteSpace: "nowrap",position: "relative",left:"-27%" }}>{"Installation Charges"}</b>,

      // name: "Installation Charges",
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
      name: <b className="Table_columns"style={{ whiteSpace: "nowrap" }}>{"Security Deposit"}</b>,

      // name: "Security Deposit",
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
      name: <b className="Table_columns">{"Email"}</b>,

      // name: "Email",
      selector: "registered_email",
      sortable: true,
    },
  ];
  return customerRepotsTableColumns;
};

export const getAppliedFiltersReportsObj = () => {
  return {
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
