import React, { Fragment } from "react";

import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import KPI from './KPI'
import GroupIcon from '@mui/icons-material/Group';
import LanguageIcon from '@mui/icons-material/Language';
import RssFeedIcon from '@mui/icons-material/RssFeed';
// import KPIFields from "../kpis/kpifields"

const AllReports = () => {
    return (
        <Fragment>
            <br /><br />
            <Box sx={{ flexGrow: 1, backgroundColor: "white", padding: "20px" }}>
                <h3>Reports</h3>
                <Grid container spacing={2}>
                    <Grid item xs={4}>


                        <nav aria-label="main mailbox folders">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <GroupIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/customerreports/customerreports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >
                                            <ListItemText primary="Customer Reports" /></Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/customerreports/revenueReports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >

                                        <ListItemText primary="Revenue Reports" />
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <LanguageIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/customerreports/franchiseReports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >

                                        <ListItemText primary="Franchise Reports" />
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/billingreports/securityfields/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >
                                        <ListItemText primary="Security Deposit Reports" /></Link>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Grid>
                    <Grid item xs={4}>
                        <nav aria-label="main mailbox folders">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/customerreports/helpdeskReports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >
                                            <ListItemText primary="Helpdesk Reports" /></Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/billingreports/invoicefields/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >

                                        <ListItemText primary="Invoice Reports" />
                                        </Link>
                                        
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Wallet Reports" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <RssFeedIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/networkreports/networkfields/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >

                                        <ListItemText primary="Network Reports" />
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Grid>
                    <Grid item xs={4}>
                        <nav aria-label="main mailbox folders">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/billingreports/ledgerfields/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >
                                            <ListItemText primary=" Ledger Reports" /></Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/billingreports/gstfields/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >
                                        <ListItemText primary="GST Reports" /></Link>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Discount Reports" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/app/Reports/customerreports/leadsReports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                                        >

                                        <ListItemText primary="Leads Reports" />
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <KPI />
            </Box>
        </Fragment>
    )
}

export default AllReports;