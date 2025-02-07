import React from 'react'
import { styled } from '@mui/material/styles';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import { Typeahead } from "react-bootstrap-typeahead";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

/** Component to display selected filters */
const SelectedFilters = (props) => {
  return props.appliedFilters.length > 0 && (
    <Box sx={{ marginTop: '15px' }}>
       {/* <Stack spacing={2} direction="row">
       <button class="rbt-token">
          <a
            style={{ color: '#7366ff' }}
            className="filter-clear-text"
            onClick={props.clearAllFilters}
          >
            Clear
          </a>
        </button>
      <Typeahead
        selected={props.appliedFilters}
        id="selected-strings-typeahead"
        emptyLabel=""
        open={false}
        inputProps={{ onFocus: false }}
        multiple
        options={props.appliedFilters}
        onDelete={(data) =>props.clearAllFilters(data)}
        labelKey={(data) => `${data.displayString || ""}`}
      />

      
      </Stack> */}
      <Stack spacing={2} direction="row">
        <button class="rbt-token">
          <a
            style={{ color: '#7366ff' }}
            className="filter-clear-text"
            onClick={props.clearAllFilters}
          >
            Clear
          </a>
        </button>
        {
          props.appliedFilters?.length &&
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0.5,
              m: 0,
            }}
            component="ul"
          >
            {props.appliedFilters?.map((data) => {
              return (
                <ListItem key={data.displayString} >
                  <Chip style={{color:"blue !important"}}
                    label={data.displayString}
                    onDelete={() => props.removeFilter(data)}
                  />
                </ListItem>
              );
            })}
          </Paper>
        }
      </Stack>
    </Box>
  )
}

export default SelectedFilters;
