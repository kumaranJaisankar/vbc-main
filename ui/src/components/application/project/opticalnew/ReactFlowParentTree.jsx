import React, { useState, useEffect } from 'react';
import ReactFlow, { updateEdge, addEdge } from 'react-flow-renderer';
import ReactFlowParentNode from './ReactFlowParentNode';

const ReactflowParenttree = (props) => {
  const [elements, setElements] = useState([]);
  const [elementsShowLater, setElementsShowLater] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedPort, setSelectePort] = useState(0);
  const [showTree, setShowTree] = useState(false);
  const [showTreeLoad, setShowTreeLoad] = useState(false);
  const [showParentTree, setShowParentTree] = useState(false);
  const [xparentValue, setXparentValue] = useState('200px');
  const [parentElements, setParentElements] =  useState([]);
  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  
const nodeTypes = {
  selectorNode: ReactFlowParentNode,
  selectorNode2: ReactFlowParentNode,
};

useEffect(()=>{
  if(showTree){
    setElements(elementsShowLater)
  }else{
    let parentElement = [...elements].filter(e=>e.type=='input' || e.type =='selectorNode');
    setElements(parentElement)
  }
  setShowTreeLoad(!showTreeLoad)
},[showTree])

  useEffect(()=>{
      let elementsList=[];
      let elementLinkList = [];
      let xValue = 40;
    if(props.parent.length>1 && !!props.parent_slno){

      let parentSlNoList = [...props.parent];
      let lastObj = parentSlNoList[parentSlNoList.length - 1];
      let parent = lastObj["category"] ? lastObj["category"].toUpperCase() : 'Parent';
      let parentName = parent == 'PARENTDP' ? 'PARENT DP': parent;
       
        let availablePorts =0;
        let unavailablePorts =0;
        for(let i=0; i<props.parent.length-1;i++){
            let obj =  {
                id: `0${i+2}`,
                type: 'output',
                data: { label: props.parent[i].port_number, d:props.parent[i] },
                position: { x: xValue, y: 100 },
                style: {
                    background: props.parent[i].flag ==true? 'red' :'#959595',
                    pointerEvents: props.parent[i].flag ==true? 'none' :'all',
                    cursor: props.parent[i].flag ==true? 'not-allowed' :'pointer',
                    color: '#FFFFF',
                }
              }
              if(props.parent[i].flag){
                unavailablePorts++;
              }else{
                availablePorts++;
              }
              xValue = xValue+50;
              elementsList.push(obj)

              let obj2 = { id: `el-0${i+2}`, source: '000001', target: `0${i+2}`, type: 'step', sourceHandle: 'node1'}
              elementLinkList.push(obj2);
        }
        elementsList.push({
          id: '01',
          type: 'input',
          data: { label:  parentName},
          position: { x: (xValue/2) - 35, y: 10 },
           style:{
            borderRadius: '0px',
            borderBottom: '30px solid #f0e9e9',
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            height: '0px',
            width: '100px',
            opacity: 0,
            zIndex:0
          }
        })
        elementsList.push({
          id: '000001',
          type: 'selectorNode',
          data: { label:  parentName, unavailablePorts: unavailablePorts, 
            availablePorts: availablePorts,selectedPort:selectedPort,
            setShowTree: setShowTree,
          showTree:showTree},
          position: { x: (xValue/2) - 35, y: -20 },
          style:{
            zIndex:10
          }
        })
        setElementsShowLater([...elementsList,...elementLinkList])
        setXparentValue((xValue/2) - 35);
        setElements([{
          id: '01',
          type: 'input',
          data: { label:  parentName},
          position: { x: (xValue/2) - 35, y: 10 },
           style:{
            borderRadius: '0px',
            borderBottom: '30px solid #f0e9e9',
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            height: '0px',
            width: '100px',
            opacity: 0,
            zIndex:0
          }
        },
        {
          id: '000001',
          type: 'selectorNode',
          data: { label:  parentName, unavailablePorts: unavailablePorts, 
            availablePorts: availablePorts,selectedPort:selectedPort,
            setShowTree: setShowTree,
            showTree:showTree},
          position: { x: (xValue/2) - 35, y: -20 },
          style:{
            zIndex:10
          }
        }
      ]);
      
      //Parent Node Elements 
      if(lastObj['parentdp1']){
        let element = lastObj['available_hardware']['parentdp1_info'];
        setParentElements([{
          id: 'parentdp1',
          type: 'selectorNode2',
          data: { label:  lastObj['parentdp1'], unavailablePorts: element.unavailable_ports, 
            availablePorts: element.available_ports, selectedPort:0,
            isDisabled:true
            },
          position: { x: (xValue/2) - 35, y: -140 },
          selectable:false,
          style:{
            zIndex:10
          }
        },
        {
          id: 'parentdp1_port',
          type: 'default',
          data: { label:  lastObj['parentdp1_port']},
          position: { x: 165, y: -65 },
          selectable:false,
          style:{
            zIndex:10
          }
        },  
        { id: `parentdp1-parentdp1_port`, source: 'parentdp1', target: 'parentdp1_port', type: 'step', 
        sourceHandle: 'node2'},
        { id: `parentdp1_port-01`, source: 'parentdp1_port', target: '000001', type: 'step', targetHandle: 'node3'}
      ])
      }else  if(lastObj['parentdp2']){
        let element = lastObj['available_hardware']['parentdp2_info'];
        setParentElements([{
          id: 'parentdp2',
          type: 'selectorNode2',
          data: { label:  lastObj['parentdp2'], unavailablePorts: element.unavailable_ports, 
            availablePorts: element.available_ports, selectedPort:0,
            isDisabled:true
            },
          position: { x: (xValue/2) - 35, y: -140 },
          selectable:false,
          style:{
            zIndex:10
          }
        },
        {
          id: 'parentdp2_port',
          type: 'default',
          data: { label:  lastObj['parentdp2_port']},
          position: { x: 165, y: -65 },
          selectable:false,
          style:{
            zIndex:10
          }
        },
          { id: `parentdp2-parentdp2_port`, source: 'parentdp2', target: 'parentdp2_port', type: 'step', 
        sourceHandle: 'node2'},
        { id: `parentolt_port-01`, source: 'parentdp2_port', target: '000001', type: 'step', targetHandle: 'node3'}
      ])
        
      }else  if(lastObj['parentolt']){
        let element = lastObj['available_hardware']['parentolt_info'];
        setParentElements([{
          id: 'parentolt_info',
          type: 'selectorNode2',
          data: { label:  lastObj['parentolt'], unavailablePorts: element.total_ports - element.available_ports, 
            availablePorts: element.available_ports, selectedPort: 0,
            isDisabled:true
            },
          position: { x: (xValue/2) - 35, y: -155 },
          selectable:false,
          targetPosition:'bottom',
          style:{
            zIndex:10
          }
        },
        {
          id: 'parentolt_port',
          type: 'default',
          data: { label:  lastObj['parentolt_port']},
          position: { x: 165, y: -50 },
          selectable:false,
          style:{
            zIndex:10
          }
        },
        { id: `parentolt_info-parentolt_port`, source: 'parentolt_info', target: 'parentolt_port', type: 'step', 
        sourceHandle: 'node2'},
        { id: `parentolt_port-01`, source: 'parentolt_port', target: '000001', type: 'step', targetHandle: 'node3'}
        
      ])
      }
    }else{
      setElementsShowLater([])
      setElements([]);
    }

  },[props.parent]);

  useEffect(()=>{
    if(showParentTree && parentElements.length>0){
      setElements((prevState)=>{
        return [...prevState,
         ...parentElements]
       })
    }
  },[showParentTree])

  const onElementClick2 = (event, element) => {
    if(element && element.data && !element.data.isDisabled){
      if(element.type && element.type =='selectorNode'){
        setShowTree(!showTree)

      }else{
        if(element.data && element.data.d.flag === false){
          //call API here
          props.setParentDpNodeSelected(element.data.d)
          setSelectePort(1);
      }else{
        props.setParentDpNodeSelected('');
        setSelectePort(0);
      }
      }
      setShowParentTree(false);
    }
    }

    useEffect(() => {
      if (reactFlowInstance && elements.length) {
        setTimeout(()=>{
          reactFlowInstance.fitView();
          var parentButton = document.getElementById("parent-show-id")
          var cssNode = document.getElementsByClassName("react-flow__nodes")[0].style.cssText
        
          if(!parentButton){
            parentButton = document.createElement('div');
          }
          if(elements.length >2){
            parentButton.style = cssNode
          }else{
            parentButton.style.left= '36%';
            parentButton.style.top= '30%';
            parentButton.style.transform= 'none';
          }


        },0)
      }
    }, [reactFlowInstance, elements, showTreeLoad, showTree]);
  
    const onLoad = (rf) => {
      setReactFlowInstance(rf);
    };

  return (
    <div className="ReactFlow-cntainer">
      {!showParentTree && parentElements.length>0 &&
      <div className="parent-show-div" style={{left: 60+xparentValue+'px'}} id="parent-show-id">
            <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "10",
                  }}
                  class="btn btn-primary btn-xs openmodal"
                  type="button"
                  onClick={()=>setShowParentTree(!showParentTree)}
                >
                      <i className="icofont icofont-arrow-up"  style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}></i>
                  <span className="openmodal"style={{ marginLeft: "-10px", padding: '0px 5px' }}>&nbsp;&nbsp; Parent</span>
                </button>
      </div>}
    {elements && 
    <ReactFlow
    className="reactFlowdpe"
      elements={elements}
      onLoad={onLoad}
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      onElementClick={onElementClick2}
      elementsSelectable={true}
      preventScrolling = {false}
      paneMoveable={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnScroll={false}
      nodesDraggable={false}
      nodesConnectable={false}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      defaultZoom={1.5}
    >
    </ReactFlow>}</div>
  );
};

export default ReactflowParenttree;