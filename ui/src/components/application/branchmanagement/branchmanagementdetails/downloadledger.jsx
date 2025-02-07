import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Table,
  Input,
} from "reactstrap";
import { customeraxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

const DownloadLedger = (props, initialValues) => {
  const { id } = useParams();

  const [leadUser, setLeadUser] = useState(props.lead);

  const [formData, setFormData] = useState({});
  const [download, setDownload] = useState({});

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
    if (!isEmpty(props.lead)) {
      franchiseaxios
        .get(`franchise/ledger/${props.lead.id}`)
        // .then((res) => setData(res.data))
        .then((res) => {
          console.log(res);
          setDownload(res.data);
        });
    }
  }, [props.lead]);

  //   useEffect(() => {
  //     franchiseaxios
  //       .get(`franchise/ledger/${props.lead.id}`)
  //       // .then((res) => setData(res.data))
  //       .then((res) => {
  //         console.log(res);
  //         setDownload(res.data);
  //       });
  //   }, []);

  const handleChange = (e) => {
    let addressList = [
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "state",
      "pincode",
      "country",
    ];
    if (addressList.includes(e.target.name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      setLeadUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e, id) => {
    // e.preventDefault();
    // let data = { ...formData };
    // customeraxios
    //   .patch("customers/rud/" + id, data)
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.data);
    //     props.onUpdate(res.data);
    //     toast.success("Customer Information edited successfully", {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 1000,
    //     });
    //     props.setIsdisabled(true);
    //   })
    //   .catch(function (error) {
    //     toast.error("Something went wrong", {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 1000,
    //     });
    //     console.error("Something went wrong!", error);
      // });
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
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                    value={formData && formData.follow_up}
                    type="datetime-local"
                    id="meeting-time"
                    name="follow_up"
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    From Date
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                    value={formData && formData.follow_up}
                    type="datetime-local"
                    id="meeting-time"
                    name="follow_up"
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    To Date
                  </Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Table bordered={true}
              className="table table-bordered"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th scope="col">{"Pre transaction balance"}</th>
                  <th scope="col">{"Credit"}</th>
                  <th scope="col">{"Debit"}</th>
                  <th scope="col">{"Transaction Date"}</th>
                  <th scope="col">{"Username"}</th>
                  <th scope="col">{"Payment Date"}</th>
                  <th scope="col">{"Wallet Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {/* {leadUser.map((services) => ( */}
                {!isEmpty(download) &&
                  download.map((plan) => {
                    return (
                      <tr>
                        <td scope="row">{plan.pre_transaction_balance}</td>
                        <td scope="row">{plan.credit ? plan.credit : "-"}</td>
                        <td scope="row">{plan.debit ? plan.debit : "-"}</td>
                        <td scope="row">
                          {moment(plan.transaction_date).format("YYYY-MM-DD")}
                        </td>
                        <td scope="row">{plan.payee ? plan.payee : "-"}</td>
                        <td scope="row">{plan.payment_date}</td>
                        <td scope="row">{plan.post_transaction_balance}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Row>

          <br />

          <Row>
            <Col sm="4">
              <button type="submit" name="submit" class="btn btn-primary">
                Download
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default DownloadLedger;
