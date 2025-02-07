import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  FormGroup,
  Nav,
  Table,
} from "reactstrap";
import { PlusCircle } from "react-feather";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CreateNewProject } from "../../../constant";

const Project = (props) => {
  const [activeUsers, setActiveUsers] = useState([]);
  useEffect(() => {
   let protocol = window.location.protocol ? "wss:" : "ws:"
    var ws = new WebSocket(
      `${protocol}//${window.location.host}/ws/userlist/${Date.now()}`
    );
    ws.onopen = () => {
      console.log("connected websocket main component");
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log("Socket is closed");
    };

    ws.onmessage = (e) => {
      setActiveUsers(JSON.parse(e.data));
    };
    let timer = setInterval(() => {
      ws.send("hello");
    }, 3000);

    return (() => {
      console.log("i am unloading");
      clearInterval(timer);
    })
  }, []);

  const allProject = useSelector((content) => content.Projectapp.all_Project);
  const doingProject = useSelector(
    (content) => content.Projectapp.doing_Project
  );
  const doneProject = useSelector((content) => content.Projectapp.done_Project);

  return (
    // <Fragment>
    // <br/>
    <Container fluid={true}>
      <br />
      <Row>
        <Col md="12" className="project-list">
          <Card>
            <Row>
              <Col sm="6">
                <Nav tabs className="border-tab">
                  <h4>User List</h4>
                </Nav>
              </Col>
              <Col sm="6">
                <div className="text-right">
                  <FormGroup className="mb-0 mr-0"></FormGroup>
                  <Link
                    className="btn btn-primary"
                    style={{ color: "white" }}
                    to={`${process.env.PUBLIC_URL}/app/project/create-user/${process.env.REACT_APP_API_URL_Layout_Name}`}
                  >
                    {" "}
                    <PlusCircle />
                    {CreateNewProject}
                  </Link>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col" style={{border:"none"}}>{"Id"}</th>
                    <th scope="col" style={{border:"none"}}>{"Username"}</th>
                    <th scope="col" style={{border:"none"}}>{"Status"}</th>
                    <th scope="col" style={{border:"none"}}>{"Login time"}</th>
                    <th scope="col" style={{border:"none"}}>{"Connection type"}</th>
                    <th scope="col" style={{border:"none"}}>{"Upload consumption"}</th>
                    <th scope="col" style={{border:"none"}}>{"Download consumption"}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsers.map((user) => (
                    <tr>
                      <th scope="row">{user.radacctid}</th>
                      <td>
                        {" "}
                        <Link
                          to={`${process.env.PUBLIC_URL}/app/project/userlog/${user.username}/${process.env.REACT_APP_API_URL_Layout_Name}`}
                        >
                       
                          {" "}
                          {user.username}{" "}
                        </Link>
                      </td>
                      <td>
                        {user.acctstoptime ? (
                          <button type="button" class="btn btn-danger">
                            Inactive
                          </button>
                        ) : (
                          <button type="button" class="btn btn-success">
                            &nbsp; active &nbsp;
                          </button>
                        )}
                      </td>
                      <td>{user.acctstarttime}</td>
                      <td>{user.nasporttype ? user.nasporttype : "---"}</td>
                      <td>
                        {parseFloat(
                          user.acctinputoctets / 1024 / 1024 / 1024
                        ).toFixed(2)}
                        GB
                      </td>
                      <td>
                        {parseFloat(
                          user.acctoutputoctets / 1024 / 1024 / 1024
                        ).toFixed(2)}{" "}
                        GB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
    // </Fragment>
  );
};

export default Project;
