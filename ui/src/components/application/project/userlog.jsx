import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "reactstrap";
import {default as axiosBaseURL } from "../../../axios";

const UserLog = (props) => {
  const { username } = useParams();

  const [userLogs, setUserLogs] = useState({});
  const [profileName, setProfileName] = useState("");
  useEffect(() => {
    axiosBaseURL.get("/radius/user/" + username + "/logs")
      // fetch("https://4d668c7d1e99.ngrok.io/radius/user/testuser10/logs")
      .then((response) => response.json())
      .then((json) => {
        setUserLogs(json[0]);
      });
  }, []);

  function submit() {
    let data = {
      username: userLogs.username,
      groupname: profileName,
    };
    axiosBaseURL.post("/radius/user/update", {
      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserLogs((prevState) => ({
          ...prevState,
          upload_speed: data.upload,
          download_speed: data.download,
        }));
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function disconnect() {
    let data = {
      username: userLogs[0].username,
      groupname: profileName,
    };

    axiosBaseURL.post("/radius/user/testuser10/disconnect", {
     // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleInputChange(event) {
    setProfileName(event.target.value);
  }

  const displayTotaltime = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  };

  let options = () => {
    let opt = [];
    if (userLogs.groupnames) {
      opt = userLogs.groupnames.map((team, index) => (
        <option key={index} value={team}>
          {team}
        </option>
      ));
    }
    return opt;
  };
  // console.log(options)

  return (
    <Fragment>
      <br />
      <h6 style={{ padding: "20px" }}> Name : {username}</h6>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col md="12">
              <Card>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    {/* {userLogs.map((user) => ( */}
                    <tbody>
                      <tr>
                        <td style={{ border: "none" }}>Username</td>
                        <th style={{ border: "none" }}>{userLogs.username}</th>
                        <td style={{ border: "none" }}>Creation date </td>
                        <th style={{ border: "none" }}>
                          {userLogs.creationdate}
                        </th>
                      </tr>
                      <tr>
                        <td style={{ border: "none" }}>Created by</td>
                        <th style={{ border: "none" }}>
                          {userLogs.creationby}
                        </th>
                        <td style={{ border: "none" }}>Last update</td>
                        <th style={{ border: "none" }}>
                          {userLogs.updatedate ? userLogs.updatedate : "---"}
                        </th>
                      </tr>
                      <tr>
                        <td style={{ border: "none" }}>Status</td>
                        <th style={{ border: "none" }}>
                          {userLogs.acctstoptime ? (
                            <button type="button" class="btn btn-danger">
                              Inactive
                            </button>
                          ) : (
                            <button type="button" class="btn btn-success">
                              &nbsp; active &nbsp;
                            </button>
                          )}
                        </th>
                        <td style={{ border: "none" }}>Total No.Of logins</td>
                        <th style={{ border: "none" }}>
                          {userLogs.number_of_sessions}
                        </th>
                      </tr>
                      <tr>
                        <td style={{ border: "none" }}>Total login time</td>
                        <th style={{ border: "none" }}>
                          {displayTotaltime(userLogs.total_activity_time)}
                        </th>
                        <td style={{ border: "none" }}> Profile</td>
                        <th style={{ border: "none" }}>
                          <select
                            className="form-control"
                            onChange={handleInputChange}
                          >
                            <option>{userLogs.current_group_name}</option>
                            {options()}

                            {/* */}
                          </select>
                        </th>
                      </tr>
                      <tr>
                        <td style={{ border: "none" }}>Upload speed</td>
                        <th style={{ border: "none" }}>
                          {userLogs.upload_speed}
                        </th>
                        <td style={{ border: "none" }}>Download speed</td>
                        <th style={{ border: "none" }}>
                          {userLogs.download_speed}
                        </th>
                      </tr>
                      <div style={{ padding: "20px" }}>
                        <button
                          type="button"
                          class="btn btn-success newuser"
                          onClick={submit}
                        >
                          Submit
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          class="btn btn-danger newuser"
                          onClick={disconnect}
                        >
                          Disconnect User
                        </button>
                      </div>
                    </tbody>
                    {/* ))}  */}
                  </table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default UserLog;
