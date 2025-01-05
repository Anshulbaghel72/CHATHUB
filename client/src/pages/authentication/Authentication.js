import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Login from "./Login";
import Register from "./Register";
import Copyright from "../../components/Copyright";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  }, 
}));

const Authentication = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className='authOuterContainer'>
      <h1 className='authHeading'>
      <img src="/nn.png" alt="Logo" style={{ height: "70px", marginTop: "15px" }} />
      </h1>
      <div className='authInnerContainer'>
        <div className={classes.root}>
          <AppBar position='static' color='default'>
            <Tabs
              style={{ backgroundColor: "#2f2f2f" }}
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              TabIndicatorProps={{ style: { backgroundColor: "#171717" } }}
              variant='fullWidth'
              aria-label='full width tabs example'
            >
              <Tab label='Login' {...a11yProps(0)} />
              <Tab label='Register' {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Login setupSocket={props.setupSocket} />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Register />
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
      <Copyright />
    </div>
  );
};

export default Authentication;
