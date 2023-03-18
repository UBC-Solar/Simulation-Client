import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let returnString = "";
        if(this.props.loading){
            returnString = "simulation running"
        } else {
            if (this.props.json["empty"] === undefined){
                returnString += "distance traveled: " + Math.round(this.props.json["distance_travelled"]) + "\n";
                returnString += "\n" + "time taken: " + Math.round(this.props.json["time_taken"]) + "\n";
                returnString += "\n" + "final SOC: " + Math.round(this.props.json["final_soc"]) + "\n";
            } else {
                returnString = "NO DATA..."
            }
        }
        return(
            <div>{returnString}</div>
        );
    }
}

export default App;
