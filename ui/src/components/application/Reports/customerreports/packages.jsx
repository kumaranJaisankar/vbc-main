import React,{useEffect,useState} from "react";
import {TreeSelect} from "antd";
import "antd/dist/antd.css";
const PackagesDropDown = (props)=>{

  console.log("props.......",props)

    const onChange = (value)=>{
      props.setSearchbuttondisable(false)
      let ids=[];

      for(let i=0; i<value.length; i++){
        const obj = treeData.find((d)=>d.value === value[i]);

        console.log(obj,"treeData")
        if(!obj){
            ids.push(value[i]);
        }else{
           const childIds= obj.children.map((c)=>c.value);
           ids.push(...[...childIds, value[i]]);
           console.log(childIds,"childIds")
          }
    }

    console.log('ids ', ids);
        console.log("selected.....",value);
        // props.setValues(value)
        const valueWithoutKey = value.map((v)=>parseInt(v.split("#")[0]));
        console.log(valueWithoutKey,"valueWithoutKey1")
        props.setBranchdata((prevState)=>{
          return {
            ...prevState,
            valueWithoutKey:valueWithoutKey

             
          }
        });
        console.log(valueWithoutKey,"valueWithoutKey")
       
       
    }



    const [treeData, setTreeData] =  useState([]);
    const [value, setValue] = useState([]);


    useEffect(()=>{

      if(props.data){

        const list = getList(props.data)
        console.log("list...",list)
      }
      // if(props.data && props.data.sub_plans){
      
      //    const areasSelected =props.data.sub_plans.map((a)=>{
      //       return a.id;
      //   })
      
      //   let ids= []
      //   if(list){
      //     list.forEach((l)=>{
      //       if(l.children){
      //         l.children.forEach((a)=>{
      //           ids.push(a.value);
      //         })
      //       }else{
      //         ids.push(l.value);
      //       }
      //     })
      //   }
      //   let finalIds = []
      //   for(let i=0; i<areasSelected.length; i++){
      //     for(let j=0; j<ids.length; j++){
      //       if(ids[j].includes(areasSelected[i])){
      //           finalIds.push(ids[j]);
      //       }
      //     }
      //   }
      
      //   setValue([...finalIds]);
      //   props.setValues((prevState)=>{
      //       return {
      //           ...prevState,
      //           sub_plans:[...areasSelected]
      //       }
      //   });
      // }else{
      
      //   setValue([]);
      //   props.setValues((prevState)=>{
      //       return {
      //           ...prevState,
      //           sub_plans:[]
      //       }
      //   });
      
      // }
      // console.log(props.data,"props.data")
      
      },[props.data])



// // onchange


// const onChange = value => {
//   console.log('onChange ', value);
//   let ids=[];
//   for(let i=0; i<value.length; i++){
//       const obj = treeData.find((d)=>d.value === value[i]);
//       if(!obj){
//           ids.push(value[i]);
//       }else{
//          const childIds= obj.children.map((c)=>c.value);
//           ids.push(...childIds);
//       }

//   }
//   console.log('ids ', ids);
//   setValue( value );
//   const valueWithoutKey = ids.map((v)=>parseInt(v.split("#")[0]));
//   props.setValue((prevState)=>{
//       return {
//           ...prevState,
//           sub_plans: valueWithoutKey
//       }
//   });
// };





      const getList = (arr) => {
        let list = [];
        for (let i = 0; i < arr.length; i++) {
          const key1 = arr[i].id +'#'+ Math.random();
          let obj1 = {
            title: arr[i].package_name,
            value: key1,
            key: key1,
            id: arr[i].id
          };
          let children = [];
      
          if (arr[i].sub_plans) {
            let sub_plans = arr[i].sub_plans;
            for (let i = 0; i < sub_plans.length; i++) {
              const key2 = sub_plans[i].id +'#'+ Math.random();
              let obj2 = {
                title: sub_plans[i].package_name,
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
        treeCheckable : true,
        // value: value,
        allowClear : true,
        style : {width:"100%", },
        dropdownStyle:{ maxHeight: "300px" ,overflow:"auto"},
        fieldNames:{label:"title",value:"value"},
        placeholder : props.placeholder,
        showCheckedStrategy : TreeSelect.SHOW_PARENT,
        onChange : onChange,
       
    }
    return (
      <>
        {treeData && <TreeSelect {...treeProps}/>}
        </>
    )
}
export default PackagesDropDown;




