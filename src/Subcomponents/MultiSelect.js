import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import React from 'react';
import '../App.css';

export default function MultiSelect(props) {

    const handleChange = props.handleChange;
    const control = props.Select;

    return (
        <div>
          <FormControl className="selectDiv" sx={{ m: 1, minWidth: 200, marginTop: 3, marginBottom: 0 }} size="large">
            <InputLabel sx={{color: "white"}} id="demo-simple-select-label">Extra Graphs</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              multiple
              sx={{ 
                color: "white",
                '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '.MuiSvgIcon-root ': {
                    fill: "white !important",
                }
             }}
              value={control}
              label="Graph To Display"
              onChange={handleChange}
            >
              <MenuItem value="state_of_charge">State of Charge</MenuItem>
              <MenuItem value="speed_kmh">Speed</MenuItem>
              <MenuItem value="distances">Distances</MenuItem>
              <MenuItem value="delta_energy">Delta Energy</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
}