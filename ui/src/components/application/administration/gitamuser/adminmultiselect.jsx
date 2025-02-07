// import React, { useEffect } from "react";
// import { TreeSelect } from "antd";
// import "antd/dist/antd.css";

// const AdminMultiselect = (props) => {
//   const onChange = (values) => {
//     console.log("selected.....", values);
//     props.setValues([...values]);
//   };

//   const treeProps = {
//     treeData: props.data,
//     treeCheckable: true,
//     allowClear: true,
//     style: { width: "100%" },
//     fieldNames: { label: "name", value: "id" },
//     placeholder: props.placeholder,
//     showCheckedStrategy: TreeSelect.SHOW_PARENT,
//     DefaultExpandAll: true,
//     onChange: onChange,
//   };

//   return <TreeSelect {...treeProps} />;
// };

// export default AdminMultiselect;
import React from "react";
import { TreeSelect } from "antd";

const AdminMultiselect = (props) => {

  const onChange = (values) => {
    console.log("Received values:", values); // This will show you the raw values received from the TreeSelect
    const zonesObjects = values.map(id => ({ id: id }));
    props.setValues(zonesObjects);
    props.setCheckedZones(values)
    props.setSelectedIds(values)
    // props.setSelectedZones(prevZones => [...prevZones, ...values]);
  };  

  // Construct treeData only with parent nodes
  const treeData = props.data.map(item => ({
    title: item.name, // Changed 'label' to 'title' as per antd documentation
    value: item.id
  }));

  // Extract the ids from the selectedValues
  //const selectedIds = props.selectedValues.map(zone => zone?.id);
  const treeProps = {
    treeData: treeData,
    treeCheckable: true,
    allowClear: true,
    style: { width: "120%"},
    placeholder: props.placeholder || "Select a zone",
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    defaultExpandAll: true,
    onChange: onChange,
    value: props?.selectedIds?.length > 0 ? props?.selectedIds : undefined // If selectedIds has values, they're the default selected ones. If it's empty, allow for new selections.
  };

  return <TreeSelect {...treeProps} />;
};

export default AdminMultiselect; 