import React, { useEffect } from 'react';
import ZoomChart from './ZoomChart';
import Graph from './Graph';
import secondsToDhms from '../HelperFunctions/TimeString';
import '../App.css';
import loading from '../Images/loading.gif';
import MultiSelect from './MultiSelect';

const Stats = (props) => {
  const createGraph = (arrayName) => {
    return <ZoomChart name={arrayName} json={props.json} />;
  };

  const returnString = () => {
    let emptyString = 'NO DATA...';
    if (props.loading) {
      return <img alt="loading" style={{ width: '75px', height: '75px', marginTop: '375px' }} src={loading} />;
    } else {
      if (props.json['empty'] === undefined) {
        return (
          <div id="statDiv">
            <div id="graphBox">
              <Graph data={props.json} graphs={props.ExtraGraphs} />
            </div>
          </div>
        );
      } else {
        return <div>{emptyString}</div>;
      }
    }
  };

  return (
    <div>
      <MultiSelect Select={props.Select} handleChange={props.handleChange} />
      {returnString()}
    </div>
  );
};

export default Stats;
