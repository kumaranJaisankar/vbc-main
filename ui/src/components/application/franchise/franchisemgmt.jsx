import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { franchiseaxios } from "../../../axios";

const FranchiseMgmt = () => {
    const [crossed, setCrossed] = useState(false);
    useEffect(() => {
        var config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        franchiseaxios.get("radius/user/testuser10/check/limit", config).then((response) => {
            var resp = response.data    
            console.log(resp)
            setCrossed(resp.limit_crossed)
        }).catch((err) => {
            console.log(err)
        })
        let timer = setInterval(() => {
            franchiseaxios.get("radius/user/testuser10/check/limit", config).then((response) => {
            var resp = response.data    
            console.log(resp)
                setCrossed(resp.limit_crossed)
            }).catch((err) => {
                console.log(err)
            })
        }, 10000);

        return (() => {
            console.log("i am unloading");
            clearInterval(timer);
          })
    }, [])
    return (
        <div>
            <h1>{crossed?'Limit crossed' : 'Normal'}</h1>
        </div>
    );
}

export default FranchiseMgmt;

















