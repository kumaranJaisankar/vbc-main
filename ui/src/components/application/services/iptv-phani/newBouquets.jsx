import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { iptvaxios } from "../../../../axios";
import { Box } from "@mui/material";
import moment from "moment";
import Card from '@mui/material/Card';
import { bouquetList } from "./mockdata/bouquetList";


const Bouquets = (props) => {
  const bouquetHeadersList = [
    "Id",
    "Name",
    "Type",
    "Status",
    "Price",
    "Created At",
    "Created By",
  ];
  const [bouquet, setBouquet] = useState([]);
  const [refresh,setRefresh] = useState(0);

  // useEffect(
  //   ()=>{
  //     iptvaxios.get(
  //       "api/bouquet/getBouquets"
  //     ).then(
  //       (res)=>{
  //         setBouquet(res.data);
  //         setRefresh(0);
  //       }
  //     ).catch(
  //       err=>console.log(err)
  //     )
  //   },[]
  // )

  useEffect(
    ()=>{
      setBouquet(bouquetList)
    },[]
  )


  return (
    <Box>
    <Card>

      <TableContainer>
        <Table>
          <TableHead sx={{backgroundColor:"#faf5fb"}}> 
            {bouquetHeadersList.map((header, key) => (
              <TableCell key={key}>{header}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {bouquet.map((row) => (
              <TableRow>
                <TableCell><a className="openmodal"><b>BO{row.id}</b></a></TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.bouquetType?"Broadcastor":"MSO"}</TableCell>
                <TableCell>{row.status?"Active":"Inactive"}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{moment(row.createdDate).format('DD MMM YYYY')}</TableCell>
                <TableCell>{row.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
    </Box>
  );
};

export default Bouquets;
