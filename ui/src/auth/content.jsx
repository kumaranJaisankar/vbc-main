import React from "react";
import LOGINIMG from "../assets/images/login/loginimg.png";
const CONTENT = () => {
  return (
    <>
      <h1
        style={{
          position: "relative",
          marginTop: "80px",
          fontFamily: "Open Sans",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "50px",
          color: "#003B8D",
        }}
      >
        Welcome!
      </h1>
      <div>
        <h5 className="login_text">
          We are delighted to announce our partnership with a leading Internet
          Service Provider to offer you exceptional connectivity throughout our
          campus. Our goal is to ensure that you have fast, reliable internet
          access to support your academic and personal needs. Whether you're
          conducting research, attending virtual classes, or connecting with
          friends and family, you can count on our high-speed internet service
          to keep you connected.
          <br />
          <br />
          Stay tuned for more details on how to access and make the most of this
          exciting new service. Welcome to a more connected campus experience at
          GITAM University!
          {/* <br />
          We are a uniquely positioned internet service provider (ISP) in being
          able to provide both wireless broadband internet as well as FIBER and
          other fixed-line broadband solutions. Being able to deliver the
          mobility benefits of truly unwired/wireless internet means that
          whether inside or outside the home or office{" "}
          {process.env.REACT_APP_CLIENT_NAME} Internet can keep you secure,
          online and connected. */}
        </h5>
      </div>
      <br />
      <div>
        <img src={LOGINIMG} className="loginimg" />
      </div>
    </>
  );
};

export default CONTENT;
