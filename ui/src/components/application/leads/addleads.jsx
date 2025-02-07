import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap";
import { default as axiosBaseURL, adminaxios } from "../../../axios";
// import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import AddressComponent from "./AddressComponent";
import useFormValidation from "../../customhooks/FormValidation";
import {
  assignUser,
  frequency,
  leadStatus as leadStatusJson,
} from "./ConstatantData";
import { isEmpty } from "lodash";
// Sailaja imported common component Sorting on 27th March 2023
import { Sorting } from "../../common/Sorting";
import ErrorModal from "../../common/ErrorModal";

const AddLeads = (props, initialValues) => {
  const [assign, setAssign] = useState();
  const [date, setDate] = useState();
  const [leadstatus, setLeadstatus] = useState();
  const [assignedTo, setAssignedTo] = useState([]);
  const [selectZone, setSelectZone] = useState([]);
  const [Qualified, setQualified] = useState();
  const [openedBy, setOpenedBy] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [sourceby, setSourceby] = useState([]);
  const [typeby, setTypeby] = useState([]);
  const [statusby, setStatusby] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [selectdept, setSelectdept] = useState([]);
  //state for area api only for zonalmanager
  const [getareas, setGetAreas] = useState([]);
  // const [getareas1, setGetAreas1] = useState([]);

  const [getzoneareas, setGetZoneAreas] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_no: "",
    alternate_mobile_no: "",
    email: "",
    type: "",
    house_no: "",
    street: "",
    district: "",
    pincode: "",
    status: "",
    assign: "",
    assigned_to: "",
    lead_source: "",
    notes: "",
    landmark: "",
    googleAddress: "",

  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  const [roleData, setRoleData] =useState([])
  const storageToken = localStorage.getItem("token");
  const token = JSON.parse(storageToken);
  let ShowAreas = false;
if (
  (token && token.user_type === "Zonal Manager") ||
  (token && token.user_type === "Staff") ||
  (token && token.user_type === "Help Desk") ||
  (token && token.user_type === "Franchise Owner")
) {
  ShowAreas = true;
}

let DisplayAreas = false;
if (
  (token && token.user_type === "Admin") ||
  (token && token.user_type === "Super Admin") ||
  (token && token.user_type === "Branch Owner")
) {
  DisplayAreas = true;
}

  // draft
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
    }
  }, [props.lead]);

  const handleInputChange = (event) => {
    event.persist();
    // draft
    props.setIsDirtyFun(true);
    setResetStatus(false);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }))
    }
    let val = event.target.value;
    if (name == "branch") {
      getlistoffranchises(val);
    }
    if (name == "franchise") {
        getlistofzones(val)
    }
    if (name == "zone") {
        getlistofareas(val)
    }
    if (name == 'departments'){
      getUserlistRole(val)
    }
  };

  useEffect(() => {
    props.setformDataForSaveInDraft(formData);
    if ((formData && formData.status) || (formData && formData.assign)) {
      setDate(formData.status);
      setLeadstatus(formData.assign);
    }
  }, [formData]);

  useEffect(() => {
    axiosBaseURL
      .get("/accounts/options/lead/ticket/creation/user")
      .then((res) => {
        let { users } = res.data;
        setOpenedBy([...users]);
      })
      .catch((err) =>
        console.log(err)
      )

    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { users,roles } = res.data;
        setAssignedTo([...users]);
        setRoleData([...roles])
      })
      .catch((err) =>
        console.log(err)
      );
  }, []);

  //source,type list
  useEffect(() => {
    axiosBaseURL
      .get("/radius/lead/options")
      .then((res) => {
        let { lead_source, type, status } = res.data;
        // setSourceby([...lead_source]);
        // Sailaja sorting the Leads (Add Panel) ->Lead Source Dropdown data as alphabetical order on 27th March 2023
        setSourceby(Sorting(([...lead_source]),"name"));
        // setTypeby([...type]);
        // Sailaja sorting the Leads(Add Panel) ->Lead Type Dropdown data as alphabetical order on 27th March 2023
        setTypeby(Sorting(([...type]),"name"));
        setStatusby([...status]);
      })
      .catch((err) =>
        // toast.error("error getting lead options", {
        //   position: toast.POSITION.TOP_RIGHT,
        // })
        console.log(err)
      )
  }, [])

  //zone list
    useEffect(() => {
      adminaxios
        .get("accounts/loggedin/areas")
        .then((res) => {
          let { areas } = res.data;
          setSelectZone([...areas]);
        })
        // .catch((err) =>
        //   toast.error("error getting area list", {
        //     position: toast.POSITION.TOP_RIGHT,
        //   })
        // );
        .catch((err) => {
          setShowModal(true);
          setModalMessage("Error getting area list");
        });
      // adminaxios
      //   .get("accounts/department/list")
      //   .then((res) => {
      //     setSelectdept([...res.data]);
      //   })
      //   .catch((err) => {
      //     setShowModal(true);
      //     setModalMessage("Error getting department list");
      //   });
    }, []);

  const resetformmanually = () => {
    setFormData({
      first_name: "",
      last_name: "",
      mobile_no: "",
      alternate_mobile_no: "",
      email: "",
      type: "",
      house_no: "",
      street: "",
      district: "",
      pincode: "",
      status: "",
      assign: "",
      assigned_to: "",
      lead_source: '',
      notes: '',
      area: '',
      googleAddress: ''

    })
    document.getElementById('resetid').click()
    document.getElementById('myForm').reset()
    setDate('')
    setLeadstatus('')

  }

  //form submit
  const addDetails = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const obj = sourceby.find((i) => i.id == formData.lead_source);
    const typeobj = typeby.find((t) => t.id == formData.type);

    let submitdata = {
      ...formData,
      lead_source: {
        id: obj.id,
        name: obj.name,
      },
      type: {
        id: formData.type,
        name: typeobj.name,
      },

      house_no: !isEmpty(formData.house_no) ? formData.house_no : "N/A"

    }
    console.log(submitdata, "formDatadetails")
    submitdata.department = null;
    if (submitdata.alternate_mobile_no === "") {
      delete submitdata.alternate_mobile_no;
    }
    delete submitdata.departments;
    delete submitdata.googleAddress;
    delete submitdata.branch;
    delete submitdata.franchise;
    delete submitdata.zone;
    

    axiosBaseURL
      .post("radius/lead/create/partial", submitdata, config)
      .then((response) => {
        setLoaderSpinner(false)
        let responsedata = { ...response.data }
        console.log(response.data, "addinglead")
        // let leadsourceobj = sourceby.find((s) => s.id == submitdata.lead_source)




        // responsedata.lead_source = leadsourceobj

        // let typeobj = typeby.find((s) => s.id == submitdata.type)
        // responsedata.type = typeobj
        props.onUpdate(responsedata);
        // toast.success("Lead was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        setShowModal(true);
        setModalMessage("Lead was added successfully");
        resetformmanually();
        // props.dataClose()
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false)
      //   if (error.response && error.response.status === 400) {
      //     toast.error(error.response.data, {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   }
      // });
      // Modified by Marieya
      // .catch((error) => {
      //   setLoaderSpinner(false);
      //   if (error.response && error.response.status === 400) {
      //     // instead of showing a toast notification, we set the modalMessage and showModal
      //     setModalMessage(error.response.data);
      //     setShowModal(true);
      //   }

      // });      
      .catch((error) => {
        setLoaderSpinner(false);
        // Check if the error response from server is defined and if it has a status of 400
        if (error.response && error.response.status === 400) {
          // If there is an error message from server, set it as the modal message, otherwise, set the modal message to "Something went wrong"
          let errorMessage = error.response.data ? error.response.data : "Something went wrong";
          setModalMessage(errorMessage);
          setShowModal(true);
        } else {
          // If the error is not from the server or does not have a status of 400, set the modal message to "Something went wrong"
          setModalMessage("Something went wrong");
          setShowModal(true);
        }
      });      
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually()
      setErrors({})
    }
    // draft
    setFormData(props.lead);
  }, [props.rightSidebar]);

  const submit = (e) => {
    console.log("clicked")
    e.preventDefault();
    e = e.target.name;
    let dataNew = {...formData}
    dataNew.select_branch = formData.branch ?formData.branch :JSON.parse(localStorage.getItem("token"))?.branch?.name
    dataNew.select_franchise = formData.franchise ? formData.franchise : JSON.parse(localStorage.getItem("token"))?.franchise?.name
    dataNew.select_zone =formData.zone
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    console.log("Validation Errors:", validationErrors); // Here's the console log for errors
    if (noErrors) {
      addDetails()
    }
    // else {
    //   toast.error("errors try again", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000
    //   })
    // }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const requiredFields = [
    'first_name',
    "select_branch",
    "select_franchise",
    "select_zone",
    'last_name',
    "house_no",
    'mobile_no',
    'alternate_mobile_no',
    'street',
    'district',
    'pincode',
    'lead_source',
    'type',
    'notes',
    'status',
    'state',
    'city',
    'landmark',
    'country',
    'email',
    'area',
    'house_no'
  ]

  const { validate } = useFormValidation(requiredFields)
  const resetForm = function () {
    setResetStatus(true);
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj
    })
    setErrors({})
  }
  const form = useRef(null);
  // Sailaja Added Form validation styles on 1st August
  // Form Validation Starts from here

  let dependency = formData["customer_documents"];

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      console.log("called");
      checkFieldValidity("customer_documents");
    }
  }, [dependency]);

  const checkFieldValidity = (fieldName, parent) => {
    console.log("called");
    const validationErrors = validate(formData);
    let vErrors = {};
    if (validationErrors[fieldName]) {
      vErrors[fieldName] = validationErrors[fieldName];
    }

    console.log(vErrors);

    const noErrors = Object.keys(vErrors).length === 0;

    if (noErrors) {
      setErrors({ ...errors, ...{ [fieldName]: "" } });
    }
    setErrors({ ...errors, ...{ [fieldName]: vErrors[fieldName] } });
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //This function will be used for validation of individual fields
  const handleInputBlur = (e, fieldName, parent) => {
    checkEmptyValue(e);
    checkFieldValidity(fieldName, parent);
  };
  // Form validations ended here
  // changed validations based on defects for all fields by Marieya on 5/08/22

  const [branchlist, setbranchList] = useState([]);

  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setbranchList([...res.data]);
 // Sailaja sorting the Leads ->  Branch Dropdown data as alphabetical order on 27th March 2023
        setbranchList(Sorting(([...res.data]),"name"));


      })
      .catch((err) => console.log(err));
  }, []);


  //franchise list
  const [onfilterbranch, setOnfilterbranch] = useState([]);

  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        // setOnfilterbranch(response.data);
          // Sailaja sorting the Leads -> Franchise Dropdown data as alphabetical order on 27th March 2023
       setOnfilterbranch(Sorting((response?.data),'name'));  
      
       })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  const [reportszone, setReportszone] = useState([]);
  // get zone list
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        // setReportszone(response.data);
   // Sailaja sorting the Leads -> Zone Dropdown data as alphabetical order on 27th March 2023
   setReportszone(Sorting((response?.data),'name'));  
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  const getAreasforZNMR = () => {
    console.log(ShowAreas,"ShowAreas")
    return (
      <>
        {ShowAreas
          ? adminaxios
            .get(`accounts/areahierarchy`)
            .then((res) => {
              setGetAreas(res.data);

              setReportszone(res.data.franchises.zones);
            })
            .catch((error) => {
              console.log(error);
            })
          : ""}
      </>
    );
  };

  useEffect(() => {
    getAreasforZNMR();
    console.log("useeffect")
  }, []);

  // get area list
  const [reportsarea, setReportsarea] = useState([]);
  const getlistofareas = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        // setReportsarea(response.data);
        // Sailaja sorting the Leads -> Area Dropdown data as alphabetical order on 27th March 2023
        setReportsarea(Sorting((response?.data),'name'));  
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });

  };


  useEffect(() => {
     //franchise list
    if(JSON.parse(localStorage.getItem("token"))?.branch?.id === JSON.parse(localStorage.getItem("token"))?.branch?.id){

      adminaxios
        .get(
          `franchise/${JSON.parse(localStorage.getItem("token"))?.branch?.id
          }/branch`
        )
        .then((response) => {
          setOnfilterbranch(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }else{

    }
    //commented this code due to zonal manager changes
// zone list
// if(JSON.parse(localStorage.getItem("token"))?.franchise?.id === JSON.parse(localStorage.getItem("token"))?.franchise?.id){
//   adminaxios
//   .get(
//     `franchise/${JSON.parse(localStorage.getItem("token"))?.franchise?.id
//     }/zones`
//   )
//   .then((response) => {
//     setReportszone(response.data);
//   })
//   .catch(function (error) {
//     console.error("Something went wrong!", error);
//   });
// }else{

// }
// area list based on zone

if(JSON.parse(localStorage.getItem("token"))?.zone?.id === JSON.parse(localStorage.getItem("token"))?.zone?.id ){
  adminaxios
  .get(`accounts/zone/${JSON.parse(localStorage.getItem("token"))?.zone?.id}/areas`)
  .then((response) => {
    setReportsarea(response.data);
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
  });
}else{

}

  }, []);


  // based on role getting assign to field

  const [roleUser, setroleUser] = useState([])

  const getUserlistRole = (val)=>{
    adminaxios.get(`accounts/lead/${val}`).then((res)=>{
      setroleUser(res.data)
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
  }

  return (
    <Fragment>
      <Container fluid={true}>
        <Row className="form_layout">
          <Col sm="12">
            <Form id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        First Name *
                      </Label>
                      <Input
                        // (Start)Remove Error msg by Clicking next tab validation for First Name Field

                        onBlur={(e) => handleInputBlur(e, "first_name")}
                        name="first_name"
                        onChange={handleInputChange}
                        value={formData && formData.first_name}
                        className={`form-control digits ${formData && formData.first_name ? '' : ''}`}
                        // onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.first_name}</span>

                    {/*(End) Remove Error msg by Clicking next tab validation fired for First Name Field */}

                    {/*(End) Remove Error msg by Clicking next tab validation fired for First Name Field */}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Last Name *</Label>
                      <Input
                        // draft
                        // (Start)Remove Error msg by Clicking next tab validation fired for Last Name Field
                        onBlur={(e) =>
                          handleInputBlur(e, "last_name")
                        }

                        className={`form-control digits ${formData && formData.last_name ? '' : ''}`}
                        value={formData && formData.last_name}
                        type="text"
                        name="last_name"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />

                    </div>
                    <span className="errortext">{errors.last_name}</span>
                    {/*(End) Remove Error msg by Clicking next tab validation for Last Name Field */}

                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Mobile Number *</Label>
                      <Input
                        // draft
                        // (Start)Remove Error msg by Clicking next tab validation fired for Mobile Number Field

                        onBlur={(e) =>
                          handleInputBlur(e, "mobile_no")
                        }
                        className={`form-control digits ${formData && formData.mobile_no ? '' : ''}`}
                        value={formData && formData.mobile_no}
                        type="tel"
                        name="mobile_no"
                        onChange={handleInputChange}
                      //onBlur={checkEmptyValue} {/*Sailaja Commeted out this function for form_validation  & added handleInputBlur */}
                      />
                    </div>
                    <span className="errortext">{errors.mobile_no}</span>


                    {/*(End) Remove Error msg by Clicking next tab validation fo Mobile Number Field */}

                    {/*(End) Remove Error msg by Clicking next tab validation fo Mobile Number Field */}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" style={{ whiteSpace: "nowrap", width: "110%" }}>
                        Alternate Mobile Number
                      </Label>
                      <Input
                        // draft
                        /* Sailaja Added width Style id="moveup" on 13th July */
// Sailaja Adde onBlur Function for Alternate Mobile Number fiels on 13th March 2023                        style={{ width: "110%" }}
                        className={`form-control digits ${formData && formData.alternate_mobile_no ? '' : ''}`}
                        value={formData && formData.alternate_mobile_no}
                        type="tel"
                        name="alternate_mobile_no"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                        onBlur={(e) =>
                          handleInputBlur(e, "alternate_mobile_no")
                        }
                         />

                    </div>
                    <span className="errortext">{errors.alternate_mobile_no}</span>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Email ID *</Label>
                      <Input
                        // draft
                        // (Start)Remove Error msg by Clicking next tab validation for Email Field

                        onBlur={(e) =>
                          handleInputBlur(e, "email")
                        }

                        className={`form-control digits ${formData && formData.email ? '' : ''}`}
                        // className={`form-control digits ${formData && formData.email ? '' : ''}`}
                        value={formData && formData.email?.toLowerCase()}
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                      />

                    </div>
                    <span className="errortext">{errors.email}</span>
                  </FormGroup>
                </Col>
               
              </Row>
              <Row>
                
                {/* <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Department/Role *</Label>
                      <Input
                        type="select"
                        name="role"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {roleData.map((typeofrole) => (
                          <option key={typeofrole.id} value={typeofrole.id}>
                            {typeofrole.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.roles && "Please select Role Field"}
                    </span>
                  </FormGroup>
                </Col> */}
                {/* <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Assign To *</Label>
                      <Input
                        type="select"
                        name="roles"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {roleUser.map((roleuser) => (
                          <option key={roleuser.id} value={roleuser.id}>
                            {roleuser.username}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.roles && "Please select Role Field"}
                    </span>
                  </FormGroup>
                </Col> */}
              </Row>
              {/* calling address component */}
              {/*Sailaja added handleInputBlur function for form_validation on 4th August*/}
              <AddressComponent
                handleInputChange={handleInputChange}
                checkEmptyValue={checkEmptyValue}
                errors={errors}
                setFormData={setFormData}
                formData={formData}
                setInputs={setInputs}
                resetStatus={resetStatus}
                setResetStatus={setResetStatus}
                handleInputBlur={handleInputBlur}
                // setIsDirtyFun={props.setIsDirtyFun}
                showLatLng={false}
              />
              <Row>
                <p className="assign">Assign</p>
              </Row>
              <Row>
              {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (<Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch </Label>
                      <Input
                        className={`form-control digits not-empty`}
                        value={
                          JSON.parse(localStorage.getItem("token"))?.branch?.name
                        }
                        type="text"
                        name="branch"
                        onChange={handleInputChange}
                        style={{ textTransform: "capitalize" }}
                        disabled={true}
                      />
                    </div>
                  </FormGroup>
                </Col>) : (
                  <Col sm="3" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          Select Branch *
                        </Label>
                        <Input onBlur={(e) =>
                          handleInputBlur(e, "branch")
                        }
                          type="select"
                          className={`form-control digits ${formData && formData.area ? "" : ""
                            }`}
                          value={formData && formData.branch}
                          name="branch"
                          onChange={handleInputChange}
                        >
                          <option style={{ display: "none" }}></option>
                          {branchlist.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">{errors.select_branch}</span>
                    </FormGroup>
                  </Col>
                )}
                {JSON.parse(localStorage.getItem("token"))?.franchise?.name ? (
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap" id="moveup">
                        <Label className="kyc_label">Franchise </Label>
                        <Input
                          type="text"
                          name="franchise"
                          className="form-control digits"
                          onChange={handleInputChange}
                          disabled={true}
                          value={
                            JSON.parse(localStorage.getItem("token"))?.franchise?.name
                          }
                        ></Input>
                      </div>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="3" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          Select Franchise *
                        </Label>
                        <Input onBlur={(e) =>
                          handleInputBlur(e, "franchise")
                        }
                          type="select"
                          className={`form-control digits ${formData && formData.area ? "" : ""
                            }`}
                          value={formData && formData.franchise}
                          name="franchise"
                          onChange={handleInputChange}
                        >
                          <option style={{ display: "none" }}></option>
                          {onfilterbranch.map((franchise) => (
                            <option key={franchise.id} value={franchise.id}>
                              {franchise.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">{errors.select_franchise}</span>
                    </FormGroup>
                  </Col>
                )}
                {JSON.parse(localStorage.getItem("token"))?.zone?.name ? (
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap" id="moveup">
                        <Label className="kyc_label">Zone </Label>
                        <Input
                          type="text"
                          name="zone"
                          className="form-control digits"
                          onChange={handleInputChange}
                          disabled={true}
                          value={
                            JSON.parse(localStorage.getItem("token"))?.zone?.name
                          }
                        ></Input>
                      </div>
                    </FormGroup>
                  </Col>) : (
                  <Col sm="3" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          Select Zone *
                        </Label>
                        <Input onBlur={(e) =>
                          handleInputBlur(e, "zone")
                        }
                          type="select"
                          className={`form-control digits ${formData && formData.zone ? "" : ""
                            }`}
                          value={formData && formData.zone}
                          name="zone"
                          onChange={handleInputChange}
                        >
                          <option style={{ display: "none" }}></option>
                          {reportszone?.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">{errors.select_zone}</span>
                    </FormGroup>
                  </Col>)
                }
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Select Area *
                      </Label>
                      <Input onBlur={(e) =>
                        handleInputBlur(e, "area")
                      }
                        type="select"
                        className={`form-control digits ${formData && formData.area ? "" : ""
                          }`}
                        value={formData && formData.area}
                        name="area"
                        onChange={handleInputChange}
                      >
                        <option style={{ display: "none" }}></option>
                        {reportsarea.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.area && 'Selection is required'}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Lead Source *
                      </Label>
                      <Input
                        type="select"
                        name="lead_source"
                        // draft
                        className={`form-control digits ${formData && formData.lead_source ? "" : ""
                          }`}
                        value={formData && formData.lead_source}
                        onChange={handleInputChange}
                        //onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation & added handleInputBlur */}
                        onBlur={(e) =>
                          handleInputBlur(e, "lead_source")
                        }
                      >
                        <option style={{ display: "none" }}></option>

                        {sourceby.map((categories) => (
                          <option key={categories.id} value={categories.id}>
                            {categories.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.lead_source && 'Selection is required'}</span>
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Lead Type *</Label>
                      <Input
                        type="select"
                        name="type"
                        // draft
                        className={`form-control digits ${formData && formData.type ? "" : ""
                          }`}
                        value={formData && formData.type}
                        onChange={handleInputChange}
                        //onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation & added handleInputBlur */}
                        onBlur={(e) =>
                          handleInputBlur(e, "type")
                        }
                      >
                        <option style={{ display: "none" }}></option>

                        {typeby.map((types) => (
                          <option key={types.id} value={types.id}>
                            {types.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.type && 'Selection is required'}</span>

                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        {' '}
                        Lead Status *
                      </Label>
                      <Input
                        type="select"
                        name="status"
                        // draft
                        className={`form-control digits ${formData && formData.status ? "" : ""
                          }`}
                        value={formData && formData.status}
                        onChange={(event) => {
                          handleInputChange(event);
                          setQualified(event.target.value);
                          setDate(event.target.value);
                          setAssign("");
                        }}
                        //onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation & added handleInputBlur */}
                        onBlur={(e) =>
                          handleInputBlur(e, "status")
                        }
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {leadStatusJson.map((leadStatus) => {
                          return (
                            <option value={leadStatus.id}>
                              {leadStatus.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">{errors.status && 'Selection is required'}</span>

                  </FormGroup>
                </Col>
              </Row>
              {/* Qualified Lead */}
              <Row>
                <Col sm="3" hidden={date != 'QL'} id="moveup">
                  {/* <Label className="kyc_label">
                        Assign Status
                      </Label> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Assign Status
                      </Label>
                      <Input
                        type="select"
                        name="assign"
                        // draft
                        className={`form-control digits ${formData && formData.assign ? "" : ""
                          }`}
                        value={formData && formData.assign}
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                          setLeadstatus(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {assignUser.map((assigningUser) => {
                          return (
                            <option value={assigningUser.id}>
                              {assigningUser.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3" hidden={leadstatus != "NOW" } id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Role</Label>
                      <Input
                        type="select"
                        // draft
                        className={`form-control digits ${formData && formData.department ? "" : ""
                          }`}
                        value={formData && formData.department}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        name="departments"
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {roleData.map((selectadmin) => {
                          return (
                            <option value={selectadmin.id}>
                              {selectadmin.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3" hidden={leadstatus != "NOW"} id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Assign To</Label>
                      <Input
                        type="select"
                        name="assigned_to"
                        // draft
                        className={`form-control digits ${formData && formData.assigned_to ? "" : ""
                          }`}
                        value={formData && formData.assigned_to}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {roleUser.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.id}>
                            {assignedto.username}
                          </option>
                        ))}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4" hidden={date != "QL"} id="moveup">
                  <h6 className="text-left">Follow Up Date</h6>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits ${formData && formData.follow_up ? "" : ""
                          }`}
                        value={formData && formData.follow_up}
                        type="datetime-local"
                        id="meeting-time"
                        name="follow_up"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        maxLength="15"
                      />
                      <Label for="meeting-time" className="kyc_label"></Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="3" hidden={date != "QL"} id="moveup">
                  {/* <h6 className="text-left">Frequency</h6> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Frequency</Label>
                      <Input
                        type="select"
                        name="frequency"
                        // draft
                        className={`form-control digits ${formData && formData.frequency ? "" : ""
                          }`}
                        value={formData && formData.frequency}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {frequency.map((frequencyUser) => {
                          return (
                            <option value={frequencyUser.id}>
                              {frequencyUser.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              {/* OPEN LEAD */}
              <Row>
                <Col sm="3" hidden={date != "OPEN"} id="moveup">
                  <h6 className="text-left">Follow Up</h6>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits ${formData && formData.follow_up ? "" : ""
                          }`}
                        value={formData && formData.follow_up}
                        type="datetime-local"
                        id="meeting-times"
                        name="follow_up"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        maxLength="15"
                      />
                      <Label
                        for="meeting-times"
                        className="placeholder_styling"
                      ></Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="3" hidden={date != "OPEN"} id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Frequency</Label>
                      <Input
                        type="select"
                        name="frequency"
                        // draft
                        className={`form-control digits ${formData && formData.frequency ? "" : ""
                          }`}
                        value={formData && formData.frequency}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {frequency.map((frequencyUser) => {
                          return (
                            <option value={frequencyUser.id}>
                              {frequencyUser.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Notes *</Label>
                      <Input
                        type="textarea"
                        // draft
                        className={`form-control digits ${formData && formData.notes ? "" : ""
                          }`}
                        value={formData && formData.notes}
                        name="notes"
                        rows="3"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue} {/*Sailaja Commeted out this function for form_validation & added handleInputBlur */}
                        onBlur={(e) =>
                          handleInputBlur(e, "notes")
                        }
                      />

                      <span className="errortext">{errors.notes}</span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <span className="sidepanel_border" style={{ position: "relative", top: "0px" }}></span>
                {/* Sailaja Changed Create Button ID on 15th July Ref LED-29 */}
                {/*Added spinner to create button in lead by Marieya on 28.8.22*/}
                <Col>
                  <FormGroup className="mb-0" style={{ float: "left" }}>
                    <Button
                      name="autoclose2Toast"
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                      onClick={submit}
                      id="create_button"
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm" id="spinner"> </Spinner> : null} &nbsp;
                      {"Create"}
                    </Button>
                    <Button type="reset" color="btn btn-secondary" id="resetid"

                      onClick={() => resetformmanually()}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      {/* . */}
      </Container>
    </Fragment>
  );
};

export default withRouter(AddLeads);
