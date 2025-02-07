import React from "react";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";

const FrachiseMultiselect = (props) => {
    const onChange = (values) => {
        props && props.franchisedata1([...values]);
        props.setValues([...values]);
    };

    const treeProps = {
        treeData: props.data,
        treeCheckable: true,
        allowClear: true,
        style: { width: "100%" },
        fieldNames: { label: "name", value: "id" },
        showCheckedStrategy: TreeSelect.SHOW_PARENT,
        DefaultExpandAll: true,
        onChange: onChange,
        placeholder : "Search With Branch"
    };

    return <TreeSelect {...treeProps} />;
};

export default FrachiseMultiselect;
