import React, { useState, useEffect } from "react";
import { Tree } from "antd";
const Multiselect = (props) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [value, setValue] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  //state for chips
  const [optionkeys, setOptionkeys] = useState([]);

useEffect(()=>{
if(props.appliedFilters.area.value.results.length == 0 && props.appliedFilters.zone.value.results.length == 0 && props.appliedFilters.branch.value.results.length == 0){
setSelectedKeys([]);
setCheckedKeys([])
}
},[props.appliedFilters]);


  useEffect(() => {
    if (props.allList) {
      let list = getList(props.allList);
    }
  }, [props.allList]);

  const getList = (arr) => {
    let list = [];
    let keys = [];
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        var branch = arr[i].name;
        const key1 = arr[i].name + "#" + Math.random();
        keys.push(key1);
        let obj1 = {
          title: arr[i].name,
          id: arr[i].id,
          value: key1,
          key: key1,
          type: "branch",
          branch: branch,
        };
        let children = [];

        if (arr[i].zones) {
          let zones = arr[i].zones;
          for (let i = 0; i < zones.length; i++) {
            const key2 = zones[i].name + "#" + Math.random();
            keys.push(key2);
            let obj2 = {
              title: zones[i].name,
              id: zones[i].id,
              value: key2,
              key: key2,
              type: "zones",
              branch: branch,
              zones: zones[i].name,
            };

            let children2 = [];
            if (zones[i].areas) {
              let areas = zones[i].areas;
              for (let i = 0; i < areas.length; i++) {
                const key2 = areas[i].name + "#" + Math.random();
                keys.push(key2);
                let obj2 = {
                  title: areas[i].name,
                  id: areas[i].id,
                  value: key2,
                  key: key2,
                  type: "areas",
                  branch: branch,
                  areas: areas[i].name,
                };
                children2.push({ ...obj2 });
              }
            }
            obj2.children = children2;
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
            } else if (c.children) {
              c.children.forEach((e) => {
                if (e.value == value[i]) {
                  newArray.push(e);
                  // newArray.push(d);
                }
              });
            }
          });
        }
      });
    }
    let branchList = [];
    let zonesList = [];
    let areaList = [];

    for (let i = 0; i < newArray.length; i++) {
      let obj = newArray[i];
      if (obj.type == "branch") {
        branchList.push(obj);
      } else if (obj.type == "zones") {
        zonesList.push(obj);
      } else if (obj.type == "areas") {
        areaList.push(obj);
      }
    }
    props.updateCustomerLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        branch: {
          value: {
            type: "array",
            results: branchList ? [...branchList] : [],
          },
        },
        zone: {
          value: {
            type: "array",
            results: zonesList ? [...zonesList] : [],
          },
        },
        area: {
          value: {
            type: "array",
            results: areaList ? [...areaList] : [],
          },
        },
      },
    }));
    // props.setFilterwithinfilter(newArray);
    // props.setOptions(
    //   [...newArray].map((d) => {
    //     return { name: d.type + " " + d.title, key: d.key };
    //   })
    // );
    // let dataClone = cloneDeep(props.filteredDataBkp.all_transactions);
    // if (newArray.length > 0) {
    //   let branches = new Set(
    //     newArray.filter((n) => n.type == "branch").map((a) => a.branch)
    //   );
    //   let franchise = new Set(
    //     newArray.filter((n) => n.type == "franchise").map((a) => a.franchise)
    //   );

    //   let filterDataFranchise = dataClone.filter((f) =>
    //     franchise.has(f.franchise)
    //   );

    //   let branches2 = filterDataFranchise.map((f) => f.branch);

    //   const filterData = dataClone.filter(
    //     (d) =>
    //       [...branches, ...branches2].includes(d.branch) ||
    //       franchise.has(d.franchise)
    //   );

    //   filterDataFranchise = filterData.filter((f) =>
    //     [...franchise, ...branches, ...branches2].includes(f.name)
    //   );

    //   props.setFiltereddata({
    //     all_transactions: [...new Set([...filterDataFranchise])],
    //   });
    //   props.setFilteredTableData({
    //     all_transactions: [...new Set([...filterDataFranchise])],
    //   });
    // } else {
    //   props.setFiltereddata({ all_transactions: dataClone });
    //   props.setFilteredTableData({ all_transactions: dataClone });
    // }

    setValue(value);
  };

  const onCheck = (checkedKeys, info) => {
    onChangeHandler(checkedKeys);
    setCheckedKeys(checkedKeys);

  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Tree
      checkable={true}
      // onExpand={onExpand}
      // expandedKeys={expandedKeys}
      // autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      // checkedKeys={checkedKeys}
      onSelect={onSelect}
      // selectedKeys={selectedKeys}
      checkedKeys={checkedKeys}
      treeData={treeData}
      // value={value}
    />
  );
};

export default Multiselect;
