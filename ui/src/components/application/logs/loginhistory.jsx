import React, { Fragment, useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Container, Row, Col, Card } from "reactstrap";
import moment from "moment";
import { adminaxios } from "../../../axios";
import DataTable from "react-data-table-component";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LOGINHISTORY } from "../../../utils/permissions";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const LoginHistory = (props) => {
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [ getUser, setGetUser] = useState([])
  const [refresh, setRefresh] = useState(0);

  const configDB = useSelector((content) => content.Customizer.customizer);

  useEffect(() => {
    setLoading(true);
    adminaxios
      .get(`accounts/logindata`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, []);

  // useEffect(()=>{
  //   adminaxios.get(`accounts/users`).then((res)=>{
  //     setGetUser(res.data)
  //   })
  // },[])

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);


  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      console.log(data,"login");
      if (data?.user_name?.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  const columns = [
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
    // {
    //   name: <b className="Table_columns">{"ID"}</b>,
    //   // name: "ID",
    //   selector: "id",
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns">{"User"}</b>,
      // name: "User",
      selector: "user_name",
      sortable: true,
       cell: (row) => {
        // let statusObj = getUser.find((s) => s.id == row.user);

        return <span>{row ? row.user_name : "-"}</span>;
      },
    },  
    {
      name: <b className="Table_columns">{"User Type"}</b>,
      // name: "User",
      selector: "user_type",
      cell:(row)=>{
        return(
          <span>{row?.user_type}</span>
        )
      },
      sortable: true,
    },
    // {
    //   name: <b className="Table_columns">{"Session ID"}</b>,

    //   // name: "Session ID",
    //   selector: "session",
    //   sortable: true,
    // },
    // timimg
    {
      name: <b className="Table_columns">{"Login Time"}</b>,

      // name: "Login Time",
      selector: "login_time",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.login_time).format("DD MMM YY,h:mm a")}
        </span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Logout Time"}</b>,

      // name: "Logout Time",
      selector: "logout_time",
      cell: (row) => {
        return (
          <span>
            {row.logout_time ? moment(row.logout_time).format("DD MMM YY,h:mm a") : "---"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"IP Address"}</b>,

      // name: "Ip Address",
      selector: "ip_address",
      cell: (row) => {
        return (
          <span>{row?.ip_address}</span>
        )
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Location"}</b>,

      // name: "Location",
      selector: "location",
      cell: (row) => {
        return <span>{row.location ? row.location : "No Location"}</span>;
      },
      sortable: true,
    },
  

  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  // scroll top
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView(0, 0)
  }, [])


  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        htmlFor="booty-check"
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
    </div>
  ));

  const handleSelectedRows = (selectedRows) => {
    const tempFilteredData =
      filteredData.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    setFiltereddata(temp);
  };


  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  {/* Sailaja on 12th July   Line number 209 id="breadcrumb_margin" change the breadcrumb position */ }

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin"  >
            <Grid item md="12">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" className="navigate_icon" />}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  App Settings
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Login History
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Sailaja on 12th July   Line number 235 id="breadcrumb_table" change the breadcrumb position */}

          <div className="data_table" id="breadcrumb_table">


            <Stack direction="row" spacing={2}>
              <span className="all_cust"> Login History</span>
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ flex: 1 }}
              >

                <Paper
                  component="div"
                  className="search_bar"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ 'aria-label': 'search google maps' }}
                    placeholder="Search With User"
                    onChange={(event) => handlesearchChange(event)}
                  />
                  <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Stack>
            </Stack>
            <br />
            <Row>
              <Col xl="12" style={{ marginTop: "2%" }}>
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">

                          {token.permissions.includes(LOGINHISTORY.HISTORY) ? (

                            <DataTable
                              columns={columns}
                              data={filteredData}
                              onSelectedRowsChange={({ selectedRows }) => (
                                handleSelectedRows(selectedRows)
                              )}
                              noHeader
                              noDataComponent={"No Data"}
                              pagination
                              selectableRows
                              selectableRowsComponent={NewCheckbox}
                              conditionalRowStyles={conditionalRowStyles}

                            />
                          ) : (<p style={{ textAlign: "center" }}>{"You have insufficient permissions to view this"}</p>)}
                        </div>
                      )}
                    </nav>
                  </Col>
                  <br />
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default LoginHistory;
