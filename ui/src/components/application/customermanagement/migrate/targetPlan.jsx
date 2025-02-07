import React from "react";
import Skeleton from "react-loading-skeleton";
import { Row, Input, Label, Table } from "reactstrap";

const TargetPlan = (props) => {
  const targetData = props.planlist;

  return (
    <>
      {props.loading ? (
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
              {targetData.map((target) => (
                <tr>
                  <td scope="row">
                    <Label className="d-block" for="edo-ani1">
                        <Input
                        className="radio_animated"
                        type="radio"
                        id="edo-ani1"
                        key={target.id}
                        value={target.id}
                        name="target_plan"
                        onChange={(e) => {
                          props.setRadioButtonTargetPlanId(target.id);
                          props.disable(false);
                        }}
                      />
                      S{target.id}
                    </Label>
                  </td>

                  <td>{target.package_name}</td>

                  <td>{parseFloat(target.fup_limit).toFixed(0)}</td>

                  <td>
                    {parseFloat(target.upload_speed).toFixed(0) + "Mbps"}
                  </td>
                  <td>
                    {parseFloat(target.download_speed).toFixed(0) + "Mbps"}
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
export default TargetPlan;
