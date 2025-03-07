import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link, Switch, Route, withRouter } from "react-router-dom";
// import GaugeChart from "react-gauge-chart";

import Channel from "./Channel";
import ChannelsList from "../../components/ChannelsList";
import Welcome from "./Welcome";
import makeToast from "../../components/Toaster";
import { GET } from "../../utils/api";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      height: "10vh",
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: "#212121",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: {
    color: "#fafbfc",
    fontSize: "2em",
    height: "10vh", // Reduced height to match appBar
    display: "flex",
    flexDirection: "row", // Changed from column to row
    justifyContent: "center", // Adjusted alignment for row layout
    alignItems: "center",
    width: "100%",
    border: "1px solid #212121", // Removed border
    padding: theme.spacing(1), // Added padding for better spacing
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#212121", // Updated to a slightly lighter shade
  },
  logoutButton: { 
    marginLeft: "auto", 
    color: "#fafbfc", // Changed to white
    cursor: "pointer",
    backgroundColor: "#9b9b9b", 
    borderRadius: "50%",
    boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.21), inset 0 0 10px rgba(0, 0, 0, 0.21)", 
    padding: "0px",
  },
}));


const Dashboard = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

  const getUser = (userId) => {
    GET(
      "user/" + userId,
      {},
      (response) => {
        setUser(response.data);
      },
      (err) => {
        setTimeout(getUser, 3000);
      }
    );
  };

  const getChannels = () => {
    GET(
      "channel",
      {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
      (response) => {
        setChannels(response.data);
        loadCurrentChannel(response.data);
      },
      (err) => {
        setTimeout(getChannels, 3000);
      }
    );
  };

  const loadCurrentChannel = (channels) => {
    const channel = channels.filter(
      (channel) => channel._id === props.match.params.id
    )[0];
    setCurrentChannel(channel);
  };

  const logout = () => {
    localStorage.removeItem("CC_Token");
    props.history.push("/");
    makeToast("success", "Logged out successfully!");
  };

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      getUser(payload.id);
    }

    getChannels();

    if (props.socket) {
      props.socket.on("newChannel", ({ channel }) => {
        setChannels((prevChannels) => [...prevChannels, channel]);
      });
    }

    return () => {};
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadCurrentChannel(channels);
    //eslint-disable-next-line
  }, [props.match.params.id]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Link to='/dashboard'>
        <span style={{ letterSpacing: "3px", fontStretch: "expanded" }}>
          <img src="/nn.png" alt="Logo" style={{ height: "70px", marginTop: "15px" }} />
        </span> 
        </Link>
        {/* <p className='dashboardUsername'>
          {user ? "Hey " + user.username + "!" : ""}
        </p> */}
      </div>
      <Divider />
      <ChannelsList channels={channels} socket={props.socket} />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap>
            {currentChannel ? currentChannel.name : "Join a channel!"}
          </Typography>
          <div onClick={logout} className={classes.logoutButton}>
            <IconButton className='fas fa-power-off' />
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className='dashboardMainContent'>
        <div className={classes.toolbar} />
        <Switch>
          <Route
            exact
            path='/dashboard'
            render={() => <Welcome user={user} />}
          />
          <Route
            exact
            path='/channel/:id'
            render={() => (
              <Channel
                socket={props.socket}
                user={user}
                channel={currentChannel}
              />
            )}
          />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(Dashboard);
