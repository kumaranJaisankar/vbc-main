import React, { useEffect, useMemo, useCallback, useState } from "react";
import { flattenDeep } from "lodash";
import Button from '@mui/material/Button';
import { Tree } from "antd";

const getAllKeys = data => {
  const nestedKeys = data.map(node => {
    let childKeys = [];
    if (node.childs) {
      childKeys = getAllKeys(node.childs);
    }
    return [childKeys, node.id];
  });
  return flattenDeep(nestedKeys);
};

let halfCheckedNodeKeys = []

function findHalfChecked(data, selectedKeys) {
  if (data?.childs) {
    const childrenLength = data?.childs?.filter((item) =>
      selectedKeys?.includes(item.id)
    ).length;
    if (childrenLength > 0 && childrenLength !== data.childs.length) {
      if(!halfCheckedNodeKeys.includes(data.id)) {
        halfCheckedNodeKeys.push(data.id);
      }
    }
    return data?.childs.forEach(element => {
      findHalfChecked(element, selectedKeys);
    });
  }
}

const RoleDetails = (props) => {
  const allParentKeys = useMemo(() => getAllKeys(props.nestedPermissions), [props.nestedPermissions]);

  props.nestedPermissions.forEach((element) => {
    findHalfChecked(element, props.selected);
  });

  const memoizedSelected = useMemo(() => props.selected.filter(item => !halfCheckedNodeKeys.includes(item)), [props.selected]);
  
  const onCheck = (checkedKeysValue, halfCheckedKeys) => {
    props.setSelected(checkedKeysValue);
    props.setHalfChecked(halfCheckedKeys)
  };

  const handleExpandAll = useCallback(() => {
    props.setExpanded(oldExpanded => oldExpanded.length === 0 ? allParentKeys : []);
  }, [allParentKeys]);

  const handleSelectAll = useCallback(() => {
    props.setSelected(oldSelected => oldSelected.length === 0 ? allParentKeys : []);
  }, [allParentKeys]);

  return (
    <>
      <Button onClick={handleSelectAll} disabled={props.disabled} id="roles_select" >
        {props.selected.length === 0 ? 'Select All' : 'UnSelect All'}
      </Button>
      <Button onClick={handleExpandAll} disabled={props.disabled} id="roles_select">
        {props.expanded.length === 0 ? 'Expand all' : 'Collapse all'}
      </Button>
      <Tree
        disabled={props.disabled}
        checkable
        onExpand={props.setExpanded}
        expandedKeys={props.expanded}
        onCheck={(checkedKeys, { halfCheckedKeys }) => onCheck(checkedKeys, halfCheckedKeys)}
        checkedKeys={memoizedSelected}
        fieldNames={{ title: "name", key: "id", children: "childs" }}
        treeData={props.nestedPermissions}
      />
    </>
  );
};

export default RoleDetails;
