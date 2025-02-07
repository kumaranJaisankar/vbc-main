import React, { Fragment } from "react";
import Breadcrumb from "../../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent
} from "reactstrap";

import { Redirect } from "react-router-dom";
import axios from "axios";
import {default as axiosBaseURL } from "../../../axios";
class UserProfile extends React.Component {
  // documentData;
  userData;
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        groupname: "",
        attribute: "",
        op: "Mikrotik",
        download: "",
        upload: "",
        datalimit: "",
        submit:""
        
      },
      redirect: false,
      input: {},
      errors: {},
      modalSignup: false,
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
  }

  componentDidMount() {
    // this.clearForm();
    this.userData = JSON.parse(localStorage.getItem('newprofile'));
    if (localStorage.getItem('newprofile')) {
      this.setState({
        userData: {
          groupname: this.state.userData.groupname,
          attribute: "",
          op: "Mikrotik",
          download: this.state.userData.download,
          upload:this.state.userData.upload ,
          datalimit: this.state.userData.datalimit,
          submit:""
          
        },
  })
} else {
  this.setState({
    userData: {
      groupname: "",
      attribute: "",
      op: "Mikrotik",
      download: "",
      upload: "",
      datalimit: "",
      submit:""
      
    },
  })
}
  }


  clearForm = () => {
    document.getElementById("myForm").reset(); 
    this.setState({
      userData: {
        groupname: "",
        attribute: "",
        op: "Mikrotik",
        download: "",
        upload: "",
        datalimit: "",
        
      },
    })
  }


  handleInputChange(event) {
    
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({
      input,
    });

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        this.state.hobbies[value] = value;
      } else {
        this.state.hobbies.splice(value, 1);
      }
    } else {
      this.setState({
        userData: {
          ...this.state.userData,
          [name]: value,
        
        },
      });
    }
  }

  submit = (e) => {
    
    e.preventDefault();
    localStorage.setItem('newprofile',JSON.stringify(this.state));
    // this.clearForm()
    console.log(this.state);
    if (this.validate()) {
      // console.log(this.state);

      let input = {};
      input["groupname"] = "";
      input["upload"] = "";
      input["download"] = "";
      input["datalimit"] = "";
      input["submit"]=""

      this.setState({ input: input });

      var config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axiosBaseURL
        .post("/radius/group", this.state.userData, config)

        .then((response) => {
          if (response.data === true) {
            // console.log(response)
            // alert("enter new profiel details")
            this.setState({ redirect: true });
          } else  {
            this.toggleSignup();
          }

          // console.log(response);
        })
        .catch(function (error) {
          console.log(error);
          // this.setState({ errorMessage: error });
        });
    }
  };

  
  toggleSignup = () => {
   
    this.clearForm();
  
    this.setState({
      // ...initialstate,
      modalSignup: !this.state.modalSignup,
      // userData:{
      //   groupname:this.state.groupname,
      //   upload:'',
      //   download:'',
      //   datalimit:""
      // }
    });
   
  };

  validate() {
    let input = this.state.input;
    let errors = {};
    let isValid = true;
    //validation for name field
    if (!input["groupname"]) {
      isValid = false;
{/* Sailaja changed validation msg text as guided by QA team on 3rd August  */}
      errors["submit"] = "Mandatory fields cannot be null";
      errors["groupname"]=<i style={{color:"#ff6666",fontSize:"30px"}} className="icofont icofont-exclamation"></i>
    }
    //validation for upload speed
    if (!input["upload"]) {
      isValid = false;
      errors["submit"] = "Mandatory fields cannot be null";
      errors["upload"]=<i style={{color:"#ff6666",fontSize:"30px"}} className="icofont icofont-exclamation"></i>

    } 
    // else if (typeof input["upload"] !== "undefined") {
    //   var pattern = new RegExp(/^\d+$/);
    //   if (!pattern.test(input["upload"])) {
    //     isValid = false;
    //     errors["upload"] = "Upload speed cannot be negative";
    //   }
    // }
    //
    //validation for download speed
    if (!input["download"]) {
      isValid = false;
      errors["submit"] = "Mandatory fields cannot be null";
      errors["download"]=<i style={{color:"#ff6666",fontSize:"30px"}} className="icofont icofont-exclamation"></i>

    }
    //  else if (typeof input["download"] !== "undefined") {
    //   var pattern = new RegExp(/^\d+$/);
    //   if (!pattern.test(input["download"])) {
    //     isValid = false;
    //     errors["download"] = "Download speed cannot be negative";
    //   }
    // }
    //
    //validation for data limit
    if (!input["datalimit"]) {
      isValid = false;
      errors["submit"] = "Mandatory fields cannot be null";
      errors["datalimit"]=<i style={{color:"#ff6666",fontSize:"30px"}} className="icofont icofont-exclamation"></i>

    }
    //  else if (typeof input["datalimit"] !== "undefined") {
    //   var pattern = new RegExp(/^\d+$/);
    //   if (!pattern.test(input["datalimit"])) {
    //     isValid = false;
    //     errors["datalimit"] = "Data Limit cannot be negative";
    //   }
    // }
    //

    this.setState({
      errors: errors,
    });

    return isValid;
  }
  //popup

  //
  render() {
    const { errorMessage } = this.state;
    let output = null;

    if (this.state.redirect) {
      output = (
        <Redirect
          to={`${process.env.PUBLIC_URL}/app/project/profile-list/${process.env.REACT_APP_API_URL_Layout_Name}`}
        />
      );
    }

    if (!this.state.redirect) {
      output = (
        <div className="edit-profile">
          <br />
          <h3>Create New Profile</h3>
          <Row>
            <Col md="12">
              <Card>
                <div>
                  <div class="row">
                    <div class="col-md-6 offset-md-3">
                      <br />
                      <br />
                      <h3> Create profile</h3>
                      <br />
                      <form onSubmit={this.submit} id="myForm">
                        {errorMessage}
                        <div class="form-row">
                          <div class="form-group col-md-6">
                            <label>Profile Name :</label>
                            <div>
                            <input
                            
                              type="text"
                              maxLength="15"
                              class="form-control"
                              name="groupname"
                              value={this.state.userData.groupname}
                              onChange={this.handleInputChange}
                              
                              
                            />
                            <div style={{position:"absolute",top:"50%",left:"83%"}}>
                            {this.state.errors.groupname}
                            </div>
                              {/* <span id="error-icon"style={{position:"absolute",top:"47%",left:"85%",color:"red",fontSize:"21px"}}><i className="icofont icofont-exclamation"></i></span> */}
                              </div>
                            {/* <div style={{ color: "red" }}>
                              {this.state.errors.groupname}
                            </div> */}
                          </div>

                          <div class="form-group col-md-6">
                            <label>Vendor :</label>
                            <select
                              class="form-control"
                              name="op"
                              onChange={this.handleInputChange}
                              value={this.state.userData.op}
                            >
                              <option selected>Select Vendor</option>
                              <option value="ip Unplugged">
                                {" "}
                                ip Unplugged{" "}
                              </option>
                              <option value="Issanni"> Issanni </option>
                              <option value="ITK"> ITK </option>
                              <option value="Juniper"> Juniper </option>
                              <option value="KarlNet"> KarlNet </option>
                              <option value="Livingston"> Livingston </option>
                              <option value="Local-Web"> Local-Web </option>
                              <option value="Lucent"> Lucent </option>
                              <option value="Merit"> Merit </option>
                              <option value="Microsoft"> Microsoft </option>
                              <option value="Mikrotik" selected>
                                {" "}
                                Mikrotik{" "}
                              </option>
                              <option value="Motorola"> Motorola </option>
                              <option value="Navini"> Navini </option>
                              <option value="Netscreen"> Netscreen </option>
                              <option value="Nokia"> Nokia </option>
                              <option value="Nomadix"> Nomadix </option>
                              <option value="Nortel"> Nortel </option>
                              <option value="NTUA"> NTUA </option>
                              <option value="Packeteer"> Packeteer </option>
                              <option value="Patton"> Patton </option>
                            </select>
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="form-group col-md-6">
                            <label>Upload Speed:</label>
                            <input
                              type="number"
                              min="0"
                              onKeyDown={(evt) =>
                                (evt.key === "e" ||
                                  evt.key === "E" ||
                                  evt.key === "." ||
                                  evt.key === "-") &&
                                evt.preventDefault()
                              }
                              class="form-control"
                              name="upload"
                              onChange={this.handleInputChange}
                              value={this.state.userData.upload}
                            />
                             <div style={{position:"absolute",top:"50%",left:"83%"}}>
                            {this.state.errors.upload}
                            </div>
                            {/* <div style={{ color: "red" }}>
                              {this.state.errors.upload}
                            </div> */}
                          </div>

                          <div class="form-group col-md-6">
                            <label>Download Speed:</label>
                            <input
                              type="number"
                              min="0"
                              onKeyDown={(evt) =>
                                (evt.key === "e" || evt.key === "E" ||  evt.key === "." || evt.key === "-") &&
                                evt.preventDefault()
                              }
                              class="form-control"
                              name="download"
                              onChange={this.handleInputChange}
                              value={this.state.userData.download}
                            />
                             <div style={{position:"absolute",top:"50%",left:"83%"}}>
                            {this.state.errors.download}
                            </div>
                            {/* <div style={{ color: "red" }}>
                              {this.state.errors.download}
                            </div> */}
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-6">
                            <label>Data Limit :</label>
                            <input
                              type="number"
                              min="0"
                              onKeyDown={(evt) =>
                                (evt.key === "e" || evt.key === "E" ||  evt.key === "." || evt.key === "-") &&
                                evt.preventDefault()
                              }
                              class="form-control"
                              name="datalimit"
                              onChange={this.handleInputChange}
                              value={this.state.userData.datalimit}
                            />
                            <div style={{position:"absolute",top:"50%",left:"83%"}}>
                            {this.state.errors.datalimit}
                            </div>
                            {/* <div style={{ color: "red" }}>
                              {this.state.errors.datalimit}
                            </div> */}
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="col-md-12 text-center">
                            <button type="submit"  name="submit" class="btn btn-primary">
                              Submit 
                            </button>
                            <div style={{ color: "#FB6059",marginTop:"20px" }}>
                             <h6> {this.state.errors.submit}</h6>
                            </div>
                            <Modal
                              isOpen={this.state.modalSignup}
                              toggle={this.toggleSignup}
                            >
                             
                           <div className="modal-content">
                              <ModalHeader  toggle={this.toggleSignup} style={{backgroundColor:"#b8daff"}}>
                               <h5>Username already exists</h5>
                              
                              </ModalHeader>
                              <ModalBody style={{textAlign:"center"}}>
                                <h6>Please enter new name</h6>
                              </ModalBody>
                            </div>
                            </Modal>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <br />
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return <>{output}</>;
  }
}

export default UserProfile;