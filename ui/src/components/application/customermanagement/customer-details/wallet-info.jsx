import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from "moment";
import AddCustomerWalletInfo from "./Addcustomerwalletinfo"
import { CUSTOMER_LIST } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const walletInfoHeader = {
  "balance": "Opening Balance",
  "credit": "Credit",
  "debit": "Debit",
  "type": "Type",
  "payment_date": "Payment Date",
  "wallet_amount": "Wallet Amount"
}

const WalletInfo = ({profileDetails,fetchComplaints}) => {
  const [balance, setBalance] = useState(0);
  const [walletInfo, setWalletInfo] = useState([]);
 console.log(balance,"balance")

  const [expanded, setExpanded] = React.useState('panel3');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <Accordion style={{ borderRadius: '15px',boxShadow:"0 0.2rem 1rem rgba(0, 0, 0, 0.15)" }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6" className="customerdetailsheading">Wallet Information</Typography>
        <div style={{display:"flex",}}>
          <Typography component="span" sx={{ marginRight: '40px',fontSize:"13px", fontWeight:"600", fontFamily:"Open Sans", position:"relative",top:"6px"}}>Wallet Balance : {profileDetails && profileDetails.wallet_info}</Typography>
          {token.permissions.includes(CUSTOMER_LIST.ADD_MONEY) && (

          <AddCustomerWalletInfo profileDetails={profileDetails} setBalance={setBalance} fetchComplaints={fetchComplaints} />
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {
          walletInfo.length > 0 ?
          (
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead sx={{ background: '#f6f6f6' }}>
                  <TableRow>
                    {
                      Object.values(walletInfoHeader).map((item, key) => (
                        <TableCell key={key} sx={{ borderBottom: 0, padding: '5px 16px' }}>{item}</TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walletInfo.map((wallet) => (
                    <TableRow
                      key={wallet.id}
                      sx={{ 'td, th': { border: 0 } }}
                    >
                      <TableCell align="left">
                        {wallet.open_for}
                      </TableCell>
                      <TableCell align="left">{wallet.category}</TableCell>
                      <TableCell align="left">{wallet.sub_category}</TableCell>
                      <TableCell align="left">{wallet.status}</TableCell>
                      <TableCell align="left">{moment(wallet.created).format('DD MMM YYYY')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
          : 'No Wallet Information'
        }
      </AccordionDetails>
    </Accordion>
  );
};

export default WalletInfo;