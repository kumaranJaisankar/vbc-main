import React from 'react';
import "./FormIconComponent.scss";

//Need to be replaced with address proof icon
import { ReactComponent as AddressProofUploadIcon } from "../../../assets/images/signature_icon.svg";
import { ReactComponent as PersonLogoIcon } from "../../../assets/images/person_logo_icon.svg";
const normalFillColor = "#9C9C9C";
const heightIconComponent = "150";
const widthIconComponent = "150";
const svgIconStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
}
const FormIconComponent = (props) => {

    const getIcon = (iconName) => {
        if(iconName === "addressProof" || iconName === "addSignature" || iconName === "addIdentityProof"){
            return <><AddressProofUploadIcon fill={normalFillColor} 
            height={heightIconComponent} width={widthIconComponent} style={svgIconStyle}/>
            {props.textBelowIcon && <span className="form-icon-text">{props.textBelowIcon}</span>}
            </>
        }
        else if(iconName === "personLogo"){
            return <><PersonLogoIcon fill={normalFillColor} 
            height={heightIconComponent} width={widthIconComponent} style={svgIconStyle}/>
            {props.textBelowIcon && <span className="form-icon-text">{props.textBelowIcon}</span>}
            </>
        }
        // Sailaja fixed proper  alignment of cancel Icon for Signature box on 1st August REF Cust-61
        //chnaged width on line from 300px to 350px by Marieya on 27.8.22
        else{
            return <>
            {props.imageData ? (
                <>
                <div className="image-clear-icon-container" onClick={props.handleClearImageClick}>
                    <i className="fa fa-close image-clear-icon"></i>
                </div>
                <img
                  src={props.imageData}
                  alt={props.alt}
                  style={{
                    display: "inline-flex",
                    margin: "0",
                    width: "400px",
                    height: "100px",
                    maxWidth:"100%",
                    maxHeight:"100%",
                  }}
                />
                </>
              ) : null}
            </>
        }
    }
    return <>
    <div className="form-icon-container" style={props.style} onClick={props.imageData===null && props.onClick}>
        {getIcon(props.iconName)}
        {props.children && props.children}
    </div>
    </>
}

export default FormIconComponent;
