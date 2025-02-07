import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { TreeSelect } from 'antd';

const { SHOW_PARENT } = TreeSelect;
const EditGstCodes = (props) => {
  const [value, setValue] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const list = getList(props.arealist);

    if (props.editRecord && props.editRecord.gst_codes) {
      const areasSelected = props.editRecord.gst_codes.map((a) => a.id);

      let finalIds = [];
      for (let i = 0; i < areasSelected.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j].value.split("#")[0] == areasSelected[i]) {
            finalIds.push(list[j].value);
          }
        }
      }

      setValue([...finalIds]);
      props.setFormData((prevState) => {
        return {
          ...prevState,
          gst_codes: [...areasSelected],
        };
      });
    } else {
      setValue([]);
      props.setFormData((prevState) => {
        return {
          ...prevState,
          gst_codes: [],
        };
      });
    }
  }, [props.arealist, props.editRecord]);

  const onChange = (value) => {
    props.setResetfield(false);
    let ids = value.map((v) => parseInt(v.split('#')[0]));

    setValue(value);
    props.setFormData((prevState) => {
      return {
        ...prevState,
        gst_codes: ids,
      };
    });
  };

  useEffect(() => {
    if (props.resetfield === true) {
      setValue([]);
      setTreeData([]);
    }
  }, [props.resetfield]);

  const getList = (arr) => {
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const key1 = arr[i].id + '#';
      let obj1 = {
        title: arr[i].name,
        value: key1,
        key: key1,
      };
      list.push(obj1);
    }
    setTreeData(list);
    return list;
  };

  const tProps = {
    treeData: treeData,
    value: value,
    onChange: onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    dropdownStyle:{ maxHeight: "300px" ,overflow:"auto"},
    style: {
      width: '100%',
    },
    getPopupContainer: (triggerNode) => triggerNode.parentNode,
  };

  if (!props.arealist || !props.editRecord) {
    return null;
  }

  return <TreeSelect {...tProps} />;
};

export default EditGstCodes;
