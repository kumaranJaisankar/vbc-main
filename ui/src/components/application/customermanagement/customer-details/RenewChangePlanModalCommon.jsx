import React, { useState, useRef, useEffect } from 'react';

import { adminaxios } from "../../../../axios";
import { NewCustomerListsRenewChangePlanModal } from "../../customermanagement/NewCustomerListsRenewChangePlanModal";

const RenewChangePlanModalCommon = props => {

  const [serviceObjData, setServiceObjData] = useState([]);

  // change plan state
  const [changeplan, setChangeplan] = useState([]);
  const [changeplanListBkp, setChangeplanListBkp] = useState([]);
  // service plan state
  const [serviceplanobj, setServiceplanobj] = useState([]);
  const [serviceplanobjbkp, setServiceplanobjbkp] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [selectID, setSelectID] = useState("");
  const ref = useRef();
  const box = useRef(null);
  const searchInputField = useRef(null);

  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current)
      searchInputField.current.value = "";
  };

  const changePlanSubmit = ({ ID, area }) => {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    adminaxios
      .get(`accounts/area/${area}/otherplans/${ID}/${customerInfo.id}`)
      .then((res) => {
        console.log(res.data,"changeplan data")
        //getting the 1st subplan of each plan data to main array
        const newArray =  res.data.map((parentObject) => {
          // Check if the parentObject has sub_plans and it's not an empty array
          if (parentObject?.sub_plans && parentObject?.sub_plans.length > 0) {
            // Destructure values from the first object in sub_plans
            const { id,package_name,parent_id,plan_cost, total_plan_cost, time_unit, unit_type, plan_cgst, plan_sgst, is_static_ip, offer_time_unit, offer_time_unit_type } = parentObject?.sub_plans[0];
        
            // Copy values to the parent object
            parentObject.id=id
            parentObject.is_static_ip=is_static_ip
            parentObject.offer_time_unit=offer_time_unit
            parentObject.offer_time_unit_type=offer_time_unit_type
            // parentObject.package_name=package_name
            parentObject.parent_id=parent_id
            parentObject.plan_cgst=plan_cgst
            parentObject.plan_cost=plan_cost
            parentObject.plan_sgst=plan_sgst
            parentObject.time_unit=time_unit
            parentObject.total_plan_cost=total_plan_cost
            parentObject.unit_type=unit_type
          }
          return parentObject;
        });
        //  setChangeplan(res.data);
        //  setChangeplanListBkp(res.data);
        setChangeplan(newArray);
        setChangeplanListBkp(newArray);
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Something went wrong", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
      });
  };
  const dataSubmit = ({ ID, customerID, area }) => {
    // setSelectID(customerID);
    adminaxios
      .get(`accounts/loggedin/${area}/plans/${ID}`)
      .then((res) => {
        setServiceplanobj(res.data);
        setServiceplanobjbkp(res.data);
      })
      .catch(function (error) {
        console.log(error);
        //  toast.error("Something went wrong", {
        //    position: toast.POSITION.TOP_RIGHT,
        //    autoClose: 1000,
        //  });
      });
  };

  const changePlanClickHandler = (service_plan_id, row_id, row_area_id) => {
    dataSubmit({ ID: service_plan_id, customerID: row_id, area: row_area_id });
    changePlanSubmit({
      ID: service_plan_id,
      area: row_area_id,
    });
  };

  useEffect(() => {
    const { service_plan, area_id, id } = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    setSelectID(id)
    changePlanClickHandler(service_plan, id, area_id);
  }, [])



  return (
    <div>
      <NewCustomerListsRenewChangePlanModal
      fetchComplaints={props.fetchComplaints}
        isRenewChangePlanModalOpen={props.isRenewChangePlanModalOpen}
        toggleRenewChangePlanModalOpen={props.toggleRenewChangePlanModalOpen}
        serviceObjData={serviceObjData}
        setServiceObjData={setServiceObjData}
        RefreshHandler={RefreshHandler}
        selectID={selectID}
        changeplan={changeplan}
        setChangeplan={setChangeplan}
        changeplanListBkp={changeplanListBkp}
        setChangeplanListBkp={setChangeplanListBkp}
        serviceplanobj={serviceplanobj}
        setServiceplanobj={setServiceplanobj}
        serviceplanobjbkp={serviceplanobjbkp}
        setServiceplanobjbkp={setServiceplanobjbkp}
        setUpdateInfoCount={props.setUpdateInfoCount}
      />
    </div>
  );
};

RenewChangePlanModalCommon.propTypes = {

};

export default RenewChangePlanModalCommon;