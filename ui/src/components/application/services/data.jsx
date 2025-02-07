import React from "react";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import { SERVICEPLAN } from "../../../utils/permissions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

// Sailaja sorting the Administration -> Internet ->  Service Plan ->Package Type *  Dropdown data as alphabetical order on 29th March 2023

export const packageType = [
  {
    id: "BP",
    name: "Base Plan",
  },
  {
    id: "DAP",
    name: "Data Addon Plan",
  },
  {
    id: "FBP",
    name: "Fall Back Plan",
  },
];

// Sailaja sorting the Administration -> Internet ->  Service Plan ->Package Data Type *  Dropdown data as alphabetical order on 29th March 2023

export const packageDatatype = [
  {
    id: "FUP",
    name: "FUP",
  },
  {
    id: "ULT-FUP",
    name: "Unlimited-FUP",
  },
  {
    id: "ULT",
    name: "Unlimited",
  },
];

// Sailaja sorting the Administration -> Internet ->  Service Plan ->FUP Calculation * Dropdown data as alphabetical order on 29th March 2023
export const fupCalculation = [
  {
    id: "D",
    name: "Only Download",
  },
  {
    id: "DU",
    name: "Total (Download+Upload)",
  },
];
// Sailaja sorting the Administration -> Internet ->  Service Plan ->Fall Back Type * Dropdown data as alphabetical order on 29th March 2023
export const fallBacktype = [
  {
    id: "V5MB_FUP",
    name: "5MB-UL-Fallback",
  },
  {
    id: "V2MB",
    name: "VBC-2MB-UL-Fallback",
  },
  {
    id: "V4MB",
    name: "VBC-4MB-UL-Fallback",
  },
];

// Sailaja sorting the Administration -> Internet ->  Service Plan ->Billing Type *  Dropdown data as alphabetical order on 29th March 2023

export const billingType = [
  {
    id: "POST",
    name: "Postpaid",
  },

  {
    id: "PRE",
    name: "Prepaid",
  },
];

// Sailaja sorting the Administration -> Internet ->  Service Plan ->Billing Cycle * Dropdown data as alphabetical order on 29th March 2023
export const billingCycle = [
  {
    id: "FD",
    name: "Fixed Deposit",
  },
  {
    id: "REG",
    name: "Regular",
  },
];
export const statusType = [
  {
    id: "ACT",
    name: "Active",
  },
  {
    id: "IN",
    name: "Inactive",
  },
];

// Sailaja sorting the Administration -> Internet ->  Service Plan ->Tax Type Dropdown data as alphabetical order on 29th March 2023

export const taxType = [
  {
    id: "EX",
    name: "Exclusive",
  },

  {
    id: "IN",
    name: "Inclusive",
  },
];
// Sailaja sorting the Administration -> Internet ->  Service Plan ->Renewal Expiry Day * Dropdown data as alphabetical order on 29th March 2023

export const expiryDate = [
  {
    id: "PRE",
    name: "Previous Day Midnight (Ex: 1-May to 31-May)",
  },
  {
    id: "REG",
    name: "Regular (Ex:2-Mar to 2-Apr)",
  },
];

export const unitType = [
  // {
  //   id: "day",
  //   name: "day(s)",
  // },
  {
    id: "mon",
    name: "month(s)",
  },
  // {
  //   id: "hrs",
  //   name: "hour(s)",
  // },
];

export const unitType1 = [
  {
    id: "mon",
    name: "month(s)",
  },
  // {
  //   id: "day",
  //   name: "day(s)",
  // },

  // {
  //   id: "hrs",
  //   name: "hour(s)",
  // },
];

const stickyColumnStyles = {
  // whiteSpace: "nowrap",
  // position: "sticky",
  // zIndex: "1",
  // backgroundColor: "white",
};

const label = { inputProps: { "aria-label": "Checkbox demo" } };
export const getServiceListsTableColumns = ({
  serviceIdClickHandler,
  serviceSelectedCheckboxObjects,
  subCheckboxHandler,
}) => {
  const leadListsTableColumns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => (
    //     <MoreActions
    //     />
    //   ),
    // },
    //     {
    //       name: <b className="Table_columns">{"ID"}</b>,
    //       selector: "id",
    //       // width: "130px",
    //       style: {
    //         ...stickyColumnStyles,
    //         left: "0px !important",
    //       },
    //       cell: (row) => (
    //         <>
    //         {token.permissions.includes(SERVICEPLAN.SERVICEREAD) ? (
    //  <Link component="button" variant="body2" underline="none" row={row}  onClick={() => serviceIdClickHandler(row)}>
    //  S{row.id}
    // </Link>
    //         ):(
    //           <Link component="button" variant="body2" underline="none" row={row}  >
    //           S{row.id}
    //         </Link>
    //         )}
    //         </>

    //       ),
    //     },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Package Name"}
        </b>
      ),
      selector: "package_name",
      sortable: true,
      width: "150px",
      // cell: (row) => {
      //   return <span style={{whiteSpace: "nowrap"}} >{row.package_name}</span>
      // },

      cell: (row) => (
        <>
          {token.permissions.includes(SERVICEPLAN.SERVICEREAD) ? (
            <Link
              component="button"
              variant="body2"
              underline="none"
              row={row}
              onClick={() => serviceIdClickHandler(row)}
              style={{ textTransform: "uppercase" }}
            >
              {row.package_name}
            </Link>
          ) : (
            <Link
              component="button"
              variant="body2"
              underline="none"
              row={row}
              style={{ whiteSpace: "nowrap" }}
            >
              {row.package_name}
            </Link>
          )}
        </>
      ),
      style: {
        ...stickyColumnStyles,
        left: "0px",
      },
    },
    {
      name: (
        <table style={{ position: "relative" }}>
          <tbody style={{ paddingLeft: "50px" }}>
            <tr>
              <th
                className="Table_columns"
                style={{
                  width: "90px",
                }}
              >
                {"ID"}
              </th>
              <th
                className="Table_columns"
                style={{
                  width: "150px",
                }}
              >
                {"Sub Plan"}
              </th>
              <th
                className="Table_columns"
                style={{
                  width: "120px",
                }}
              >
                {"Total Cost"}
              </th>
              <th
                className="Table_columns"
                style={{
                  width: "120px",
                }}
              >
                {"Duration"}
              </th>
              <th
                className="Table_columns"
                style={{
                  width: "90px",
                }}
              >
                {"Offer"}
              </th>
              {/* <th
                className="Table_columns"
                style={{
                  width: "90px",
                }}
              >
                {"No. of Users"}
              </th> */}
            </tr>
          </tbody>
        </table>
      ),
      selector: "sub_plans.package_name",
      cell: (row) => (
        <>
          <table
            style={{
              // width: "maxWidth",
              margin: "2px",
              marginTop: "5px",
              marginBottom: "5px",
              position: "relative",
            }}
          >
            <tr style={{ display: "flex", marginLeft: "42px" }}>
              <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  borderRight: "none",
                  padding: "5px",
                  color: "#1976d2",
                }}
              >
                {token.permissions.includes(SERVICEPLAN.SERVICEREAD) ? (
                  <Link
                    component="button"
                    variant="body2"
                    underline="none"
                    row={row}
                    onClick={() => serviceIdClickHandler(row)}
                  >
                    S{row.id}
                  </Link>
                ) : (
                  <Link
                    component="button"
                    variant="body2"
                    underline="none"
                    row={row}
                  >
                    S{row.id}
                  </Link>
                )}
                {/* S{row.id} */}
              </td>
              <td
                style={{
                  width: "150px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  borderRight: "none",
                  padding: "5px",
                  textTransform: "uppercase",
                }}
              >
                {row.package_name}
              </td>
              <td
                style={{
                  width: "120px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  borderRight: "none",
                  padding: "5px",
                }}
              >
                {" "}
                ₹ {parseFloat(row.total_plan_cost).toFixed(2)}
              </td>
              <td
                style={{
                  width: "120px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  padding: "5px",
                }}
              >
                {row.time_unit + " " + row.unit_type + "(s)"}
              </td>
              <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  padding: "5px",
                }}
              >
                {"---"}
              </td>

              {/* <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {row.user_count ? row.user_count : "0"}
              </td> */}
            </tr>

            {row.sub_plans ? (
              row.sub_plans.map((list, index) => (
                <span key={list.id}>
                  <tr style={{ display: "flex" }}>
                    <Checkbox
                      {...label}
                      key={list.id}
                      id={list.id}
                      onChange={(e) => subCheckboxHandler(e, row.id, list.id)}
                      checked={
                        serviceSelectedCheckboxObjects &&
                        serviceSelectedCheckboxObjects[row.id] &&
                        serviceSelectedCheckboxObjects[row.id].includes(list.id)
                      }
                    />
                    <td
                      style={{
                        fontSize: "14px",
                        width: "90px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        borderRight: "none",
                        color: "#1976d2",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      S{list.id}
                    </td>
                    <td
                      style={{
                        width: "150px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        borderRight: "none",
                        padding: "5px",
                        textTransform: "uppercase",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list.package_name}
                    </td>
                    <td
                      style={{
                        width: "120px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        borderRight: "none",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {" "}
                      ₹ {parseFloat(list.total_plan_cost).toFixed(2)}
                    </td>
                    <td
                      style={{
                        width: "120px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list.time_unit + " " + list.unit_type + "(s)"}
                    </td>
                    <td
                      style={{
                        width: "100px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list && list.offer && list.offer.name
                        ? list && list.offer && list.offer.name
                        : "---"}
                    </td>
                    {/* <td
                      style={{
                        width: "90px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        padding: "5px",
                        textAlign: "center",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list.user_count ? list.user_count : "0"}
                    </td> */}
                  </tr>
                </span>
              ))
            ) : (
              <span> </span>
            )}
          </table>
        </>
      ),
      sortable: false,
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },

    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Static Ip"}
        </b>
      ),
      selector: "is_static_ip",
      cell: (row) => {
        return <span>{row?.is_static_ip === true ? "True" : "False"}</span>;
      },
      sortable: true,
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Download Speed"}
        </b>
      ),
      selector: "download_speed",
      cell: (row) => {
        return <span>{row ? row.download_speed : "-"}</span>;
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Upload Speed"}</b>,
      selector: "upload_speed",
      cell: (row) => {
        return <span>{row ? row.upload_speed : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Package Type"}</b>,
      selector: "package_type",
      sortable: true,
      cell: (row) => {
        let statusObj = packageType.find((s) => s.id == row.package_type);

        return <span>{statusObj ? statusObj.name : row.package_type}</span>;
      },
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Package Data Type"}
        </b>
      ),
      selector: "package_data_type",
      sortable: true,
      cell: (row) => {
        let statusObj = packageDatatype.find(
          (s) => s.id == row.package_data_type
        );

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"FUP Calculation"}
        </b>
      ),
      selector: "fup_calculation_type",
      sortable: true,
      cell: (row) => {
        let statusObj = fupCalculation.find(
          (s) => s.id == row.fup_calculation_type
        );

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    // {
    //   name: <b className="Table_columns">{"Fall Back Type"}</b>,
    //   selector: "fall_back_type",
    //   sortable: true,
    //   cell: (row) => {
    //     let statusObj = fallBacktype.find((s) => s.id == row.fall_back_type);

    //     return <span>{statusObj ? statusObj.name : "-"}</span>;
    //   },
    // },
    {
      name: "Fallback Plan",
      cell: (row) => {
        if (
          typeof row.fall_back_plan === "object" &&
          row.fall_back_plan !== null
        ) {
          // If it's an object, return the package_name
          return row.fall_back_plan.package_name;
        } else if (typeof row.fall_back_plan === "string") {
          // If it's a string, return the string itself
          return row.fall_back_plan;
        } else {
          // If it's null or any other type, return 'N/A'
          return "---";
        }
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Billing Type"}</b>,
      selector: "billing_type",
      sortable: true,
      cell: (row) => {
        let statusObj = billingType.find((s) => s.id == row.billing_type);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    {
      name: <b className="Table_columns">{"Billing Cycle"}</b>,
      selector: "billing_cycle",
      sortable: true,
      cell: (row) => {
        let statusObj = billingCycle.find((s) => s.id == row.billing_cycle);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,
      selector: "status",
      sortable: true,
      cell: (row) => {
        let statusObj = statusType.find((s) => s.id == row.status);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    {
      name: <b className="Table_columns">{"Plan Cost"}</b>,
      selector: "plan_cost",
      cell: (row) => {
        return <span>{row ? row.plan_cost : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Plan CGST %"}</b>,
      selector: "plan_cgst",
      cell: (row) => {
        return <span>{row ? row.plan_cgst : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Plan SGST %"}</b>,
      selector: "plan_sgst",
      cell: (row) => {
        return <span>{row ? row.plan_sgst : "-"}</span>;
      },
      sortable: true,
    },

    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Total Plan Cost"}
        </b>
      ),
      selector: "total_plan_cost",
      cell: (row) => {
        return <span>{parseFloat(row.total_plan_cost).toFixed(2)}</span>;
      },
      sortable: true,
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Renewal Expiry Day"}
        </b>
      ),
      selector: "renewal_expiry_day",
      sortable: true,
      cell: (row) => {
        let statusObj = expiryDate.find((s) => s.id == row.renewal_expiry_day);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Time Unit"}</b>,
      cell: (row) => {
        return (
          <span>{row ? row.time_unit + " " + row.unit_type + "(s)" : "-"}</span>
        );
      },
      sortable: true,
    },
  ];

  return leadListsTableColumns;
};

export const getAppliedServiceFiltersObj = () => {
  return {
    package_name: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      },
    },
  };
};
