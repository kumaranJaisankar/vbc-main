import React, { Fragment, useEffect, useState } from "react"; //hooks
import { Container, Row, Col, Form, Label, FormGroup, Input, Spinner } from "reactstrap";
import { adminaxios, networkaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
import MaskedInput from "react-text-mask";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { NETWORK } from "../../../../utils/permissions";
import Remaining from "./remainingip"
import ErrorModal from "../../../common/ErrorModal";
import { Sorting } from "../../../common/Sorting";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const IppoolDetails = (props) => {
  const [leadUser, setLeadUser] = useState(props.lead);
  const [originalIpFrom, setOriginalIpFrom] = useState(null);
  const [originalIpTo, setOriginalIpTo] = useState(null);
  const [ipChanged, setIpChanged] = useState(false);
  // const [selectednasid, setSelectedNasId] = useState();
  const [isDisabled, setIsdisabled] = useState(true);
  const [isDisablednas, setIsdisabledNas] = useState(true);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
//state for NAS Field
const [nasList1, setNaList1] = useState([]);
const [nasList, setNaList] = useState([]);
const [staticip, setStaticIp] = useState([]);
const [hasEdited, setHasEdited] = useState(false);


// api call for nas field
useEffect(() => {
  if (
    JSON.parse(localStorage.getItem("token"))?.branch === null
  ) {
  } else {
    networkaxios
      .get(
        `network/nas/filter?branch=${
          JSON.parse(localStorage.getItem("token"))?.branch?.id
        }`
      )
      .then((response) => {
        console.log(response.data);
         setNaList1(Sorting((response?.data),'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  }
}, []);
// nas list 
const getNasList = (branchid) => {
  networkaxios
    .get(`network/nas/filter?branch=${branchid}`)
    .then((response) => {
      // setNaList(response.data);
  // Sailaja sorting the Admin Login IP Pool NAS Dropdown data as alphabetical order on 24th March 2023
      setNaList(Sorting((response?.data),'name'));
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};
// useEffect(()=>{
//   getNasList()
// },[props.lead])

// naslist 
useEffect(()=>{
  networkaxios
  .get(`network/nas/filter?branch=${props.lead?.branch?.id}`)
  .then((response) => {
    // setNaList(response.data);
// Sailaja sorting the Admin Login IP Pool NAS Dropdown data as alphabetical order on 24th March 2023
    setNaList(Sorting((response?.data),'name'));
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
  });
},[props.lead])



  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);



  // ippooldetails

  const [collection, setCollection] = useState([]);
  useEffect(() => {

      networkaxios
        .get(`network/ippool/used_ips/${props.lead.id}`)
  
        .then((res) => {
          setCollection(res.data?.available_ips);
        })
  }, [props.lead]);



  // sorting Ip's
  // const strAscending = [...collection]?.sort((a, b) =>
  //   a.ip > b.ip ? 1 : -1,
  // );

  function strAscending(collection) {
    if (!collection) {
      console.error('Collection is undefined');
      return;
    }
    collection.sort((a, b) => {
      let aIp = a && a.ip ? a.ip : '0.0.0.0';
      let bIp = b && b.ip ? b.ip : '0.0.0.0';
      let aParts = aIp.split(".");
      let bParts = bIp.split(".");

      // Get the last segment of the IP address and convert to an integer
      let aLast = parseInt(aParts[3], 10);
      let bLast = parseInt(bParts[3], 10);

      return aLast - bLast;
    });

    console.log(collection);
    return collection;
  }


  console.log(strAscending(collection));


  // useEffect(() => {
  //   setIsdisabled(true);
  //   setIsdisabledNas(true);

  //   let selectedBranch = branch.find(
  //     (branch) => branch.name === props.lead.branch
  //   );
  //   if (selectedBranch)
  //     setLeadUser({ ...props.lead, branch: selectedBranch.id });

  //   // setLeadUser(props.lead);
  // }, [props.rightSidebar]);
  useEffect(() => {
    setIsdisabled(true);
    setIsdisabledNas(true);
  
    let selectedBranch = branch.find(
      (branch) => branch.name === props.lead.branch
    );
    
    let selectedNas;
    if (props.lead.nas) {
      selectedNas = props.lead.nas.id;
    }
  
    if (selectedBranch) {
      setLeadUser({ ...props.lead, branch: selectedBranch.id, nas: selectedNas });
      // setSelectedNasId(selectedNas)
    }
  
  }, [props.rightSidebar,props.lead]);
  

  useEffect(() => {
    networkaxios.get("/network/ippool/create").then((res) => {
      setLeadUser(res.data);
    });
  }, []);

  const ipprops = {
    guide: true,
    mask: (value) => {
      let result = [];
      const chunks = value.split(".");

      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");

        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (+chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            result.push(/\d/, /\d/, /\d/, ".");
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          continue;
        }
      }

      result = result.slice(0, -1);
      return result;
    },
    pipe: (value) => {
      if (value === "." || value.endsWith("..")) return false;

      const parts = value.split(".");

      if (
        parts.length > 4 ||
        parts.some((part) => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }
      return value;
    },
  };

  useEffect(() => {
    setOriginalIpFrom(leadUser.ip_address_from);
    setOriginalIpTo(leadUser.ip_address_to);
  }, [leadUser]); 
  

  const handleChange = (e) => {
    const target = e.target;
    var value = target.value;
    const name = target.name;
  if (name === "ip_address_from" && value !== originalIpFrom) {
    setIpChanged(true);
  }
  if (name === "ip_address_to" && value !== originalIpTo) {
    setIpChanged(true);
  }
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
       if (name == "branch") {
      getNasList(value);
      setIsdisabledNas(false);
    }
  };

  const getStaticip = (id) => {
  networkaxios
  .get(`network/ippool/users/count/${leadUser.id}`)
  .then((response) => {
    console.log(response.data.count,"response")
    setStaticIp(response.data.count)
    console.log(response.data.count,"response")
    if (!isDisabled && response.data.count) {
      console.log(props.lead.nas.id,"props.lead.nas.id")
    //   const params = {
    //     ...leadUser,
    //     nas: leadUser.nas.id,
    // }
    console.log(leadUser,"leadUser.nas")
    if (leadUser.nas && leadUser.nas.id) {
      leadUser.nas = leadUser.nas.id
    }    console.log(leadUser,"leadUser.nas")
    setIsdisabled(true);
          networkaxios
            .put(`network/ippool/update/${props.lead.id}`, leadUser)
            .then((res) => {
              setDisable(false)
              props.onUpdate(res.data);
              setShowModal(true);
              setModalMessage("Ippool was edited successfully");
              props.Refreshhandler()
              setIsdisabled(true);
              setIsdisabledNas(true);
            })
            .catch(function (error) {
              setDisable(false)
              setIsdisabled(false);
              let errorMessage = "Something went wrong";
              if (error.response) {
                if (error.response.data) {
                  setErrors(error.response.data);
                }
                if (Array.isArray(error.response.data)) {
                  if (error.response.data[0] === "ip pool with this name already exists.") {
                    errorMessage = "IP pool with this name already exists. Please choose a different name.";
                  }
                } else if (error.response.data && error.response.data.detail) {
                  errorMessage = error.response.data.detail;
                }
              }
              setShowModal(true);
              setModalMessage(errorMessage);
            });        
        }  else {
          setIsdisabled(false);
      console.log("response.data.count is false");
    }
  })
  .catch((error) => {
    console.error("Something went wrong!", error);
    if (error.response?.status === 400) {
        let errorMessage = "";
        if (error.response?.data && error.response?.data.detail) {
            errorMessage = error.response.data.detail;
        }
        setShowModal(true);
        setModalMessage(errorMessage);
    }
}); 
  }

  const ippooldetails = (id) => {
    console.log("ipoooldetails")
    setDisable(true)
    if (!isDisabled) {
      console.log(props.lead.nas.id,"props.lead.nas.id")
    //   const params = {
    //     ...leadUser,
    //     nas: leadUser.nas.id,
    // }
    console.log(leadUser,"leadUser.nas")
    if (leadUser.nas && leadUser.nas.id) {
      leadUser.nas = leadUser.nas.id
    }    console.log(leadUser,"leadUser.nas")
        
          networkaxios
            .put(`network/ippool/update/${props.lead.id}`, leadUser)
            .then((res) => {
              setDisable(false)
              props.onUpdate(res.data);
              setShowModal(true);
              setModalMessage("Ippool was edited successfully");
              props.Refreshhandler()
              setIsdisabled(true);
              setIsdisabledNas(true);
            })
            .catch(function (error) {
              setDisable(false)
              let errorMessage = "Something went wrong";
              if (error.response) {
                if (error.response.data) {
                  setErrors(error.response.data);
                }
                if (Array.isArray(error.response.data)) {
                  if (error.response.data[0] === "ip pool with this name already exists.") {
                    errorMessage = "IP pool with this name already exists. Please choose a different name.";
                  }
                } else if (error.response.data && error.response.data.detail) {
                  errorMessage = error.response.data.detail;
                }
              }
              setShowModal(true);
              setModalMessage(errorMessage);
            });        
        }
    // if (!isDisabled) {
    //   // let ipPooldata = {
    //   //   ...leadUser,
    //   //   // nas: props.lead && props.lead.nas?.id,
    //   //   // branch: "hyderabad"
    //   // };
    //   // ipPooldata.nas = leadUser.nas.id ? leadUser.nas.id : 115

    //   // console.log(ipPooldata,"ipPooldata")
    //   networkaxios
    //     .put(`network/ippool/update/${id}`, leadUser)
    //     .then((res) => {
    //       setDisable(false)
    //       props.onUpdate(res.data);
    //       // toast.success("Ippool was edited successfully", {
    //       //   position: toast.POSITION.TOP_RIGHT,
    //       //   autoClose: 1000,
    //       // });
    //       setShowModal(true);
    //       setModalMessage("Ippool was edited successfully");
    //       props.Refreshhandler()
    //       setIsdisabled(true);
    //       setIsdisabledNas(true);
    //     })

    //     // .catch(function (error) {
    //     //   setDisable(false)
    //     //   if (error.response && error.response.data) {
    //     //     setErrors(error.response.data);
    //     //   }
    //     //   toast.error("Something went wrong", {
    //     //     position: toast.POSITION.TOP_RIGHT,
    //     //     autoClose: 1000,
    //     //   });
    //     // });
    //     // .catch(function (error) {
    //     //   setDisable(false)     
    //     //   let errorMessage = "Something went wrong";
    //     //   if (error.response) {
    //     //     if (error.response.data) {
    //     //       setErrors(error.response.data);
    //     //     }
    //     //     if (error.response.data && error.response.data.detail) {
    //     //       errorMessage = error.response.data.detail;
    //     //     }
    //     //   }
    //     //   setShowModal(true);
    //     //   setModalMessage(errorMessage);
    //     // });   
    //     .catch(function (error) {
    //       setDisable(false)
    //       let errorMessage = "Something went wrong";
    //       if (error.response) {
    //         if (error.response.data) {
    //           setErrors(error.response.data);
    //         }
    //         if (Array.isArray(error.response.data)) {
    //           if (error.response.data[0] === "ip pool with this name already exists.") {
    //             errorMessage = "IP pool with this name already exists. Please choose a different name.";
    //           }
    //         } else if (error.response.data && error.response.data.detail) {
    //           errorMessage = error.response.data.detail;
    //         }
    //       }
    //       setShowModal(true);
    //       setModalMessage(errorMessage);
    //     });        
    // }
  };
  const handleSubmit = (e, id) => {
    console.log("you have hit submit")
    e.preventDefault();
    e = e.target.name;
    let NewLeadUser = { ...leadUser }
    NewLeadUser.nas_pool_name = NewLeadUser.name;
    const validationErrors = validate(NewLeadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      if(ipChanged) {
        getStaticip();
        console.log("range error")
      } else {
        ippooldetails();
      }
    } else {
      console.log("errors try again", validationErrors);
    }
  }
  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
    setHasEdited(true);
    // getUsedIps();
  };
  // Sailaja added serial_no in requiredFields on 1st March 2023
  const requiredFields = [
    "nas_pool_name",
    // "nas",
    "branch",
    "serial_no",
    "ip_address_from",
    "ip_address_to",
    "description",
    "cost_per_ip",
  ];
  const { validate } = useFormValidation(requiredFields);
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setBranch([...res.data]);
        console.log(res.data);
      })
      // .catch((error) =>
      //   toast.error("error extended options", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   })
      // );
      // Modified by Marieya
      .catch((error) => {
        console.error("Error fetching branch list:", error);
        let errorMessage = "error extended options";
        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
        setShowModal(true);
        setModalMessage(errorMessage);
      });
  }, []);

  useEffect(() => {
    if (!props.rightSidebar) {
      console.log("you have reopened sidepanel")
      setErrors({});
       setIpChanged(false);
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
      setDisable(false)
    }
  }, [props.openCustomizer]);

  return (
    <Fragment>
      {token.permissions.includes(NETWORK.IPPOOLUPDATE) && (

        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }} id="edit_icon"
          onClick={clicked}
        // disabled={isDisabled}
        />
      )}

      <Container fluid={true}>
        <br />
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{ marginTop: "1%" }}>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Pool Name *</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                      }`}
                    id="afterfocus"
                    type="text"
                    name="name"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.name}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <span className="errortext">{errors.nas_pool_name}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number *</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${leadUser && leadUser.serial_no ? "not-empty" : "not-empty"
                      }`}
                    id="afterfocus"
                    type="text"
                    name="serial_no"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.serial_no}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <span className="errortext">{errors.serial_no}</span>
                </div>
              </FormGroup>
            </Col>
            {/* <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Branch</Label>
                  <select
                    className={`form-control digits not-empty`}
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    type="select"
                    name="branch"
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isDisabled}
                    value={leadUser && leadUser.branch}
                  >
                    <option style={{ display: "none" }}></option>

                    {branch.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </select>


                  <span className="errortext">{errors.branch}</span>
                </div>
              </FormGroup>
            </Col> */}


            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch *</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="branch"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.branch?.id}
                    onChange={handleChange}
                    // disabled={true}
                    // disabled={isDisabled}
                    disabled={token.permissions.includes(NETWORK.NAS_BRANCH_EDIT) ? isDisabled: true} 

                  >
                    {branch.map((ticketstatus) => {
                      if (
                        !!ticketstatus &&
                        leadUser &&
                        leadUser.branch
                      ) {
                        return (
                          <option
                            key={ticketstatus.id}
                            value={ticketstatus.id}
                            selected={
                              ticketstatus.id == leadUser.branch.id
                                ? "selected"
                                : ""
                            }
                          >
                            {ticketstatus.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">{errors.branch}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    style={{ color: "#495057", border: "none", outline: "none" }}
                    type="select"
                    name="branch"
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isDisabled}
                    value={leadUser && leadUser.name}
                  >
                    <option style={{ display: "none" }}></option>
                    {branch.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </select>
                  <Label className="placeholder_styling">Branch</Label>
                  <span className="errortext">{errors.branch}</span>
                </div>
              </FormGroup>
            </Col> */}
          <Row>
          {
                JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
                  <Col sm="4" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">NAS *</Label>
                        <Input
                          type="select"
                          name="nas"
                          className="form-control digits"
                          onChange={handleChange}
                          // disabled={true}                          
                          // disabled={isDisablednas}
                          disabled={token.permissions.includes(NETWORK.IPPOOL_NAS_EDIT) ? isDisablednas: true} 
                          // value={leadUser && leadUser.nas}
                          value={leadUser && leadUser.nas && leadUser.nas?.id} // Changed this line
                          // onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}></option>

                          {nasList1.map((nasname) => (
                            <option key={nasname.id} value={nasname.id}>
                              {nasname.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.nas && "Selection is required"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="4" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">NAS *</Label>
                        <Input
                          type="select"
                          name="nas"
                          className="form-control digits"
                          onChange={handleChange}
                          // disabled={isDisablednas}
                          disabled={token.permissions.includes(NETWORK.IPPOOL_NAS_EDIT) ? isDisablednas: true} 

                          
                          // disabled={true}                          
                          value={leadUser && leadUser.nas && leadUser.nas?.id} 
                        
                        >
                          <option style={{ display: "none" }}></option>

                          {nasList.map((nasname) => (
                            <option key={nasname.id} value={nasname.id}>
                              {nasname.name}
                            </option>
                          ))}
                        </Input>
                        <span className="errortext">
                          {errors.nas && "Selection is required"}
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                )}
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">IP Address From</Label>
                  <MaskedInput
                    {...ipprops}
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="ip_address_from"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.ip_address_from}
                    onChange={handleChange}
                    // disabled={true}
                    // disabled={isDisabled}
                    disabled={token.permissions.includes(NETWORK.IPPOOL_RANGE_EDIT) ? isDisabled: true} 
                  ></MaskedInput>
                  <span className="errortext">
                    {errors.ip_address_from && "Field is required"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">IP Address To</Label>
                  <MaskedInput
                    className={`form-control digits not-empty`}
                    {...ipprops}
                    id="afterfocus"
                    type="text"
                    name="ip_address_to"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.ip_address_to}
                    onChange={handleChange}
                    // disabled={true}
                    // disabled={isDisabled}
                    disabled={token.permissions.includes(NETWORK.IPPOOL_RANGE_EDIT) ? isDisabled: true} 
                  ></MaskedInput>
                  <span className="errortext">{errors.ip_address_to && "Field is required"}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Created At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="created_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.created_at).format(
                      "DD MMM YY"
                    )}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>

          </Row>
          <Row>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Updated At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="updated_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.updated_at).format(
                      "DD MMM YY"
                    )}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Cost Per IP</Label>

                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                      }`}
                    id="afterfocus"
                    type="input"
                    name="cost_per_ip"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.cost_per_ip}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></Input>
                  <span className="errortext">{errors.cost_per_ip}</span>
                </div>
              </FormGroup>
            </Col>
            <Col sm="12" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Description</Label>

                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                      }`}
                    id="afterfocus"
                    type="textarea"
                    name="description"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.description}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></Input>
                  <span className="errortext">{errors.description}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <h6>Remaining IP's :</h6>
            </Col>
          </Row>
          <Row>
            <Col>
              <Remaining

                leadUser={leadUser}
                setCollection={setCollection}

                collection={collection} />
            </Col>
          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={isDisabled}>
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      </Container>
    </Fragment>
  );
};

export default IppoolDetails;
