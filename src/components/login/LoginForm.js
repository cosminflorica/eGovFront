import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Cached'
import CloudUploadIcon from '@material-ui/icons/ArrowRight'
import './loginform.css'
import { Redirect } from 'react-router'
import axios from 'axios'

var validator = require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .is().not().oneOf([
        'Passw0rd',
        'Password123',
        '123',
        '1234',
        'password'
    ]);




class LoginForm extends Component {

    state = {
        loggedIn: false,
        email: '',
        passwordText: '',
        user: null,
        emailError: false,
        passwordError: false,
        invalidCredentialsPassword: false,
        invalidCredentialsEmail: false,
        invalidCredentialsGeneral: false
    }
    constructor(props) {
        super(props);
        this.handleLoginOnClick = this.handleLoginOnClick.bind(this);
        this.onResetClick = this.onResetClick.bind(this);
    }


    handleLoginOnClick() {

        this.setState({
            emailError: !validator.validate(this.state.email),
            passwordError: !schema.validate(this.state.passwordText)

        })

        console.log(this.state);
        if (this.state.email === '' || this.state.emailError) {
            this.setState({
                invalidCredentialsEmail: true

            })
            console.log("RETURN EMAIL");
            return;
        }
        if (this.state.passwordText === '' || this.state.passwordError ) {
            this.setState({
                invalidCredentialsPassword: true
            })
            console.log("RETURN PASSWORD");
            return;
        }
        axios.post('http://localhost:8080/api/user/auth', {
            email: this.state.email,
            password: this.state.passwordText
        }).then(response => {
            console.log(response);
            let jsonUser = response.data
            console.log(jsonUser);

            if (jsonUser) {
                console.log("RECEIVED DATA: ", jsonUser)
                this.setState({
                    loggedIn: true,
                    user: jsonUser
                })
            }
            if(response.data===""){
                console.log("RECEIVED NULL");
                this.setState({
                    emailError: true,
                    passwordError: true,
                    invalidCredentialsGeneral: true,
                    invalidCredentialsEmail: false,
                    invalidCredentialsPassword: false
                })
            }
        }).catch(error => {
            console.log(error)
            this.setState({
                emailError: true,
                passwordError: true,
                invalidCredentialsGeneral: true,
                invalidCredentialsEmail: false,
                invalidCredentialsPassword: false
            })
        })
    }
    onChangePassword = (event) => {
        this.setState({
            invalidCredentialsPassword: false,
            passwordText: event.target.value,
            passwordError: !schema.validate(event.target.value)
        })
    }
    onChangeEmail = (event) => {

        this.setState({
            emailError: !validator.validate(event.target.value),
            invalidCredentialsEmail: false,
            email: event.target.value,
        })
    }
    onResetClick() {
        this.setState({
            email: '',
            passwordText: '',
            invalidCredentialsEmail: false,
            invalidCredentialsPassword: false,
            invalidCredentialsGeneral: false,
            passwordError: false,
            emailError: false
        })
    }
    render() {
        return (
            <div>
                <div className="container">
                    <Paper elevation={3}>
                        <Grid container
                            spacing={16}
                            alignContent='center'
                            alignItems="center"
                            justify='space-around'
                        >
                            <Grid item md={8}>
                                <Grid container justify='center'>
                                    <TextField
                                        className="field"
                                        id="outlined-name"
                                        label="Email"
                                        // className={classes.textField}
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        margin="normal"
                                        variant="outlined"
                                        error={this.state.emailError}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container
                            spacing={16}
                            alignContent='center'
                            alignItems="center"
                            justify='space-around'
                        >
                            <Grid item md={8}>
                                <Grid container justify='center'>
                                    <TextField
                                        className="field"
                                        id="standard-password-input"
                                        label="Password"
                                        value={this.state.passwordText}
                                        onChange={this.onChangePassword}
                                        type="password"
                                        autoComplete="current-password"
                                        margin="normal"
                                        variant="outlined"
                                        error={this.state.passwordError}

                                    />

                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container
                            spacing={16}
                            alignContent='center'
                            alignItems="center"
                            justify='center'
                        >
                            <br></br>
                            <Grid item md={4}>
                                <Grid container justify='center'>
                                    <Button variant='contained' color='secondary' size="large" onClick={this.onResetClick}>
                                        Reset
                        <DeleteIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item md={4}>
                                <Grid container justify='center'>
                                    <Button variant='contained' color='primary' size="large" onClick={this.handleLoginOnClick}>
                                        Login
                        <CloudUploadIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                            {this.state.loggedIn ? (<Redirect to=
                                {{
                                    pathname: '/formular',
                                    state: { user: this.state.user }

                                }} />) : null}
                        </Grid>

                        <Grid container
                            spacing={16}
                            alignContent='center'
                            alignItems="center"
                            justify='center'
                        >
                            <Grid item md={8}>
                                <Grid container justify='center'>

                                    {this.state.invalidCredentialsEmail && (
                                        <div className='invalid-message'>
                                            <p>Invalid Email address!</p>
                                        </div>
                                    )}
                                    {this.state.invalidCredentialsPassword && (
                                        <div className='invalid-message'>
                                            <span>Password must contain at least 8 characters,
                                    including UPPER/lowercase and numbers!</span>

                                        </div>
                                    )}
                                    {this.state.invalidCredentialsGeneral && (
                                        <div className='invalid-message'>
                                            <p>Invalid Credentials!</p>
                                        </div>
                                    )}

                                </Grid>
                            </Grid>
                        </Grid>


                    </Paper>

                </div>
            </div>
        )
    }
}

export default LoginForm;