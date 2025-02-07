import React, { useEffect, useState } from "react";
import { servicesaxios } from "../../../../axios";
import Skeleton from "react-loading-skeleton";
import { Row, Input, Label, Table } from "reactstrap";
const SourcePlanTab = (props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    servicesaxios
      .get(`/plans/changeplan/planlist`)
      .then((res) => {
        props.setSourceplan(res.data);
        console.log(props.changesourceplan, "sorceplanData");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const sourceData = props.changesourceplan;

  return (
    <>
      {loading ? (
        <Skeleton
          count={11}
          height={30}
          style={{ marginBottom: "10px", marginTop: "15px" }}
        />
      ) : (
        <Row style={{ maxHeight: "300px", overflow: "auto" }}>
          <Table className="table-border-vertical">
            <thead>
              <tr>
                <th scope="col" id="table_id">
                  {"ID"}
                </th>
                <th scope="col">{"Package Name"}</th>
                <th scope="col">{"FUP Limit"}</th>
                <th scope="col">{"Upload Speed"}</th>
                <th scope="col">{"Download Speed"}</th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((source) => (
                <tr>
                  <td scope="row">
                    <Label className="d-block" for="edo-ani1">
                      <Input
                        className="radio_animated"
                        type="radio"
                        id="edo-ani1"
                        key={source.id}
                        value={source.id}
                        name="service_plan_id"
                        onChange={(e) => {
                          props.setRadioButtonPlanId(source.id);
                          props.setRadioButtonPlanId1(source.id);
                          props.disable(false);
                        }}
                      />
                      S{source.id}
                    </Label>
                  </td>

                  <td>{source.package_name}</td>

                  <td>{parseFloat(source.fup_limit).toFixed(0)}</td>

                  <td>
                    {parseFloat(source.upload_speed).toFixed(0) + "Mbps"}
                  </td>
                  <td>
                    {parseFloat(source.download_speed).toFixed(0) + "Mbps"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      )}
    </>
  );
};
export default SourcePlanTab;
