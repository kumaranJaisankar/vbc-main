import React from "react";
import {TreeSelect} from "antd";
import "antd/dist/antd.css";

const MultiSelectDropDown = (props)=>{

    const onChange = (values)=>{
        console.log("selected.....",values);
        props.setValues([...values])

    }

    const treeProps = {
        treeData : props.data,
        treeCheckable : true,
        allowClear : true,
        style : {width:"100%"},
        fieldNames:{label:"name",value:"id"},
        placeholder : props.placeholder,
        showCheckedStrategy : TreeSelect.SHOW_PARENT,
        DefaultExpandAll : true,
        onChange : onChange,
    }

    return (
        <TreeSelect {...treeProps}/>
    )
}

export default MultiSelectDropDown;