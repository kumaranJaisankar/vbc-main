import React from "react"
import {
    Container,
    Row,
    Col,
    Button
} from "reactstrap";
import LOGO1 from "../assets/images/logo-1.png";
import CONTENT from "./content";
import { useHistory } from "react-router-dom";
const Successing = () => {
    let history = useHistory();

    const backlogin = () => {
        history.push("/login");
    }
    return (
        <Container fluid={true} className="p-0">
            <Row style={{ backgroundColor: "#e4ecf8" }}>
                <Col xs="2"></Col>
                <Col xs="4">
                    <CONTENT />
                </Col>
                <Col xs="5" sm="5" lg="5" md="5">
                    <div className="login-card" style={{}}>
                        <div className="Newlogin-card">
                            {/* <div style={{marginTop:"10%"}}> */}
                            <div>
                                <a
                                    className="logo"
                                    href="index.html"
                                // style={{ marginLeft: "13%" }}
                                >
                                    <img src={LOGO1} style={{ marginLeft: "15%" }} />
                                </a>
                            </div>
                            <span
                                className="signin_text"
                                style={{ position: "relative", left: "0%" }}
                            >
                               Password has been successfully changed 
                            </span>

                            <div className="login-main login-tab">
                                <br /><br />
                                <Button
                                    style={{
                                        fontSize: "18px", fontFamily: "Open Sans",
                                        fontWeight: 600,
                                        width: "111%",
                                    }}
                                    color="primary"
                                    className="btn-block"
                                    onClick={backlogin}
                                    id="loginBtn"

                                >
                                    Back To Login
                                </Button>
                            </div>
                            {/* </div> */}
                            <div
                                class="footer1"
                                style={{ position: "relative", bottom: "-95px" }}
                            >
                                <p> Powered by SPARK RADIUS</p>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs="1"></Col>
            </Row>
        </Container>
    )
}

export default Successing