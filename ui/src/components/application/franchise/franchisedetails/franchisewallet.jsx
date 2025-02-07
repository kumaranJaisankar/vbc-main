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
  Spinner
} from "reactstrap";
import { adminaxios, franchiseaxios, billingaxios } from "../../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import { pick } from "lodash";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import ReconnectingWebSocket from "reconnecting-websocket";

const tokenInfo = JSON.parse(localStorage.getItem("token"));
let HideAddMoney = false;
if (tokenInfo && tokenInfo.user_type === "Admin") {
  HideAddMoney = true;
}

const FranchiseWallet = (props, initialValues) => {
  const { id } = useParams();
  const [inputs, setInputs] = useState(initialValues);
  const [errorRes, setErrorRes] = useState('')
  const [leadUser, setLeadUser] = useState(props.lead);

  const [formData, setFormData] = useState({
    wallet_amount: "",
  });
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [loaderSpinneer, setLoaderSpinner] = useState(false)

  const Verticalcentermodaltoggle = () => {

    setVerticalcenter(!Verticalcenter);
  };
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(false);
  //image upload code
  const [image, setimage] = useState({ pictures: [] });
  const [errors, setErrors] = useState({});

  const onDrop = (pictureFiles) => {
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
  // added state for online recharge by marieya on 5/08/2022
  const [onlineRecharge, setOnlineRecharge] = useState({});
  const [disabledButton, setDisabledButton] = useState(false);

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
    if (!isEmpty(props.lead)) {
      setLeadUser(props.lead);
    }
  }, [props.lead]);



  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name == "payment_date") {
      setStartDate(e.target.value);
    }

    setOnlineRecharge((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { ...formData };

    franchiseaxios
      .patch(`franchise/update/${id}`, data)
      .then((res) => {
        props.onUpdate(res.data);
        toast.success("Franchise was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {

        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
      });
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
    data.franchise = props.lead.id;
    data.payment_date = moment(formData.payment_date).format("YYYY-MM-DD");
    data.amount = parseInt(formData.amount);
    data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;
    if (noErrors) {
      setVerticalcenter(true)
      setLoaderSpinner(true);
      franchiseaxios
        .post(`wallet/deposit/offline`, data, config)
        .then((response) => {
          setVerticalcenter(false)
          setLoaderSpinner(false);
          props.Refreshhandler();
          toast.success("Amount was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          props.setLead((preState) => {
            return {
              ...preState,
              wallet_amount:
                parseInt(preState.wallet_amount) + parseInt(formData.amount),
            };
          });

          setLeadUser((preState) => {
            console.log(formData);
            return {
              ...preState,
              wallet_amount:
                parseInt(preState.wallet_amount) + parseInt(formData.amount),
            };
          });
          props.onUpdate({
            ...leadUser,
            wallet_amount:
              parseInt(leadUser.wallet_amount) + parseInt(formData.amount),
          });
          props.setWalletinformationupdated(response.data);
          resetformmanually();
        })

        .catch(function (error) {
          setVerticalcenter(true)
          setLoaderSpinner(false);
          setErrorRes(error?.response?.data?.detail)
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }
        });
      resetInputField();
      // Verticalcentermodaltoggle();
    }
  };


  const requiredFields = ["amount",];

  const { validate, Error } = useFormValidation(requiredFields);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }



  //functin for close button in upload receipt

  //reset form after submission
  const resetInputField = () => { };
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };
  //end

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



  // Online Recharge Code Added by Marieya
  const onlineReacgargeWallet = () => {
    setDisabledButton(true)
    const onlineRechargeNew = {
      amount: onlineRecharge.amount,
      payload: {
        customer: {
          name: props?.lead?.franchise_basic_info?.name,

          contact: props?.lead?.franchise_basic_info?.mobile_number,

          email: props?.lead?.franchise_basic_info?.email,
        },

        product: {
          id: props?.lead?.id,

          name: props?.lead?.name,
        },
      },
    };

    billingaxios
      .post(`franchise/payment/link/get`, onlineRechargeNew)
      .then((response) => {

        if (response.data.status === 2) {
          var win = window.open(`${response.data.short_url}`, "_blank");
          win.focus();
        }
        paymentId(response.data)
        console.log(response.data);
      })
      .catch((error) => {
        setDisabledButton(false)
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
  };

  const paymentId = (response) => {
    if (response.status == 2) {
      let billingbaseurl = process.env.REACT_APP_API_URL_BILLING.split("//")[1];
      console.log(billingbaseurl, "billingbaseurl");
      let protocol = window.location.protocol ? "wss:" : "ws:";
      var ws = new ReconnectingWebSocket(
        `${protocol}//${billingbaseurl}/ws/${response.id}/listen/payment/status`
      );
      ws.onopen = () => {
        console.log("socket cnxn successful");
      };
      ws.onclose = (e) => {
        console.log("socket closed", e);
      };
      ws.onmessage = (e) => {
        console.log(e.data);
        let responseData = JSON.parse(e.data);
        if (responseData.status == 1) {
          (async function submission() {
            adminaxios.get(`wallet/amount`).then((response) => {
              localStorage.setItem(
                "wallet_amount",
                JSON.stringify(response.data.wallet_amount)
              );
              //now click the hidden button using Javascript
              document.getElementById("hiddenBtn").click();
            });
          })();
          setDisabledButton(false)
          toast.success("Recharge is completed", {
            position: toast.POSITION.TOP_RIGHT,
          });
          ws.close();
          Verticalcentermodaltoggle();
          props.dataClose();
          props.Refreshhandler();
        }
      };
    }
  };

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
            <Col sm="4" style={{ marginTop: "4%" }}>
              <Button
                color="primary"
                onClick={Verticalcentermodaltoggle}
                id="Add_money"
              >
                Add Money
              </Button>
            </Col>

            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Wallet Amount</Label>
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
                </div>
              </FormGroup>
            </Col>
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
                  <Label className="desc_label">Franchise Name</Label>
                </div>
              </FormGroup>
            </Col> */}

            {/* <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="code"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.code}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <Label className="desc_label">Franchise Code</Label>
                </div>
              </FormGroup>
            </Col> */}
            {/* <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="status"
                    className="form-control digits not-empty"
                    onBlur={checkEmptyValue}
                    onChange={handleChange}
                    disabled={props.isDisabled}
                    value={leadUser && leadUser.status && leadUser.status.id}
                    onChange={handleChange}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    {franchiseStatus.map((franchiseStatus) => (
                      <option
                        key={franchiseStatus.id}
                        value={franchiseStatus.id}
                      >
                        {franchiseStatus.name}
                      </option>
                    ))}
                  </Input>
                  <Label className="desc_label">Status *</Label>
                </div>
               
              </FormGroup>
            </Col> */}
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Renewal Balance</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.renewal_amount}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap" style={{ whiteSpace: "nowrap" }}>
                  <Label className="desc_label">Outstanding Balance</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.outstanding_balance}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">No of Customers</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.customer_count}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
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
              Franchise Wallet
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col sm="4">
                  <Button color="primary" onClick={online} id="create_button">
                    Online
                  </Button>
                </Col>
                {HideAddMoney ? (
                  <Col sm="4">
                    <Button
                      color="primary"
                      onClick={offline}
                      id="create_button"
                    >
                      Offline
                    </Button>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              <br />
              {offlinefield ? (
                <div>
                  <Form id="myForm" onReset={resetForm} ref={form}>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="desc_label">Franchise Name</Label>
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
                            <Label className="desc_label">Paid Amount *</Label>
                            <Input
                              name="amount"
                              className={`form-control digits ${formData && formData.amount ? "not-empty" : ""
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
                              // onBlur={checkEmptyValue}
                              onChange={handleChange}
                            />
                          </div>
                          <span className="errortext">{errors.amount}</span>
                          <span className="errortext">{errorRes}</span>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label for="meeting-time" className="desc_label">
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
                    <Row>
                      <Col>
                        <FormGroup style={{ textAlign: "center" }}>

                          &nbsp;&nbsp;
                          <br />
                          <Row>
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
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      onClick={submit}
                      id="submit_button_loader"
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
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
                </div>
              ) : (
                ""
              )}
              {onlinefield ? (
                <div>
                  <Form id="myForm" ref={form}>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="desc_label">Paid Amount *</Label>
                            <Input
                              name="amount"
                              className={`form-control digits ${onlineRecharge && onlineRecharge.amount
                                ? "not-empty"
                                : ""
                                }`}
                              value={onlineRecharge && onlineRecharge.amount}
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
                        </FormGroup>
                      </Col>

                    </Row>

                    <ModalFooter>
                      <Button
                        color="secondary"
                        id="submit_button_loader"
                        onClick={onlineReacgargeWallet}
                        disabled={disabledButton}
                      >
                        {disabledButton ? <Spinner size="sm" id="spinner"></Spinner> : null}
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
                  </Form>
                </div>
              ) : (
                ""
              )}
            </ModalBody>
          </Modal>

          <br />

        </Form>
      </Container>
    </Fragment>
  );
};

export default FranchiseWallet;
