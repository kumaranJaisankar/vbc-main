import React, { useState, useEffect } from "react";
import { FormGroup, Input } from "reactstrap";
import pick from "lodash/pick";
import { Search } from "react-feather";
import { customeraxios } from "../../../axios";
import { Typeahead } from "react-bootstrap-typeahead";

const OpenForComponent = (props) => {
  const [leadUsers, setLeadUsers] = useState();
  const [selectedopenfor, setSelectedopenfor] = useState([]);
  const [customerlist, setCustomerlist] = useState([]);
  const [leadlist, setLeadlist] = useState([]);
  const [selectedopenforLead, setSelectedopenforLead] = useState({});
  const [openToFilter, setOpenToFilter] = useState([]);
  const [leadUsersForTypehead, setLeadUsersForTypehead] = useState();
  useEffect(() => {
    customeraxios.get(`/customers/display/users`).then((res) => {
      let listOfLeadsForTypehead = [];
      let custobj = res.data.customers;
      let leadobj = res.data.lead;
      let leadsPick = (custobj).map((lead) => {
        let obj = pick(lead, "id", "username", "mobile_no");
        listOfLeadsForTypehead.push("L00" + obj.id);
        listOfLeadsForTypehead.push(obj.username);
        listOfLeadsForTypehead.push(obj.mobile_no);
        console.log(res.data.customers,"customeringo")
        return {
          ...obj,
          username:  obj.username,
        };
      });
      setLeadUsers(leadsPick);
      setLeadUsersForTypehead(listOfLeadsForTypehead);
    });
  }, []);

  useEffect(() => {
    if (selectedopenfor.length > 0) {
      let lead = leadUsers.find((l) => {
        if (
          l.id == selectedopenfor ||
          l.username == selectedopenfor ||
          l.mobile_no == selectedopenfor
        ) {
          return l;
        }
      });
       setSelectedopenforLead(lead);
      props.setFormData((preState) => ({
        ...preState,
        ["open_for"]: lead.username,
      }));
    }
    else{
      props.setFormData((preState) => ({
        ...preState,
        ["open_for"]: undefined,
      })); 
    }
  }, [selectedopenfor]);

  useEffect(() => {
    if (props.isReset) {
      setSelectedopenfor([]);
    }
  }, [props.isReset]);

  // useEffect(() => {
  //   customeraxios.get(`customers/display/users`).then((res) => {
  //     let { customers, lead } = res.data;
  //     setCustomerlist([...customers]);
  //     setLeadlist([...lead]);
  //   });
  // }, []);
  return (
    <>
        <span className="kyc_label">Customer ID *</span>
      <FormGroup>

      <div className="input_wrap">
          <Typeahead
          style={{position:"relative"}}
            id="multiple-typeahead"
            className=""
            // placeholder="Customer ID.... *"
            selected={selectedopenfor}
            onChange={(selected) => {
              props.setIsReset(false);
              setSelectedopenfor(selected);
            }}
            options={openToFilter}
            onInputChange={(text) => {
              if (

                text !== "" &&
                leadUsersForTypehead &&
                leadUsersForTypehead.length > 0
              ) {
                let arrFilter = leadUsersForTypehead && leadUsersForTypehead.filter(
                  (a) =>  a && a.toLowerCase().indexOf(text && text.toLowerCase()) !== -1
                );
                setOpenToFilter(arrFilter);
              } else {
                setSelectedopenfor([]);
                setOpenToFilter([]);
              }
            }}
            onFocus={() => setOpenToFilter([])}
          />
          <Input
            style={{ visibility: "hidden" }}
            type="text"
            name="open_for"
            className="form-control digits"
            onChange={props.handleInputChange}
            value={selectedopenforLead && selectedopenforLead.username}
          ></Input>
        </div>
        <div style={{ position: "absolute", top: "30px", left: "78%" }}>
          <Search className="search-icon" size={16} />
        </div>
        <span className="errortext" style={{position:"absolute", top:"60px"}}>
                      {/* {" "} */}
                      {props.errors.open_for && "Please Search Customer"}
                    </span>
        


        {/* <div className="input_wrap">
          <Input
            type="select"
            name="open_for"
            className={`form-control digits ${
              props.formData && props.formData.open_for ? "not-empty" : ""
            }`}
            onChange={props.handleInputChange}
            onBlur={props.checkEmptyValue}
            value={props.formData && props.formData.open_for}
          >
            <option style={{ display: "none" }}></option>
            {customerlist.map((customer) => (
              <option key={customer.id} value={customer.username}>
                {customer.username}
              </option>
            ))}
            {leadlist.map((customer) => (
              <option key={customer.id} value={customer.username}>
                {customer.username}
              </option>
            ))}
          </Input>
          <Label className="placeholder_styling">Customer ID *</Label>
        </div>
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "73%",
          }}
        ></div>
        <span className="errortext">
                      {" "}
                      {props.errors.open_for && "Please select Customer"}
                    </span>
      */}
      </FormGroup>
    </>
  );
};

export default OpenForComponent;
