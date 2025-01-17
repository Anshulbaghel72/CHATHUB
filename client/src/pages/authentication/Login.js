import React from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import makeToast from "../../components/Toaster";
import { POST } from "../../utils/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    backgroundColor: "#424242",
    "& .MuiFormLabel-root": {
      color: "white",
      marginLeft: "10px",
      marginTop: "5px",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#212121",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#212121",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#212121",
    },
    "& .MuiInputBase-input": {
      color: "white",
      border: "1px solid #676767",
      borderRadius: "4px",
      padding: "15px",
    },
  },
}));

const Login = (props) => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();

  const classes = useStyles();

  const loginUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    POST(
      "user/login",
      { username, password },
      {},
      (response) => {
        makeToast("success", response.data.message);
        localStorage.setItem("CC_Token", response.data.token);
        props.setupSocket();
        props.history.push("/dashboard");
      },
      (err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      }
    );
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            inputRef={usernameRef}
            autoComplete='username'
            autoFocus
            className={classes.textField}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            inputRef={passwordRef}
            autoComplete='current-password'
            className={classes.textField}
          />
          <Button
            fullWidth
            variant='contained'
            onClick={loginUser}
            className={classes.submit}
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(Login);
