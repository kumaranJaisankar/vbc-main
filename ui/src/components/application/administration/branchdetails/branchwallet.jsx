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
  Input,Spinner
} from "reactstrap";
import { adminaxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import { pick } from "lodash";
import moment from "moment";

const tokenInfo = JSON.parse(localStorage.getItem("token"));
let BranchHideAddMoney = true;
if (tokenInfo && tokenInfo.user_type === "Branch Owner") {
  BranchHideAddMoney = false;
}

const BranchWallet = (props, initialValues) => {
  const { id } = useParams();
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);
 //to disable button
 const [disable, setDisable] = useState(false);
  const [leadUser, setLeadUser] = useState(props.lead);

  const [formData, setFormData] = useState({});
  const [Verticalcenter, setVerticalcenter] = useState(false);

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const[errorRes, setErrorRes]= useState('')
  const Verticalcentermodaltoggle = (props) => {
    setOfflinefield(false);
    setOnlinefield(false);
    // setVerticalcenter(true);
    setVerticalcenter(!Verticalcenter);
    setErrors(false);
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

  //image upload code
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  //state for paid to list of customers dropdown
  const [paidtolist, setPaidtolist] = useState([]);
  //end

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
    adminaxios.get("/accounts/branch/display").then((res) => {
      setLeadUser(res.data.find((item) => item.id === props.lead.id));
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
    setLoaderSpinner(true);
    e.preventDefault();
    let data = { ...formData };
    franchiseaxios
      .patch(`accounts/branch/${id}/rud`, data)
      .then((res) => {
        setLoaderSpinner(false);
        props.onUpdate(res.data);
        toast.success("Branch was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {
        setLoaderSpinner(false);
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
    setVerticalcenter(true)
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
    data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;

    if (noErrors) {
      setDisable(true)
      adminaxios
        .post(`wallet/deposit/offline`, data, config)
        .then((response) => {
          setVerticalcenter(false)
          setDisable(false)
          toast.success("Amount was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          resetformmanually();
          setLeadUser((preState) => {
            return {
              ...preState,
              wallet_amount:
                parseInt(preState.wallet_amount) + parseInt(formData.amount),
            };
          });
          props.dataClose();
          props.setWalletinformationupdated(response.data);
        })
        .catch(function (error) {
          setVerticalcenter(true)
          setDisable(false)
          setErrorRes(error?.response?.data?.detail)
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }
          // this.setState({ errorMessage: error });
        });
    }
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
  const requiredFields = ["amount"];

  const { validate, Error } = useFormValidation(requiredFields);

  const resetInputField = () => {};
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //functin for close button in upload receipt
  const closebutton = () => {
    setIsOpen(false);
    setVerticalcenter(!Verticalcenter);
  };

  const resetformmanually = () => {
    // setVerticalcenter(true);

    setFormData({
      wallet_amount: "",
      paid_to: "",
      // payment_receipt: "",
    });
    document.getElementById("resetid").click();
  };
  //api for paid to field while adding money
  useEffect(() => {
    adminaxios.get(`accounts/users?user_type=STAFF`).then((res) => {
      setPaidtolist([...res.data]);
    });
  }, []);
  //end
  return (
    <Fragment>
      <br />
      <Container fluid={true} id="custinfo">
        <Form
          id="myForm"
          onReset={resetForm}
          ref={form}
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            {BranchHideAddMoney ? (
              <Col sm="4">
                <Button
                  color="primary"
                  onClick={Verticalcentermodaltoggle}
                  id="Add_money"
                >
                  Add Money
                </Button>
              </Col>
            ) : (
              ""
            )}
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
                  <Label className="form_label">Wallet Amount</Label>
                </div>
              </FormGroup>
            </Col>
            {/* <Col sm="4">
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
            </Col> */}
          </Row>
          <br />
          <Row>
            {/* <Col md="3">
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
            </Col> */}

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
                  <Label className="form_label">Renewal Balance</Label>
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
                  <Label className="form_label">Outstanding Balance</Label>
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
                  <Label className="form_label">No of Users</Label>
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
                    <Row style={{ marginBottom: "-5%", marginTop: "7%" }}>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">Branch Name</Label>
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
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="desc_label"> Collected By *</Label>
                            <Input
                            className="form-control digits not-empty"
                            type="test"
                            value={JSON.parse(localStorage.getItem("token"))?.username}
                            name="paid_to"
                            onChange={handleChange}
                            disabled={true}
                          >
                            </Input>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              top: "14%",
                              left: "73%",
                            }}
                          ></div>
                        </FormGroup>
                      </Col>
                     
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">Paid Amount *</Label>
                            <Input
                              name="amount"
                              className={`form-control digits ${
                                formData && formData.amount ? "not-empty" : ""
                              }`}
                              value={formData && formData.amount}
                              type="number"
                              min="0"
                              onKeyDown={(evt) =>
                                (evt.key === "e" ||
                                  evt.key === "E" ||
                                  evt.key === "." ||
                                  evt.key === "-") &&
                                evt.preventDefault()
                              }
                              onChange={handleChange}
                            />
                          </div>
                          <span className="errortext">
                            {errors.amount && "Field is required"}
                          </span>
                          <span className="errortext">{errorRes}</span>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label for="meeting-time" className="kyc_label">
                              Date
                            </Label>
                            <Input
                              className="form-control digits not-empty"
                              type="date"
                              value={startDate}
                              name="payment_date"
                              onChange={handleChange}
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "-14%" }}>
                      <Col>
                        <FormGroup style={{ textAlign: "center" }}>
                          &nbsp;&nbsp;
                          <Row id="branchwallet">
                            <Col style={{ textAlign: "left" }}>
                              <Label>Receipt</Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <span class="uploadimagekyc">
                                Upload Receipt
                                <Input
                                  name="payment_receipt"
                                  onChange={UploadImage}
                                  className="form-control"
                                  accept="image/*"
                                  type="file"
                                  id="craete_button"
                                  // id="upload"
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
              <Button  onClick={submit} id="submit_button_loader"  disabled={disable}>
              {disable ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                Submit
              </Button>
              <Button
                color="secondary"
                onClick={Verticalcentermodaltoggle}
                id="resetid"
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
          {/* end */}

          <br />

          <Row>
            <Col sm="4">
              <button
                type="submit"
                name="submit"
                class="btn btn-primary"
                id="save_button_loader"
            disabled={loaderSpinneer? loaderSpinneer:loaderSpinneer}
              >
            {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}&nbsp;
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
