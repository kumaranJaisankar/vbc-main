import React, { useMemo, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { classes } from "../../data/layouts";
import { adminaxios, customeraxios } from "../../axios";
import TypeHeadSearch from "./TypeHeadSearch";
import { useHistory } from "react-router-dom";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import useDataTable from "../../custom-hooks/use-data-table";

const GlobalSearch = (props) => {
  const history = useHistory();
  const [globalSearchBy, setGlobalSearch] = React.useState("username");
  const [inputValue, setInputSearchValue] = React.useState("");
  const [customerListToShow, setCustomerListToShow] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState({});
  const [nextPage, setNextPage] = React.useState({
    currentPageNo: 1,
    nextURI: null,
    currentItemsPerPage: 30,
  });
  const [getList, setGetList] = useState();
  const [loading, setLoading] = useState("");
  useEffect(() => {
    if (!!selectedId) {
      setModalOpen(true);
      // sessionStorage.setItem("customerInfDetails", JSON.stringify(selectedId));
      // history.push(
      //   `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${selectedId.user}/${selectedId.username}/${selectedId.radius_info}/${process.env.REACT_APP_API_URL_Layout_Name}`
      // );
    }
  }, [selectedId]);

  const getQueryParams = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage } = nextPage;

    let queryParams = "";
    if (isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    return queryParams;
  };

  // useEffect(() => {
  //   if (!!inputValue) {
  //     callAPI();
  //   } else {
  //     setCustomerListToShow([]);
  //   }
  // }, [inputValue]);

  // const onKeyDown = useCallback(

  //   (e) => {
  //     if (e.keyCode === 'Enter' ) {
  //       callAPI(inputValue);
  //       console.log('hi787')

  //     }
  //   },
  //   [inputValue]
  // );

  const handleKeyDown = (event) => {
    if (event?.key === "Enter") {
      callAPI();
    }
  };

  useEffect((e) => {
    if (e?.keyCode === "Enter") {
      callAPI(inputValue);
    } else if (!!inputValue) {
      callAPI();
    } else {
      setCustomerListToShow([]);
    }
  }, []);

  const onShowmoreClick = () => {
    customeraxios.get(nextPage.nextURI).then((response) => {
      const { data } = response;
      const { results, next, page, count } = data;
      setNextPage((prevState) => ({
        ...prevState,
        currentPageNo: page,
        nextURI: next,
        currentItemsPerPage: count,
      }));

      var list = results.map((r) => {
        return {
          username: r.username,
          mobile: r.register_mobile,
          email: r.registered_email,
          radius_info: r.radius_info,
          user: r.user,
          id: r.id,
          service_plan: r.service_plan,
          area_id: r.area_id,
          firstname: r.first_name,
          lastname: r.last_name,
          alternatemobile: r.alternate_mobile,
          address: r?.address?.house_no,
          stb_serial_no: r.stb_serial_no,
        };
      });
      if (!!inputValue) {
        setCustomerListToShow((prevState) => [...prevState, ...list]);
      } else {
        setCustomerListToShow([]);
      }
    });
  };

  const callAPI = () => {
    setLoading("Loading");
    const queryParams = getQueryParams();
    adminaxios
      .get(
        // `customers/v3/list?limit=1000&page=1&${globalSearchBy}=${inputValue}`

        `accounts/universityusers/list?username=${inputValue}`
        // `customers/list/search?${queryParams}&${globalSearchBy}=${inputValue}`
      )
      .then((response) => {
        setGetList(response?.data);
        setLoading(response?.data === [] ? "" : "No Matches Found");
        if (response?.data?.length === 1) {
          // setUserDetails(response?.data?.results[0]);
          sessionStorage.setItem(
            "customerInfDetails",
            JSON.stringify(response?.data[0])
          );

          setModalOpen(true);
          // history.push(
          //   `${process.env.PUBLIC_URL}/app/administration/gitamuser/:username/${process.env.REACT_APP_API_URL_Layout_Name}`
          // );
        }

        setUserDetails(response?.data[0]);
        const { data } = response;
        const { results, next, page, count } = data;

        setNextPage((prevState) => ({
          ...prevState,
          currentPageNo: page,
          nextURI: next,
          currentItemsPerPage: count,
        }));

        var list = data.map((r) => {
          return {
            username: r.username,
            mobile: r.register_mobile,
            email: r.registered_email,
            radius_info: r.radius_info,
            user: r.user,
            id: r.id,
            service_plan: r.service_plan,
            area_id: r.area_id,
            firstname: r.first_name,
            lastname: r.last_name,
            alternatemobile: r.alternate_mobile,
            address: r?.address?.house_no,
            stb_serial_no: r.stb_serial_no,
          };
        });
        if (!!inputValue) {
          setCustomerListToShow([...list]);
        } else {
          setCustomerListToShow([]);
        }
      })
      .catch(function (error) {
        setLoading("No Matches Found");
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
        } else if (is500Error) {
          setLoading("No Matches Found");
        } else if (is404Error) {
          setLoading("No Matches Found");
        } else {
          setLoading("No Matches Found");
        }
      });
  };

  const changeHandler = (value) => {
    console.log(value, "value");
    setInputSearchValue(value);
    setNextPage({
      currentPageNo: 1,
      currentItemsPerPage: 30,
    });
  };

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler);
  }, []);

  const findUser = () => {
    // let user = {};
    // if (globalSearchBy === "username") {
    //   user = customerListToShow.find((c) => c.username === inputValue);
    // }
    // setSelectedId(customerListToShow[0]);
    setCustomerListToShow([]);
  };
  console.log(userDetails, "namee");
  return (
    // <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
    <Paper
      component="div"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0px",
        height: "38px",
        border: "1px solid #ced4da",
        boxShadow: "none",
        margin: "27px",
        // backgroundColor: "#F3F3F9"
      }}
    >
      {/* <div style={{ margin: "-27px" }}>
        <FormControl
          className={classes.margin}
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={globalSearchBy}
            className="global-search-dropdown"
            onChange={(event) => setGlobalSearch(event.target.value)}
            // label="User Id"
            // input={""}
            style={{
              borderBottom: "none",
              height: "40px",
              margin: "8px",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: "100",
              fontSize: "14px",
              lineHeight: "22px",
              color: "#666666!important",
              position: "relative",
              left: "18%",
              width: "63%",
            }}
          >
            <MenuItem value="username">Username</MenuItem>
          </Select>
        </FormControl>
      </div> */}

      <TypeHeadSearch
        customerListToShow={customerListToShow}
        globalSearchBy={globalSearchBy}
        setSelectedId={setSelectedId}
        onChange={debouncedChangeHandler}
        setCustomerListToShow={setCustomerListToShow}
        nextPage={onShowmoreClick}
        nextPage1={nextPage}
        handleKeyDown={handleKeyDown}
        getList={getList}
        inputValue={inputValue}
        loading={loading}
        selectedId={selectedId}
      />

      <IconButton
        type="submit"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => {
          callAPI();
        }}
      >
        <SearchIcon on style={{ width: "21px" }} />
      </IconButton>
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        centered
        backdrop="static"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          User Details
        </ModalHeader>
        <ModalBody>
          {/* your session will expire in {idleLogout / 60 / 1000} minutes. Do you want to extend the session? */}
          <p>
            <b>Username :</b> {`${userDetails.username}`}
          </p>
          <p>
            <b>Cleartext Password :</b> {`${userDetails.cleartext_password}`}
          </p>
          <p>
            <b>User Type :</b> {`${userDetails.user_type}`}
          </p>
          <p>
            <b>Plan Type :</b> {`${userDetails.service_plan}`}
          </p>
          <p>
            <b>Is active :</b> {`${userDetails.is_active ? "True" : "False"}`}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            type="button"
            onClick={() => setModalOpen(false)}
            // disabled={disable}
          >
            {"Back"}
          </Button>
          {/* <button className="btn btn-success" onClick={()=> extendSession()}>Extend session</button> */}
        </ModalFooter>
      </Modal>
    </Paper>
    // {/* </Stack> */}
  );
};
// style added by marieya
export default GlobalSearch;
