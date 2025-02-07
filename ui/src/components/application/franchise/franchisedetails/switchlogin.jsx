import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form} from "reactstrap";
import { adminaxios, customeraxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";

const SwitchLogin = (props) => {
  const { id } = useParams();

  const [leadUser, setLeadUser] = useState(props.lead);

  const [formData, setFormData] = useState({});

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
    franchiseaxios
      .get("franchise/display")
      // .then((res) => setData(res.data))
      .then((res) => {
        console.log(res);
        setLeadUser(res.data);
      });
  }, []);

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
    e.preventDefault();
    let data = { ...formData };
    customeraxios
      .patch("customers/rud/" + id, data)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        props.onUpdate(res.data);
        toast.success("Customer Information edited successfully", {
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
  };

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    console.log(formData, "form value");
// alert("hi");
let data2 = {}
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(formData);

    adminaxios
      .post(`/accounts/franchise/${props.lead.id}/user/login`,data2, config)
      .then((response) => {
        console.log(response.data);
        toast.success("Hi", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        // localStorage.removeItem('token');
        localStorage.setItem(response.data)
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
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
          <Row></Row>

          <br />

          <Row>
            <Col sm="4">
              <button
                type="submit"
                name="submit"
                class="btn btn-primary"
                onClick={submit}
              >
                Switch Login
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default SwitchLogin;
