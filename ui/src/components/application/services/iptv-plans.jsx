import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Channels from "./iptv-plans/channels";
import Categories from "./iptv-plans/categories";
import Bouquets from "./iptv-plans/bouquets";
import TabPanel from "../../common/tab-panel";
import Broadcaster from "./iptv-plans/broadcaster";

const IptvPlan = () => {
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = useCallback((_, value) => {
    setActiveTab(value);
  }, []);

  useEffect(() => {
    async function loginIptv() {
      let response = await axios.post('https://keycloak.onnetsystems.ml/iptvadmin/admin/auth/mso/login', {
        username: "mso_usr@vbc.com",
        password: "vbc!@34",
        ismso: true
      });
      console.log(response, 'iptv response');
      localStorage.setItem('iptvToken', response.data.token);
    }
    loginIptv();
  }, []);

  return (
    <Box sx={{ padding: '20px', width: '100%',marginTop:"50px"}}>
      <Box sx={{ borderBottom: '1px', borderColor: 'divider' ,marginTop:"70px"}}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="iptv plans section"
        >
          <Tab label="Channels" />
          <Tab label="Category" />
          <Tab label="Bouquet" />
          <Tab label="Broadcaster"/>
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <Channels />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Categories />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <Bouquets />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <Broadcaster/>
      </TabPanel>
    </Box>
  )
};

export default IptvPlan;

{/* <Box sx={{ padding: '20px' }}>
          <Stack spacing={2} direction="row">
            <Button
              size="large"
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              New
            </Button>
            <Button size="large" variant="outlined" endIcon={<RefreshIcon />}>Refresh</Button>
          </Stack>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          maxWidth="md"
        >
          <ModalTitle onClose={handleClose}>
              Add Plans
          </ModalTitle>
          <ModalContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
            auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
            cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
            dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
          </ModalContent>
          <ModalActions>
            <Button variant="contained">Save</Button>
            <Button variant="outlined">Reset</Button>
          </ModalActions>
        </Modal> */}