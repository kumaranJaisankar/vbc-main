import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { MENUITEMS } from "./menu";
import { ArrowRight, ArrowLeft, Grid } from "react-feather";
import { Link } from "react-router-dom";
import { translate } from "react-switch-lang";
import configDB from "../../data/customizer/config";
import { DefaultLayout } from "../theme-customizer";
import { Badge } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { FontSize } from "../../constant";

const tokeInfo = JSON.parse(localStorage.getItem("token"));

// permissions
const Sidebar = (props) => {
  console.log(tokeInfo, "kum");
  console.log("list of permissions");
  const id = window.location.pathname.split("/").pop();
  const defaultLayout = Object.keys(DefaultLayout);
  const layout = id ? id : defaultLayout;

  const updatedMenu = useMemo(
    () =>
      MENUITEMS.filter(function f(o) {
        if (o?.children) {
          return (o.children = o.children.filter(f)).length;
        }
        if (tokeInfo?.permissions?.includes(o.permissionId)) return true;
      }),
    [tokeInfo && tokeInfo.permissions]
  );

  const [mainmenu, setMainMenu] = useState(updatedMenu);
  const [margin, setMargin] = useState(0);
  const [width, setWidth] = useState(0);
  const [sidebartoogle, setSidebartoogle] = useState(true);
  const wrapper =
    useSelector((content) => content.Customizer.sidebar_types.type) ||
    configDB.data.settings.sidebar.type;
  const handleScroll = () => {
    if (window.scrollY > 400) {
      if (
        configDB.data.settings.sidebar.type.split(" ").pop() ===
          "material-type" ||
        configDB.data.settings.sidebar.type.split(" ").pop() ===
          "advance-layout"
      )
        document.querySelector(".sidebar-main").className =
          "sidebar-main hovered";
    } else {
      if (document.getElementById("sidebar-main"))
        document.querySelector(".sidebar-main").className = "sidebar-main";
    }
  };
  useEffect(() => {
    document.querySelector(".left-arrow").classList.add("d-none");
    window.addEventListener("resize", handleResize);
    handleResize();

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };

    // eslint-disable-next-line
  }, [layout]);

  const handleResize = () => {
    setWidth(window.innerWidth - 500);
  };

  const toggleMenuItem = (item) => {
    const result = updatedMenu.map((menuItem) => {
      if (menuItem.id === item.id) {
        return {
          ...menuItem,
          active: !item.active,
        };
      }
      return menuItem;
    });
    setMainMenu(result);
  };

  const scrollToRight = () => {
    if (margin <= -2598 || margin <= -2034) {
      if (width === 492) {
        setMargin(-3570);
      } else {
        setMargin(-3464);
      }
      document.querySelector(".right-arrow").classList.add("d-none");
      document.querySelector(".left-arrow").classList.remove("d-none");
    } else {
      setMargin((margin) => (margin += -width));
      document.querySelector(".left-arrow").classList.remove("d-none");
    }
  };

  const scrollToLeft = () => {
    if (margin >= -width) {
      setMargin(0);
      document.querySelector(".left-arrow").classList.add("d-none");
      document.querySelector(".right-arrow").classList.remove("d-none");
    } else {
      setMargin((margin) => (margin += width));
      document.querySelector(".right-arrow").classList.remove("d-none");
    }
  };

  const closeOverlay = () => {
    document.querySelector(".bg-overlay1").classList.remove("active");
    document.querySelector(".sidebar-link").classList.remove("active");
  };

  const activeClass = () => {
    document.querySelector(".sidebar-link").classList.add("active");
    document.querySelector(".bg-overlay1").classList.add("active");
    return "active";
  };

  const openCloseSidebar = (toggle) => {
    if (toggle) {
      setSidebartoogle(!toggle);
      document.querySelector(".page-header").className =
        "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className =
        "sidebar-wrapper close_icon ";
    } else {
      setSidebartoogle(!toggle);
      document.querySelector(".page-header").className = "page-header";
      document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper ";
    }
  };

  const responsiveSidebar = () => {
    document.querySelector(".page-header").className = "page-header close_icon";
    document.querySelector(".sidebar-wrapper").className =
      "sidebar-wrapper close_icon";
  };

  const toggleSubMenuItem = ({ menuId, childrenId }) => {
    const result = updatedMenu.map((menuItem) => {
      if (!!menuItem?.children) {
        return {
          ...menuItem,
          children: menuItem?.children.map((subMenuItem) => ({
            ...subMenuItem,
            active: subMenuItem.id === childrenId ? true : false,
          })),
          active: menuItem.id === menuId ? true : false,
        };
      }
      return menuItem;
    });
    setMainMenu(result);
  };

  const showChildrenOfMenu = (menuItem) => {
    return (
      <ul
        className="sidebar-submenu"
        style={
          menuItem.active
            ? sidebartoogle
              ? {
                  opacity: 1,
                  transition: "opacity 500ms ease-in",
                  paddingLeft: "1rem",
                }
              : { display: "block", paddingLeft: "1rem" }
            : { display: "none", paddingLeft: "1rem" }
        }
      >
        {menuItem.children.map((childrenItem, index) => {
          return (
            <li key={index}>
              {childrenItem.type === "sub" && (
                <a
                  href="javascript"
                  className={`${childrenItem.active ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSubMenuItem({
                      menuId: menuItem.id,
                      childrenId: childrenItem.id,
                    });
                  }}
                >
                  {props.t(childrenItem.title)}
                  <span className="sub-arrow">
                    <i className="fa fa-chevron-right"></i>
                  </span>
                  <div className="according-menu">
                    {childrenItem.active ? (
                      <i className="fa fa-angle-down"></i>
                    ) : (
                      <i className="fa fa-angle-right"></i>
                    )}
                  </div>
                </a>
              )}
              {childrenItem.type === "link" && (
                <Link
                  to={childrenItem.path + "/" + layout}
                  className={`${childrenItem.active ? "active" : ""}`}
                  onClick={() =>
                    toggleSubMenuItem({
                      menuId: menuItem.id,
                      childrenId: childrenItem.id,
                    })
                  }
                >
                  {props.t(childrenItem.title)}
                </Link>
              )}
              {childrenItem.children && (
                <ul
                  className="nav-sub-childmenu submenu-content"
                  style={
                    childrenItem.active
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  {childrenItem.children.map((childrenSubItem, key) => {
                    return (
                      <li key={key}>
                        {childrenSubItem.type === "link" && (
                          <Link
                            to={childrenSubItem.path + "/" + layout}
                            className={`${
                              childrenSubItem.active ? "active" : ""
                            }`}
                            onClick={() => {}}
                          >
                            {props.t(childrenSubItem.title)}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Fragment>
      <div
        className={`bg-overlay1`}
        onClick={() => {
          closeOverlay();
        }}
      ></div>
      <div className="sidebar-wrapper" id="sidebar-wrapper">
        <div className="logo-wrapper">
          <Link to={`${process.env.PUBLIC_URL}/app/dashboard/${layout}`}>
            <img
              className="img-fluid for-light"
              src={require("../../assets/images/logo-3.png")}
              alt=""
              style={{
                width: "75%",
                height: "55px",
                top: "0px",
                objectFit: "contain",
              }}
            />
            <img
              className="img-fluid for-dark"
              src={require("../../assets/images/logo/logo_spark.png")}
              alt=""
            />
          </Link>
          <div className="back-btn" onClick={() => responsiveSidebar()}>
            <i className="fa fa-angle-left"></i>
          </div>
          <div
            className="toggle-sidebar"
            onClick={() => openCloseSidebar(sidebartoogle)}
          >
            <Grid className="status_toggle middle sidebar-toggle" />
          </div>
        </div>
        <div className="logo-icon-wrapper" style={{ padding: 0 }}>
          <Link to={`${process.env.PUBLIC_URL}/app/dashboard/${layout}`}>
            <img
              className="img-override"
              src={require("../../assets/images/logo/logo-icon3.png")}
              style={{
                width: "46px",
                height: "46px",
                top: "0px",
                marginBottom: "10px",
                marginTop: "10px",
                marginRight: "8px",
                borderRadius: "40px",
                border: "2px solid #CD0000",
              }}
              alt=""
            />
          </Link>
        </div>
        <nav
          className="sidebar-main"
          id="sidebar-main"
          style={{ position: "relative", top: "-20px" }}
        >
          <div className="left-arrow" onClick={scrollToLeft}>
            <ArrowLeft />
          </div>
          <div
            id="sidebar-menu"
            style={
              wrapper.split(" ").includes("horizontal-wrapper")
                ? { marginLeft: margin + "px" }
                : { margin: "0px" }
            }
          >
            <ul className="sidebar-links custom-scrollbar">
              <li className="back-btn">
                <div className="mobile-back text-right">
                  <span>{"Back"}</span>
                  <i className="fa fa-angle-right pl-2" aria-hidden="true"></i>
                </div>
              </li>
              {mainmenu.map((menuItem, i) => (
                <Fragment key={i}>
                  <li className="sidebar-list">
                    {menuItem.type === "sub" && (
                      <a
                        href="javascript"
                        className={`sidebar-link sidebar-title ${
                          menuItem.active && !menuItem.children
                            ? activeClass()
                            : ""
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          toggleMenuItem(menuItem);
                        }}
                      >
                        {menuItem.iconI !== undefined ? (
                          <i className={`fa fa-${menuItem.iconI}`}></i>
                        ) : (
                          <menuItem.icon />
                        )}
                        <span>{props.t(menuItem.title)}</span>
                        {menuItem.badge ? (
                          <label className={menuItem.badge}>
                            {menuItem.badgetxt}
                          </label>
                        ) : (
                          ""
                        )}
                        <div className="according-menu">
                          {menuItem.active ? (
                            <i className="fa fa-angle-down"></i>
                          ) : (
                            <i className="fa fa-angle-right"></i>
                          )}
                        </div>
                      </a>
                    )}
                    {menuItem.type === "link" && (
                      <Link
                        to={menuItem.path + "/" + layout}
                        className={`sidebar-link sidebar-title link-nav  ${
                          menuItem.active ? "active" : ""
                        }`}
                        onClick={() => toggleMenuItem(menuItem)}
                      >
                        <menuItem.icon />

                        {menuItem.id === 12 ? (
                          <Badge badgeContent={"NEW"} color="error">
                            <span>{props.t(menuItem.title)}</span>
                          </Badge>
                        ) : (
                          <span>{props.t(menuItem.title)}</span>
                        )}
                        {menuItem.badge ? (
                          <label className={menuItem.badge}>
                            {menuItem.badgetxt}
                          </label>
                        ) : (
                          ""
                        )}
                      </Link>
                    )}
                    {menuItem.children && showChildrenOfMenu(menuItem)}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="right-arrow" onClick={scrollToRight}>
            <ArrowRight />
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

export default translate(Sidebar);
