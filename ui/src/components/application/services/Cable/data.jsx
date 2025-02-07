import React from "react";
import Link from "@mui/material/Link";
import Checkbox from '@mui/material/Checkbox';

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
    var token = JSON.parse(storageToken);
}

export const packageType = [
    {
        id: "BP",
        name: "Base Plan",
    },
    {
        id: "FBP",
        name: "Fall Back Plan",
    },
    {
        id: "DAP",
        name: "Data Addon Plan",
    },
];
export const packageDatatype = [
    {
        id: "FUP",
        name: "FUP",
    },
    {
        id: "ULT",
        name: "Unlimited",
    },
    {
        id: "ULT-FUP",
        name: "Unlimited-FUP",
    },
];

export const fupCalculation = [
    {
        id: "DU",
        name: "Total (Download+Upload)",
    },
    {
        id: "D",
        name: "Only Download",
    },
];

export const fallBacktype = [
    {
        id: "V4MB",
        name: "VBC-4MB-UL-Fallback",
    },
    {
        id: "V2MB",
        name: "VBC-2MB-UL-Fallback",
    },
    {
        id: "V5MB_FUP",
        name: "5MB-UL-Fallback",
    },
];

export const billingType = [
    {
        id: "PRE",
        name: "Prepaid",
    },
    {
        id: "POST",
        name: "Postpaid",
    },
];

export const billingCycle = [
    {
        id: "REG",
        name: "Regular",
    },
    {
        id: "FD",
        name: "Fixed Deposit",
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

export const taxType = [
    {
        id: "IN",
        name: "Inclusive",
    },
    {
        id: "EX",
        name: "Exclusive",
    },
];

export const expiryDate = [
    {
        id: "REG",
        name: "Regular (Ex:2-Mar to 2-Apr)",
    },
    {
        id: "PRE",
        name: "Previous Day Midnight (Ex: 1-May to 31-May)",
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
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export const getServiceListsTableColumns = ({
    // serviceIdClickHandler,
    serviceSelectedCheckboxObjects,
    subCheckboxHandler
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
            name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} >{"Bouquet Name"}</b>,
            selector: "name",
            sortable: true,
            // cell: (row) => (
            //         <Link component="button" variant="body2" underline="none" row={row} onClick={() => serviceIdClickHandler(row)} style={{ textTransform: "uppercase" }}>
            //           {row.package_name}
            //         </Link>

            //   ),
            cell: (row) => {
                return <span style={{ whiteSpace: "nowrap" }} >{row.package_name}</span>
            },

            cell: (row) => (
                <>

                    <Link component="button" variant="body2" underline="none" row={row} style={{ whiteSpace: "nowrap" }} >
                        {row.name}
                    </Link>
                </>

            ),
            style: {
                ...stickyColumnStyles,
                left: "0px",
            },
        },
        {
            name: (
                <table style={{ position: "relative", }}>
                    <tbody style={{ paddingLeft: "50px" }}>
                        <tr>
                            <th className="Table_columns"
                                style={{
                                    width: "90px",
                                }}

                            >
                                {"ID"}
                            </th>
                            <th
                                className="Table_columns"
                                style={{
                                    width: "90px",
                                }}
                            >
                                {"Sub Plan"}
                            </th>
                            <th
                                className="Table_columns"
                                style={{
                                    width: "90px",
                                }}
                            >
                                {"Total Cost"}
                            </th>
                            <th
                                className="Table_columns"
                                style={{
                                    width: "90px",
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
                            <th
                                className="Table_columns"
                                style={{
                                    width: "90px",
                                }}
                            >
                                {"No. of Users"}
                            </th>

                        </tr>
                    </tbody>
                </table>
            ),
            selector: "sub_plans.package_name",
            cell: (row) => (
                <>
                    <table
                        style={{
                            width: "maxWidth",
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
                                    color: "#1976d2"
                                }}
                            >


                                <Link component="button" variant="body2" underline="none" row={row}  >
                                    S{row.id}
                                </Link>
                            </td>
                            <td
                                style={{
                                    width: "90px",
                                    overflow: "hidden",
                                    border: "1px solid #e6e6e6",
                                    borderRight: "none",
                                    padding: "5px",
                                    textTransform: "uppercase"
                                }}
                            >
                                {row.name}
                            </td>
                            <td
                                style={{
                                    width: "90px",
                                    overflow: "hidden",
                                    border: "1px solid #e6e6e6",
                                    borderRight: "none",
                                    padding: "5px",
                                }}
                            >
                                {" "}
                                ₹ {parseFloat(row.total_cost).toFixed(2)}
                            </td>
                            <td
                                style={{
                                    width: "90px",
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

                            <td
                                style={{
                                    width: "90px",
                                    overflow: "hidden",
                                    border: "1px solid #e6e6e6",
                                    padding: "5px",
                                    textAlign: "center"
                                }}
                            >
                                {row.user_count ? row.user_count : "0"}
                            </td>
                        </tr>

                        {row.sub_plans ? (
                            row.sub_plans.map((list, index) => (
                                <span key={list.id}>
                                    <tr style={{ display: "flex" }}>
                                        <Checkbox {...label} key={list.id} id={list.id}
                                            onChange={(e) => subCheckboxHandler(e, row.id, list.id)}
                                            checked={serviceSelectedCheckboxObjects && serviceSelectedCheckboxObjects[row.id] && serviceSelectedCheckboxObjects[row.id].includes(list.id)} />
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
                                                width: "90px",
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
                                            {list.name}
                                        </td>
                                        <td
                                            style={{
                                                width: "90px",
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
                                            ₹ {parseFloat(list.total_cost).toFixed(2)}
                                        </td>
                                        <td
                                            style={{
                                                width: "90px",
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
                                                width: "90px",
                                                overflow: "hidden",
                                                border: "1px solid #e6e6e6",
                                                padding: "5px",
                                                ...(row.sub_plans.length !== 1 &&
                                                    index !== row.sub_plans.length - 1 && {
                                                    ...{ borderBottom: "none" },
                                                }),
                                            }}
                                        >
                                            {list && list.offer && list.offer.name ? list && list.offer && list.offer.name : "---"}
                                        </td>
                                        <td
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
                                        </td>

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
            selector: "cost",
            cell: (row) => {
                return <span>{row ? row.cost : "-"}</span>;
            },
            sortable: true,
        },

        {
            name: <b className="Table_columns">{"Channels/Categories"}</b>,
            selector: "channel_count",
            cell: (row) => {
                return <span id="columns_channel">{row ? row.channel_count : "-"}/{row ? row.category_count : "-"}</span>;
            },
            sortable: true,
        },

        {
            name: <b className="Table_columns">{"Plan CGST %"}</b>,
            selector: "cgst",
            cell: (row) => {
                return <span>{row ? row.cgst : "-"}</span>;
            },
            sortable: true,
        },
        {
            name: <b className="Table_columns">{"Plan SGST %"}</b>,
            selector: "sgst",
            cell: (row) => {
                return <span>{row ? row.sgst : "-"}</span>;
            },
            sortable: true,
        },

        {
            name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Total Plan Cost"}</b>,
            selector: "total_cost",
            cell: (row) => {
                return <span>{parseFloat(row.total_cost).toFixed(2)}</span>;
            },
            sortable: true,
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

