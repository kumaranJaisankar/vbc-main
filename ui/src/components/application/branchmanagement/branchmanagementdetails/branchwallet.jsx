import React, { Fragment, useEffect, useState, useRef } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
} from "reactstrap";
import { adminaxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import { pick } from "lodash";
import moment from "moment";
import Webcam from "react-webcam";

const BranchWallet = (props, initialValues) => {
  const { id } = useParams();
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);

  const [leadUser, setLeadUser] = useState(props.lead);

  const [formData, setFormData] = useState({});
  const [Verticalcenter, setVerticalcenter] = useState(false);

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));

  const Verticalcentermodaltoggle = () => {
    setOfflinefield(false);
    setOnlinefield(false);
    // setVerticalcenter(true);
    setVerticalcenter(!Verticalcenter)
  };
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(false);
  //image upload code
  const [image, setimage] = useState({ pictures: [] });
  const [errors, setErrors] = useState({});

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setimage({
      ...image,
      pictureFiles,
    });
  };

  //end

  const [imageUpload, setImageUpload] = useState();
  //image upload code
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);
    let preview = await getBase64(e.target.files[0]);

    setFormData((preState) => ({
      ...preState,

      payment_receipt: preview,
    }));
  }

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    } else {
      setIsOpen(true);
    }
  }, [webcamRef, setImgSrc]);

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  //end
  //state for franchise status
  const [franchiseStatus, setFranchiseStatus] = useState([]);

  useEffect(() => {
    if (props.lead) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...props.lead.address,
        },
      }));
    }
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    adminaxios.get("/accounts/branch/list").then((res) => {
      setLeadUser(res.data.map(item=>item.id === props.lead.id));
      
      // setFranchiseStatus(res.data);
    });
  }, []);

  const handleChange = (e, date) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStartDate(date.target.value);
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { ...formData };
    franchiseaxios
      .patch(`franchise/update/${id}`, data)
      .then((res) => {
        props.onUpdate(res.data);
        toast.success("Branch was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
      });
    // }
  };

  const offline = () => {
    setOfflinefield(true);
    setOnlinefield(false);
  };
  const online = () => {
    setOnlinefield(true);
    setOfflinefield(false);
  };
  const form = useRef(null);
  //add api
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);

    const data = pick(formData, [
      "paid_to",
      "payment_date",
      "amount",
      "payment_receipt",
    ]);
    data.branch = props.lead.id;
    data.payment_date = moment(formData.payment_date).format("YYYY-MM-DD");
    data.amount = parseInt(formData.amount);
    // if (noErrors) {
    franchiseaxios
      .post(`franchise/wallet/deposit`, data, config)
      .then((response) => {
        toast.success("Amount was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        this.setState({ errorMessage: error });
      });
    setVerticalcenter(!Verticalcenter);
  };

  //end
  const resetForm = function () {
    setResetStatus(true);

    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };
  const requiredFields = [];

  const { validate, Error } = useFormValidation(requiredFields);

  const resetInputField = () => {};
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //api for displying status
  useEffect(() => {
    //franchiselist
    adminaxios
      .get("/franchise/options")
      .then((res) => {
        let { status} = res.data;
        setFranchiseStatus([...status]);
        
      })
      .catch((err) => console.log(err));
  }, []);

//functin for close button in upload receipt
  const closebutton = () => {
    setIsOpen(false);
    setVerticalcenter(!Verticalcenter);
  };

  return (
    <Fragment>
      <br />
      <Container fluid={true} id="custinfo">
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            <Col sm="4">
              <Button color="primary" onClick={Verticalcentermodaltoggle}>
                Add Money
              </Button>
            </Col>

            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="wallet_amount"
                    onChange={handleChange}
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.wallet_amount}
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Wallet Amount</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="name"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.name}
                    onChange={handleChange}
                    disabled={props.isDisabled}
                  ></input>
                  <Label className="placeholder_styling">Branch Name</Label>
                </div>
              </FormGroup>
            </Col>


            
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    // value={
                    //   leadUser && leadUser.code
                    // }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <Label className="placeholder_styling">Renewal Balance</Label>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    // value={
                    //   leadUser && leadUser.code
                    // }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <Label className="placeholder_styling">
                    Outstanding Balance
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    // value={
                    //   leadUser && leadUser.code
                    // }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <Label className="placeholder_styling">No of Users</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* modal for add money */}
          <Modal
            isOpen={Verticalcenter}
            toggle={Verticalcentermodaltoggle}
            centered
          >
            <ModalHeader toggle={Verticalcentermodaltoggle}>
              Branch Wallet
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col sm="4">
                  <Button color="primary" onClick={online} id="create_button">
                    Online
                  </Button>
                </Col>
                <Col sm="4">
                  <Button color="primary" onClick={offline} id="create_button">
                    Offline
                  </Button>
                </Col>
              </Row>
              <br />
              {offlinefield ? (
                <div>
                  <Form id="myForm" onReset={resetForm} ref={form}>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              id="afterfocus"
                              name="name"
                              className={`form-control digits not-empty`}
                              style={{ border: "none", outline: "none" }}
                              value={leadUser && leadUser.name}
                              type="text"
                              disabled={true}
                              onChange={handleChange}
                            />
                            <Label className="placeholder_styling">
                              Branch Name
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              name="paid_to"
                              className={`form-control digits ${
                                formData && formData.paid_to ? "not-empty" : ""
                              }`}
                              value={formData && formData.paid_to}
                              type="text"
                              onBlur={checkEmptyValue}
                              onChange={handleChange}
                            />
                            <Label className="placeholder_styling">
                              Paid To
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              name="amount"
                              className={`form-control digits ${
                                formData && formData.amount ? "not-empty" : ""
                              }`}
                              value={formData && formData.amount}
                              type="text"
                              // onBlur={checkEmptyValue}
                              onChange={handleChange}
                            />
                            <Label className="placeholder_styling">
                              Paid Amount
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control digits not-empty"
                              type="date"
                              value={startDate}
                              name="payment_date"
                              onChange={handleChange}
                            />
                            
                            <Label
                              for="meeting-time"
                              className="placeholder_styling"
                            >
                              Date
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup style={{ textAlign: "center" }}>
                        
                          &nbsp;&nbsp;
                          <br />
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Label>Upload Recepient:</Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <span class="uploadimagekyc">
                                Upload Recepient
                                <Input
                                  name="payment_receipt"
                                  onChange={UploadImage}
                                  className="form-control"
                                  accept="image/*"
                                  type="file"
                                  id="upload"
                                  style={{
                                    paddingTop: "3px",
                                    position: "absolute",
                                    left: "0",
                                    top: "0",
                                    opacity: "0",
                                    cursor: "pointer",
                                  }}
                                />
                              </span>
                            </Col>
                            <Col>
                              <img
                                src={imgSrc}
                                style={{ width: "200px" }}
                                className="imgsrc"
                              />
                            </Col>
                          </Row>
                          <br />
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Button color="primary" onClick={capture}>
                                Capture Recepient
                              </Button>
                            </Col>
                            <Col>
                              {isOpen && (
                                <Webcam
                                  width={200}
                                  audio={false}
                                  ref={webcamRef}
                                  screenshotFormat="image/jpeg"
                                />
                              )}
                            </Col>
                          </Row>
                          <ModalFooter>
                            <Button onClick={() => setImgSrc(null)}>
                              {" "}
                              Clear
                            </Button>
                            <Button
                              color="primary"
                              onClick={() => {
                                // Verticalcentermodaltoggle();
                                setImageUpload(imgSrc);
                              }}
                            >
                              Save
                            </Button>
                          </ModalFooter>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </div>
              ) : (
                ""
              )}
              {onlinefield ? (
                <div>
                  <Row>
                    <Col sm="4">
                      <p>Provide link</p>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={submit}>
                Submit
              </Button>
              <Button color="secondary" onClick={Verticalcentermodaltoggle}>
                Close
              </Button>
              {/* <Button color="primary" onClick={Verticalcentermodaltoggle}>
                SaveChanges
              </Button> */}
            </ModalFooter>
          </Modal>
          {/* end */}

          <br />

          <Row>
            <Col sm="4">
              <button type="submit" name="submit" class="btn btn-primary">
                Save
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default BranchWallet;
