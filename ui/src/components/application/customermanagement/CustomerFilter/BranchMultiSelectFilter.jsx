import React, { useState, useEffect } from "react";
import { Tree } from "antd";
import cloneDeep from "lodash/cloneDeep";
import { adminaxios } from "../../../../axios";
import Multiselect from "./multiselectcheckbox";

const BranchMultiSelectFilter = (props) => {
  const [value, setValue] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [formData, setFormData] = useState([]);
  const [resetfield, setResetfield] = useState(false);

  //   useEffect(() => {

  //   }, [branchdata]);

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  return (
    <Multiselect
      allList={props.branchdata}
      setFormData={setFormData}
      resetfield={resetfield}
      setResetfield={setResetfield}
      updateCustomerLists={props.updateCustomerLists}
      appliedFilters={props.appliedFilters}
    />
  );
};

export default BranchMultiSelectFilter;
