import React from "react";
import Slider from '@mui/material/Slider';
import {Row, Col} from 'react-bootstrap';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";

import '../App.css';


const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#1664c0',
  }
});

export default function SimArgs(props) {
    const mapGran = props.mapGran;
    const simArgs = props.args;
    const commitChangeMap = props.commitChangeMap;
    const commitChangeSim = props.commitChangeSim;

    const controlGolang = {
        value: simArgs.golang,
        onChange: props.handleChanges[0],
        exclusive: true,
    };

    const controlOptimize = {
        value: simArgs.optimize,
        onChange: props.handleChanges[1],
        exclusive: true,
    };
    return(
        <div id="simArgSection">
            <div className='simArgDiv'>
                Map Granularity
                <Slider 
                    marks={true}
                    min={10}
                    max={90}
                    step={10}
                    defaultValue={mapGran}
                    onChangeCommitted={commitChangeMap}
                    valueLabelDisplay="auto"
                    key={`slider-${mapGran}`}
                />
            </div>
            <div className='simArgDiv'>
                Input Granularity
                <Slider 
                    marks={true}
                    min={1}
                    max={10}
                    step={2}
                    defaultValue={simArgs.granularity}
                    onChangeCommitted={commitChangeSim}
                    valueLabelDisplay="auto"
                    key={`slider-${simArgs.granularity}`}
                    color="primary"
                />
            </div>
            <div className='simArgDiv'>
                <Row  >
                    <Col>
                        Golang <br/>
                        <ToggleButtonGroup className="toggle" color="primary" {...controlGolang}> 
                            <ToggleButton value="false"><div style={{color: 'white', 'width':'60px', height: '20px'}}>Off</div></ToggleButton>
                            <ToggleButton value="true"><div style={{color: 'white', 'width':'60px'}}>On</div></ToggleButton>
                        </ToggleButtonGroup>
                        <br /><br />
                    </Col>
                    <Col>
                        Optimize For <br/>
                        <ToggleButtonGroup className="toggle" color="primary" {...controlOptimize}>
                        <ToggleButton value="timeTaken"><div style={{color: 'white', 'width':'60px', height: '20px'}}>Time</div></ToggleButton>
                            <ToggleButton value="distance"><div style={{color: 'white', 'width':'60px', "fontSize": "11px"}}>Distance</div></ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
            </div>
        </div>
    )
}