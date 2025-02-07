import React, {useState, useEffect}from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
// import './index.css';
import { TreeSelect } from 'antd';

const { SHOW_PARENT } = TreeSelect;



const Multiselect = (props) => {
 
  
const [value, setValue] = useState([]);
const [treeData, setTreeData] =  useState([]);

useEffect(()=>{

const list = getList(props.arealist)
if(props.editRecord && props.editRecord.areas){

   const areasSelected =props.editRecord.areas.map((a)=>{
      return a.id;
  })

  let ids= []
  if(list){
    list.forEach((l)=>{
      if(l.children){
        l.children.forEach((a)=>{
          ids.push(a.value);
        })
      }else{
        ids.push(l.value);
      }
    })
  }
  let finalIds = []
  for(let i=0; i<areasSelected.length; i++){
    for(let j=0; j<ids.length; j++){
      if(ids[j].includes(areasSelected[i])){
          finalIds.push(ids[j]);
      }
    }
  }

  setValue([...finalIds]);
  props.setFormData((prevState)=>{
      return {
          ...prevState,
          areas:[...areasSelected]
      }
  });
}else{

  setValue([]);
  props.setFormData((prevState)=>{
      return {
          ...prevState,
          areas:[]
      }
  });

}


},[props.arealist, props.editRecord])

 const onChange = value => {
    props.setResetfield(false);
    let ids=[];
    for(let i=0; i<value.length; i++){
        const obj = treeData.find((d)=>d.value === value[i]);
        if(!obj){
            ids.push(value[i]);
        }else{
           const childIds= obj.children.map((c)=>c.value);
            ids.push(...childIds);
        }

    }
    setValue( value );
    const valueWithoutKey = ids.map((v)=>parseInt(v.split("#")[0]));
    props.setFormData((prevState)=>{
        return {
            ...prevState,
            areas: valueWithoutKey
        }
    });
  };

  //useeffect
useEffect(()=>{
  if(props.resetfield === true){
    setValue([]);
    setTreeData([]);
  }
},[props.resetfield])

  
  const getList = (arr) => {
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const key1 = arr[i].id +'#'+ Math.random();
      let obj1 = {
        title: arr[i].name,
        value: key1,
        key: key1 
      };
      let children = [];
  
      if (arr[i].areas) {
        let areas = arr[i].areas;
        for (let i = 0; i < areas.length; i++) {
          const key2 = areas[i].id +'#'+ Math.random();
          let obj2 = {
            title: areas[i].name,
            value: key2,
            key: key2
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

  const tProps = {
    treeData: treeData,
     value: value,
     onChange: onChange,
     treeCheckable: true,
     showCheckedStrategy: SHOW_PARENT,
    //  placeholder: 'Select Zone & Area',
     style: {
       width: '100%',
     },
    };
    

   return <TreeSelect {...tProps} />;

}
   
export default Multiselect

