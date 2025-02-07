import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import DataTable from "react-data-table-component";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import moment from "moment";
const PlanDetails = ({ profileDetails }) => {
    const [expanded, setExpanded] = React.useState("planpanel");
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const columns = [
        {
            name: <b className="cust_table_columns">{"Plan Name"}</b>,
            selector: "service_plan_name",
            sortable: true,
            cell: (row) => (<span>
                {row && row?.service_plan_name}
            </span>)
        },
// Sailaja Modified Year Format As YYYY  for Customer List-> 360 page ->Start Date column on 20th March 2023

        {
            name: <b className="cust_table_columns">{"Start Date"}</b>,
            selector: "start_date",
            sortable: true,
            cell: (row) => (
                <span className="digits" style={{ textTransform: "initial" }}>
                    {" "}
                    {moment(row?.start_date).format("DD MMM YYYY")}
                </span>
            ),
        },
// Sailaja Modified Year Format As YYYY  for Customer List-> 360 page ->End Date column on 20th March 2023

        {
            name: <b className="cust_table_columns">{"End Date"}</b>,
            selector: "end_date",
            sortable: true,
            cell: (row) => (
                <span className="digits" style={{ textTransform: "initial" }}>
                    {" "}
                    {moment(row?.end_date).format("DD MMM YYYY")}
                </span>
            ),
        },
        {
            name: <b className="cust_table_columns">{"Static IP"}</b>,
            selector: "static_ip_address",
            sortable: true,
            cell: (row) => (<span>
                {row && row?.static_ip_address? row?.static_ip_address:"---"}
            </span>)
        },

    ];
    return (
        <>
            <Accordion
                style={{
                    borderRadius: "15px",
                    boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
                }}
                expanded={expanded === "planpanel"}
                onChange={handleChange("planpanel")}
            >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                    <Typography variant="h6" className="customerdetailsheading">
                        Plan History
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {profileDetails?.plan_history_data ? <>
                        <DataTable columns={columns} data={profileDetails?.plan_history_data} className="invoice_list" />
                    </> : <Box >
                        <Skeleton />
                        <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} />
                        <Skeleton animation={false} />
                    </Box>}
                </AccordionDetails>

            </Accordion>
        </>
    )
}

export default PlanDetails;