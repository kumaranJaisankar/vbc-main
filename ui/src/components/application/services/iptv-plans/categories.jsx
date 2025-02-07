import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from "@mui/material/Checkbox";
import { iptvaxios } from "../../../../axios";
import { Box } from "@mui/material";
import CategorylList from "../iptv-plans/Headerbuttons/categorylist"
const catogeriesHeaderList = [
  "",
  "Id",
  "Name",
  "Description",
  "Total Channels",
  "Created By"
];

const Categories = ({ }) => {
  const [comboAdd, setComboAdd ] = useState([])
  const [catogeries, setChannels] = useState([]);
  useEffect(() => {
    async function getCatogeries() {
      const response = await iptvaxios.get('iptvadmin/admin/api/category/getCategories/1');
      setChannels(response.data.data);
    }
    getCatogeries();
  }, []);

  return (
    <>
    <CategorylList comboAdd={comboAdd}/>
      {
        catogeries.length > 0 && (
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{backgroundColor:"#f9f6fb"}}>
                  <TableRow>
                    {
                      catogeriesHeaderList.map((header, key) => (
                        <TableCell key={key}>{header}</TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {catogeries.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                      <Checkbox color="primary" 
                      onChange = {(event)=>{
                        if(event.target.checked){
                          setComboAdd((prevState)=>{
                            return [...prevState,row.id]
                          })
                        }else{
                          let filterSelected = comboAdd.filter(c=>c!=row.id);
                          setComboAdd([...filterSelected]);
                        }
                      }}
                      />
                    </TableCell>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.channels.length}</TableCell>
                      <TableCell>{row.createdBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )
      }
    </>
  )
}

export default Categories;