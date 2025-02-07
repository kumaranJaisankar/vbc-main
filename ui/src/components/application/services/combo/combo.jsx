import React, { useEffect, useState,useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { iptvaxios } from "../../../../axios";
import { Box } from "@mui/material";
import HeaderButtons from "./Headerbuttons"

const channelsHeaderList = [
  "Channel Id",
  "Name",
  "Description",
  "Genre",
  "Language",
  "Price",
  "CreatedBy",
];

const Combo = ({}) => {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    async function getChannels() {
      const response = await iptvaxios.get(
        "iptvadmin/admin/api/channel/getChannels/1"
      );
      setChannels(response.data.data);
    }
    getChannels();
  }, []);




  return (
    <>
    <HeaderButtons/>
    <br/><br/>
      {channels.length > 0 && (
        <Box sx={{ width: "100%", bgcolor: "background.paper" ,marginLeft: "20px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{backgroundColor:"#f9f6fb"}}>
                <TableRow>
                  {channelsHeaderList.map((header, key) => (
                    <TableCell key={key}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {channels.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.channelId}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                    <TableCell>{row.language}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.createdBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default Combo;
