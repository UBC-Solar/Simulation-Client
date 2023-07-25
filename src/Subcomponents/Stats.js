import React, { Component } from 'react';
import ZoomChart from './ZoomChart'
import secondsToDhms from "../HelperFunctions/TimeString"

import '../App.css';
import loading from "../Images/loading.gif"
import MultiSelect from './MultiSelect';

class Stats extends Component {
    createGraph(arrayName) {
        return(
            <ZoomChart name={arrayName} json={this.props.json}/>  
        )
    }

    render() {
        let returnString = () => {
            let emptyString = "NO DATA..."
            if(this.props.loading){
                return <img alt='loading' style={{width: '75px', height: '75px', marginTop: '375px'}} src={loading}/>
            } else {
                if (this.props.json["empty"] === undefined){
                    return(
                        <div id="statDiv">
                            <ul className="statUL">
                                <li>{"distance traveled: " + Math.round(this.props.json["distance_travelled"]) +" km"}</li>
                                <li className="timeLi">{"time taken: "} <br/> {secondsToDhms(this.props.json["time_taken"])}</li>
                                <li>{"final SOC: " + Math.round(this.props.json["final_soc"])}</li>
                                <li>{this.createGraph("speed_kmh")}</li>
                                <li>{this.createGraph("distances")}</li>
                                <li>{this.createGraph("state_of_charge")}</li>
                                {/* <li>{this.createGraph("influx_soc")}</li> */}
                            </ul>

                        </div>
                    );
                } else {
                    return <div>{emptyString}</div>;
                }
            }
        }
        
        return(
            <div>
                <MultiSelect Select={this.props.Select} handleChange={this.props.handleChange}/>
                {returnString()}
            </div>
        );
    }
}

export default Stats;
