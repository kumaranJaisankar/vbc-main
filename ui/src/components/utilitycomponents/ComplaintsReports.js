import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const ComplaintReports = (props) => {
    const { currentTab, tabCounts, setActiveTab } = props;
    //commented off tab counts by marieya
    return (
        <Box sx={{ width: "100%" }}>
            <Box>
                <Tabs
                    value={currentTab}
                    onChange={(_, value) => setActiveTab(value)}
                    aria-label="iptv plans section"
                    indicatorColor={""}
                >
                    <Tab
                        label={`All (${tabCounts.all || 0})`}
                        value="all"
                        className="customer_tabslist"
                    />

                    <Tab
                        label={`Open (${tabCounts.opn || 0})`}
                        value="opn"
                        style={{ marginLeft: "10px" }}
                        className="customer_tabslist"
                    />
                    <Tab
                        label={`In-Progress (${tabCounts.inp || 0})`}
                        value="inp"
                        style={{ marginLeft: "10px" }}
                        className="customer_tabslist"
                    />

                    <Tab
                        label={`Assigned (${tabCounts.asn || 0})`}
                        value="asn"
                        style={{ marginLeft: "10px" }}
                        className="customer_tabslist"
                    />
                    <Tab
                        label={`Resolved (${tabCounts.rsl || 0})`}
                        value="rsl"
                        style={{ marginLeft: "10px" }}
                        className="customer_tabslist"
                    />


                    <Tab
                        label={`Closed (${tabCounts.cld || 0})`}
                        value="cld"
                        style={{ marginLeft: "10px" }}
                        className="customer_tabslist"
                    />


                </Tabs>
            </Box>
        </Box>
    );
};

export default ComplaintReports;
