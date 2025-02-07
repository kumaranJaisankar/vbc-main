import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
// import './index.css';
import { Tree, Checkbox } from "antd";
import cloneDeep from "lodash/cloneDeep";

const Multiselect = (props) => {
  const [value, setValue] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  //state for chips
  const [optionkeys, setOptionkeys] = useState([]);
  //end
  useEffect(() => {
    let list = [];
    if (props.allList) {
      list = getList(props.allList.branches);
    }
    if (props.editRecord && props.editRecord.areas) {
      const areasSelected = props.editRecord.areas.map((a) => {
        return a.id;
      });

      let ids = [];
      if (list) {
        list.forEach((l) => {
          if (l.children) {
            l.children.forEach((a) => {
              ids.push(a.value);
            });
          } else {
            ids.push(l.value);
          }
        });
      }
      let finalIds = [];
      for (let i = 0; i < areasSelected.length; i++) {
        for (let j = 0; j < ids.length; j++) {
          if (ids[j].includes(areasSelected[i])) {
            finalIds.push(ids[j]);
          }
        }
      }

      setValue([...finalIds]);
    } else {
      setValue([]);
    }
  }, [props.allList, props.editRecord]);

  const selectALL = (e) => {
    if (e.target.checked) {
      setValue([...allKeys]);
      onChangeHandler([...allKeys]);
    } else {
      setValue([]);
      onChangeHandler([]);
    }
  };

  useEffect(() => {
    onChangeHandler(props.optionKeys);
  }, [props.optionKeys]);

  const onChangeHandler = (value) => {
    let ids = [];
    let newArray = [];
    for (let i = 0; i < value.length; i++) {
      treeData.forEach((d) => {
        if (d.value === value[i]) {
          newArray.push(d);
        } else if (d.children) {
          d.children.forEach((c) => {
            if (c.value == value[i]) {
              newArray.push(c);
              // newArray.push(d);
            }
          });
        }
      });
    }
    props.setFilterwithinfilter(newArray);
    props.setOptions(
      [...newArray].map((d) => {
        return { name: d.type + " " + d.title, key: d.key };
      })
    );
    let dataClone = cloneDeep(props.filteredDataBkp.all_transactions);
    if (newArray.length > 0) {
      let branches = new Set(
        newArray.filter((n) => n.type == "branch").map((a) => a.branch)
      );
      let franchise = new Set(
        newArray.filter((n) => n.type == "franchise").map((a) => a.franchise)
      );

      let filterDataFranchise = dataClone.filter((f) =>
        franchise.has(f.franchise)
      );

      let branches2 = filterDataFranchise.map((f) => f.branch);

      const filterData = dataClone.filter(
        (d) =>
          [...branches, ...branches2].includes(d.branch) ||
          franchise.has(d.franchise)
      );

      filterDataFranchise = filterData.filter((f) =>
        [...franchise, ...branches, ...branches2].includes(f.name)
      );

      props.setFiltereddata({
        all_transactions: [...new Set([...filterDataFranchise])],
      });
      props.setFilteredTableData({
        all_transactions: [...new Set([...filterDataFranchise])],
      });
    } else {
      props.setFiltereddata({ all_transactions: dataClone });
      props.setFilteredTableData({ all_transactions: dataClone });
    }

    setValue(value);
  };

  //useeffect
  useEffect(() => {
    if (props.resetfield === true) {
      setValue([]);
      setTreeData([]);
    }
  }, [props.resetfield]);

  const getList = (arr) => {
    let list = [];
    let keys = [];
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        var branch = arr[i].branch;
        const key1 = arr[i].branch + "#" + Math.random();
        keys.push(key1);
        let obj1 = {
          title: arr[i].branch,
          value: key1,
          key: key1,
          type: "branch",
          branch: branch,
        };
        let children = [];

        if (arr[i].franchises) {
          let franchises = arr[i].franchises;
          for (let i = 0; i < franchises.length; i++) {
            const key2 = franchises[i].franchise + "#" + Math.random();
            keys.push(key2);
            let obj2 = {
              title: franchises[i].franchise,
              value: key2,
              key: key2,
              type: "franchise",
              branch: branch,
              franchise: franchises[i].franchise,
            };
            children.push({ ...obj2 });
          }
        }
        obj1.children = children;
        list.push(obj1);
      }
    }

    setTreeData(list);
    setAllKeys(keys);
    setValue([...keys]);
    return list;
  };

  const tProps = {
    treeData: treeData,
    treeCheckable: true,
    defaultExpandAll: true,
    style: {
      width: "100%",
    },
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    onChangeHandler(checkedKeys);
  };

  return (
    <>
      {/* <Checkbox onChange={(e)=>selectALL(e)} style={{marginLeft: '23px'}}
 checked={allKeys.length === value.length}
 indeterminate={allKeys.length >value.length && value.length> 0}>Select All
 </Checkbox> */}
      <Tree
        {...tProps}
        checkable
        onSelect={onSelect}
        onCheck={onCheck}
        checkedKeys={[...value]}
      />
    </>
  );
};

export default Multiselect;
