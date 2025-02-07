import React, { useState, useEffect } from 'react';
import ReactFlow, { updateEdge, addEdge } from 'react-flow-renderer';

const ReactflowParenttreeForCpe = (props) => {
  const [elements, setElements] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    let elementsList = [];
    let elementLinkList = [];
    let xValue = 50;
    if (props.parent.length > 1 && !!props.parent_slno) {

      let parentSlNoList = [...props.parent];
      let lastObj = parentSlNoList[parentSlNoList.length - 1];
      let parent = lastObj["category"] ? lastObj["category"].toUpperCase() : 'Parent';
      let parentName = parent == 'PARENTDP' ? 'PARENT DP' : parent;
      let parentX = 25 * parentSlNoList.length;
      elementsList.push({
        id: '01',
        type: 'input',
        data: { label: parentName },
        position: { x: parentX, y: 10 },
        style: {
          width: '100px',
          height: '35px',
          borderRadius: '0px',
        }
      })
      for (let i = 0; i < props.parent.length - 1; i++) {
        let obj = {
          id: `0${i + 2}`,
          type: 'output',
          data: { label: props.parent[i].port_number, d: props.parent[i] },
          position: { x: xValue, y: 80 },
          style: {
            background: props.parent[i].flag == true ? 'red' : '#959595',
            pointerEvents: props.parent[i].flag == true ? 'none' : 'all',
            cursor: props.parent[i].flag == true ? 'not-allowed' : 'pointer',
            color: '#FFFFF',
          }
        }

        xValue = xValue + 60;
        elementsList.push(obj)

        let obj2 = { id: `el-0${i + 2}`, source: '01', target: `0${i + 2}`, type: 'step' }
        elementLinkList.push(obj2);
      }
      setElements([...elementsList, ...elementLinkList]);
    } else {
      setElements([]);
    }
  }, [props.parent]);

  const onElementClick = (event, element) => {
    if (element.data && element.data.d.flag === false) {
      //call API here
      props.setParentDpNodeSelected(element.data.d)
    }
  }

  useEffect(() => {
    if (reactFlowInstance && elements.length) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance, elements, props.parent_slno]);

  const onLoad = (rf) => {
    setReactFlowInstance(rf);
  };
  return (
    <div className="ReactFlow-cntainer">
      {elements &&
        <ReactFlow
          className="reactFlowCpe"
          elements={elements}
          onLoad={onLoad}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onConnect={onConnect}
          onElementClick={onElementClick}
          elementsSelectable={true}
          preventScrolling={false}
          paneMoveable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          nodesDraggable={false}
          nodesConnectable={false}

        >
        </ReactFlow>}</div>
  );
};

export default ReactflowParenttreeForCpe;