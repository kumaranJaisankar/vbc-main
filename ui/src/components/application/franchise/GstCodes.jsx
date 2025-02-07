import React, { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";
const GstCodes = (props) => {
  const onChange = (value) => {
    let ids = [];
    for (let i = 0; i < value.length; i++) {
      const obj = treeData.find((d) => d.value === value[i]);
      if (!obj) {
        ids.push(value[i]);
      } else {
        const childIds = obj.children.map((c) => c.value);
        ids.push(...[...childIds, value[i]]);
      }
    }


    const valueWithoutKey = value.map((v) => parseInt(v.split("#")[0]));
    props.setFormData((prevState) => {
      return {
        ...prevState,
        gst_codes: valueWithoutKey

      }
    });
  }
  const [treeData, setTreeData] = useState([]);


  useEffect(() => {
    if (props.data) {
      const list = getList(props.data)
    }


  }, [props.data])


  

  const getList = (arr) => {
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const key1 = arr[i].id + '#' + Math.random();
      let obj1 = {
        title: arr[i].name + " " +"(" + arr[i].code + ")",
        value: key1,
        key: key1,
        id: arr[i].id
      };
      let children = [];

      if (arr[i].sub_plans) {
        let sub_plans = arr[i].sub_plans;
        for (let i = 0; i < sub_plans.length; i++) {
          const key2 = sub_plans[i].id + '#' + Math.random();
          let obj2 = {
            title: sub_plans[i].name,
            value: key2,
            key: key2,
            parentid: obj1.id
          };
          children.push({ ...obj2 });
        }
      }
      obj1.children = children;
      list.push(obj1);
    }
    setTreeData(list);
    return list;

  }



  const treeProps = {
    treeData: treeData,
    treeCheckable: true,
    allowClear: true,
    style: { width: "100%", },
    dropdownStyle: { maxHeight: "300px", overflow: "auto" },
    fieldNames: { label: "title", value: "value" },
    placeholder: props.placeholder,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    onChange: onChange,

  }
  return (
    <>
      {treeData && <TreeSelect {...treeProps} />}
    </>
  )
}
export default GstCodes;




