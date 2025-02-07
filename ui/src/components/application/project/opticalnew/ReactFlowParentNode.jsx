import React from 'react';
import { useState } from 'react';
import { Handle } from 'react-flow-renderer';

const ReactFlowParentNode = (props) => {
    const [showPlusIcon, setPlusIcon] = useState(true)

    function trimText(text, threshold) {
        if (text.length <= threshold) return text;
        return text.substr(0, threshold).concat("...");
    }

    return (
        <div className="ReactFlowParentNode" id={`${props.data.isDisabled ? '' : 'ReactFlowParentNodeID'}`}
            onClick={() => setPlusIcon(!showPlusIcon)} style={{ pointerEvents: props.data.isDisabled ? 'none' : 'all' }}>
            <div>
                <svg width="80" height="80" viewBox="0 10 215 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="75.5096" cy="116.593" r="12.5096" fill="#999999" />
                    <circle cx="139.486" cy="116.593" r="12.5096" fill="#DC1F1F" />
                    <path d="M5 86.0659H209.157V95.0728H5V86.0659Z" fill="#726F6F" />

                    <path d="M214.395 89.5189L193.366 11.0045C192.519 7.81864 190.816 5.03145 188.507 3.05119C186.198 1.07093 183.403 0.00165809 180.533 0H34.4672C31.5968 0.00165809 28.8024 1.07093 26.4931 3.05119C24.1838 5.03145 22.4811 7.81864 21.6344 11.0045L0.604687 89.5969C0.205995 91.088 0.00216406 92.6402 0 94.2016V156.092C0 160.232 1.41573 164.202 3.93575 167.13C6.45577 170.057 9.87365 171.701 13.4375 171.701H201.562C205.126 171.701 208.544 170.057 211.064 167.13C213.584 164.202 215 160.232 215 156.092V94.1236C214.998 92.5622 214.794 91.01 214.395 89.5189ZM206.566 161.096H154.531H107.5H60.4687H8.43365V94.1236L29.4633 10.6054H107.5H185.537L206.566 94.1236V161.096Z" fill="#726F6F" />

                    <text x="36" y="48" font-family="Verdana" fill="#000000" n="34" h="21" style={{
                        width: '45px',
                        height: '23px',
                        fontSize: '18px'
                    }} className="svg-dp-title-text">{trimText(props.data.label, 6)}</text>

                    <text x="59" y="150" font-family="Verdana" fill="#000000" n="34" h="21" style={{
                        width: '45px',
                        height: '23px',
                        fontSize: '18px'
                    }}>({props.data.availablePorts})</text>
                    <text x="128" y="150" font-family="Verdana" fill="#000000" n="34" h="21" style={{
                        fontSize: '18px'
                    }}
                    >({props.data.unavailablePorts})</text>
                    {!props.data.isDisabled &&
                        !showPlusIcon ?
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M132 33C125.925 33 121 37.925 121 44C121 50.075 125.925 55 132 55C138.075 55 143 50.075 143 44C143 37.925 138.075 33 132 33ZM128 43C127.735 43 127.48 43.1054 127.293 43.2929C127.105 43.4804 127 43.7348 127 44C127 44.2652 127.105 44.5196 127.293 44.7071C127.48 44.8946 127.735 45 128 45H136C136.265 45 136.52 44.8946 136.707 44.7071C136.895 44.5196 137 44.2652 137 44C137 43.7348 136.895 43.4804 136.707 43.2929C136.52 43.1054 136.265 43 136 43H128Z" fill="#726F6F" />
                        :
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M132 33C125.925 33 121 37.925 121 44C121 50.075 125.925 55 132 55C138.075 55 143 50.075 143 44C143 37.925 138.075 33 132 33ZM133 48C133 48.2652 132.895 48.5196 132.707 48.7071C132.52 48.8946 132.265 49 132 49C131.735 49 131.48 48.8946 131.293 48.7071C131.105 48.5196 131 48.2652 131 48V45H128C127.735 45 127.48 44.8946 127.293 44.7071C127.105 44.5196 127 44.2652 127 44C127 43.7348 127.105 43.4804 127.293 43.2929C127.48 43.1054 127.735 43 128 43H131V40C131 39.7348 131.105 39.4804 131.293 39.2929C131.48 39.1054 131.735 39 132 39C132.265 39 132.52 39.1054 132.707 39.2929C132.895 39.4804 133 39.7348 133 40V43H136C136.265 43 136.52 43.1054 136.707 43.2929C136.895 43.4804 137 43.7348 137 44C137 44.2652 136.895 44.5196 136.707 44.7071C136.52 44.8946 136.265 45 136 45H133V48Z" fill="#726F6F" />
                    }
                </svg>
                {props.data.isDisabled ? <Handle type="source" position="bottom" style={{ borderRadius: 0 }} id="node1" /> :
                    <>
                        <Handle type="source" position="bottom" style={{ borderRadius: 0 }} id="node2" />
                        <Handle type="target" position="top" style={{ borderRadius: 0, top: '10px' }} id="node3" />
                    </>
                }
            </div>
        </div>
    )
}

export default ReactFlowParentNode;