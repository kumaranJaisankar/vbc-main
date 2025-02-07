import React, {  useEffect } from "react";
import { adminaxios } from "../../../../axios";
import { Input, FormGroup, Label } from "reactstrap";
import { Tree } from "antd";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const Selectareas = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(false);

  // const sourceData = props.changesourceplan;
  // var a = sourceData.map((services) => (services.id))

  const handleChange = (panel) => (event, isExpanded) => {
    console.log(panel, "handleChange");
    setExpanded(isExpanded ? panel : false);
    props.setSelectedArea(panel);
    props.setSelectedFranchise(panel);
    props.handleOnChange([]);
    props.handleOnChangeFranchise([]);
    // props.setRadioButtonPlanId(a);
  };

  const handleFranchiseChange = (panel) => (event, isExpanded1) => {
    console.log(panel, "handleChange");
    setExpanded(isExpanded1 ? panel : false);
    props.setSelectedFranchise(panel);
    props.handleOnChangeFranchise([]);
  };
  useEffect(() => {
    adminaxios
      .get(`accounts/areahierarchy`)
      .then((res) => {
        props.setSelectedAreas(res.data.branches);
        props.setSelectedFranchises(res.data.franchises);

        console.log(res.data.branches, "selectareas");
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <FormGroup
        className="m-t-15 m-checkbox-inline custom-radio-ml"
        style={{ display: "flex" }}
      >
        <div className="" style={{ marginTop: "-7px", zIndex: "1" }}>
          <Input
            className="radio_animated"
            defaultChecked
            id="displayparent"
            type="radio"
            name="radio3"
            value={props.selectedbranchradiobutton === "branch"}
            onClick={() => {
              props.setSelectedbranchradiobutton("branch");
            }}
          />
          <Label className="mb-0" for="displayparent">
            {Option}
            <span className="digits">Branch</span>
          </Label>
        </div>
        &nbsp;&nbsp;
        <div className="" style={{ marginTop: "-7px", zIndex: "1" }}>
          <Input
            className="radio_animated"
            id="displaychild"
            type="radio"
            name="radio3"
            value={props.selectedbranchradiobutton === "franchise"}
            onClick={() => {
              props.setSelectedbranchradiobutton("franchise");
            }}
          />
          <Label className="mb-0" for="displaychild">
            {Option}
            <span className="digits">Franchise</span>
          </Label>
        </div>
      </FormGroup>

      {/*Branch Tab Accordions*/}
      <>
        {props.selectedbranchradiobutton === "branch" ? (
          <>
            {props.selectedAreas.map((d, index) => (
              <Accordion
                expanded={expanded === d.id}
                onChange={handleChange(d.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Label for="edo-ani1">
                    <Input
                      className="radio_animated"
                      type="radio"
                      id="edo-ani1"
                      name="branch"
                      value={d.id}
                      checked={props.selectedArea === d.id}
                    />

                    {d.name}
                  </Label>
                </AccordionSummary>
                <AccordionDetails>
                  <Tree
                    checkable
                    className="checkbox"
                    onCheck={props.handleOnChange}
                    checkedKeys={props.zoneSelected}
                    fieldNames={{
                      title: "name",
                      key: "name",
                      children: "areas",
                    }}
                    treeData={d.zones}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : (
          ""
        )}
      </>
      {console.log(props.selectedfranchise, "checkfranchise")}
      {/*Franchise Tab Accordions*/}
      <>
        {props.selectedbranchradiobutton === "franchise" ? (
          <>
            {props.selectedFranchises.map((d, index) => (
              <Accordion
                expanded={expanded === d.id}
                onChange={handleFranchiseChange(d.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <>
                  <Label for="edo-ani1">
                    <Input
                      className="radio_animated"
                      type="radio"
                      id="edo-ani1"
                      name="franchise"
                      value={d.id}
                      checked={props.selectedFranchise === d.id}
                    />
                    {d.name}
                  </Label>
                  </>
                </AccordionSummary>
                <AccordionDetails>
                  <Tree
                    checkable
                    className="checkbox"
                    onCheck={props.handleOnChangeFranchise}
                    checkedKeys={props.franchiseZoneSelected}
                    fieldNames={{
                      title: "name",
                      key: "name",
                      children: "areas",
                    }}
                    treeData={d.zones}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : (
          ""
        )}
      </>
    </>
  );
};
export default Selectareas;
