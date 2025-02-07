import React from "react";
import Accordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled } from "@mui/material/styles";

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
    marginRight: "10px"
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    justifyContent: "space-between",
    alignItems: "center"
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}));

export { Accordion, AccordionDetails, AccordionSummary };