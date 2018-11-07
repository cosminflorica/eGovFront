import React, { Component } from 'react'
import Header from '../Header'
import Paper from '@material-ui/core/Paper'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as jsPDF from 'jspdf'
import './formular.css'
import axios from 'axios'

var validator = require("email-validator");
var doc = new jsPDF();
class Formular extends Component {

    state = {
        alignment: 'left',
        judet: '',
        judetError: true,
        nume: '',
        numeError: false,
        prenume: '',
        prenumeError: false,
        email: '',
        emailError: false,
        capacitate: '',
        capacitateError: true,
        invalidEmail: false,
        invalidCapacitate: false,
        invalidNume: false,
        invalidPrenume: false,
        invalidJudet: false,
        open: false,
        valoare: ''
    }
    constructor(props) {
        super(props)

        this.state = {
            user: props.location.state.user,
            judetError: true,
            capacitateError: true,

        }
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    calculateDate() {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        return datetime;
    }
    calculateImpozit() {
        if (this.state.capacitate < 1600) {
            this.setState({
                valoare: Math.floor(this.state.capacitate / 200) * 8
            })
            return;
        }
        if (this.state.capacitate < 2000) {
            this.setState({
                valoare: Math.floor(this.state.capacitate / 200) * 18
            })
            return;
        }
        if (this.state.capacitate < 2600) {
            this.setState({
                valoare: Math.floor(this.state.capacitate / 200) * 72
            })
            return;
        }
        if (this.state.capacitate < 3000) {
            this.setState({
                valoare: Math.floor(this.state.capacitate / 200) * 144
            })
            return;
        }
        if (this.state.capacitate > 3000) {
            this.setState({
                valoare: Math.floor(this.state.capacitate / 200) * 290
            })
            return;
        }
    }

    handleAlignment = (event, alignment) => this.setState({ alignment });

    handleClickOpen() {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleDownloadPDF = () => {
        var numePDF = '';
        var textPDF = '';
        numePDF = this.state.user.nume + '' + this.state.user.prenume + '' + this.calculateDate() + '.pdf';
        textPDF = '\tCalculator impozit 2018 \t \t Formular electronic \n\n\n\n\tData: ' + this.calculateDate() + '\n\tNume: ' + this.state.user.nume + '\n\tPrenume: ' + this.state.user.prenume + '\n\tEmail: ' + this.state.user.email + '\n\n\tJudet: ' + this.state.judet + '\n\tCapacitate cilindrica: ' + this.state.capacitate + ' cmc\n\n\tValoare impozit 2018: ' + this.state.valoare + ' lei';

        doc.text(textPDF, 10, 10);
        doc.save(numePDF);
        console.log(this.state);
        console.log(JSON.stringify(this.state));
        
        axios.post('http://localhost:8080/api/user/xml', {
            nume: this.state.user.nume,
            prenume: this.state.user.prenume,
            email: this.state.user.email,
            judet: this.state.judet,
            valoare: this.state.valoare
        }).then(response => {
            //test
            console.log(response.data)
        }).catch(error => {
            console.log(error)
        })
    }
    handleChangeNume = (event) => {
        this.setState({
            invalidNume: false,
            nume: event.target.value,
            numeError: false
        })
        if (this.state.nume === '') {
            this.setState({
                numeError: true
            })
        }
    };
    handleChangeJudet = (event) => {
        if (event.target.value === '0') {
            this.setState({
                judetError: true
            })
            return;
        }
        this.setState({
            invalidJudet: false,
            judetError: false,
            judet: event.target.value
        })
    }
    handleChangeEmail = (event) => {
        this.setState({
            invalidEmail: false,
            email: event.target.value,
            emailError: !validator.validate(event.target.value)
        })
    }
    handleChangePrenume = (event) => {
        this.setState({
            prenume: event.target.value,
            prenumeError: false
        })
    }
    handleChangeCapacitate = (event) => {
        if (event.target.value < 200) {
            this.setState({
                capacitateError: true,
                capacitate: event.target.value
            })
            return;
        }
        if (event.target.value > 8000) {
            this.setState({
                capacitateError: true,
                capacitate: event.target.value
            })
            return;
        }
        this.setState({
            capacitateError: false,
            capacitate: event.target.value,
            invalidCapacitate: false
        })
    }
    handleOnClick = (event) => {
        if (this.state.email === '' || this.state.emailError) {
            this.setState({
                invalidEmail: true
            })
            return;
        }
        if (this.state.nume === '' || this.state.numeError) {
            this.setState({
                invalidNume: true
            })
            return;
        }
        if (this.state.judet === "0" || this.state.judetError) {
            this.setState({
                invalidJudet: true
            })
            return;
        }
        if (this.state.prenume === '' || this.state.prenumeError) {
            this.setState({
                invalidPrenume: true
            })
            return;
        }
        if (this.state.capacitate === 0 || this.state.capacitateError) {
            this.setState({
                invalidCapacitate: true
            })
            return;
        }
        this.calculateImpozit();
        this.handleClickOpen();
    }
    render() {
        return (
            <div>
                <Header subtitle="Formular electronic" />

                <div className="container">

                    <Paper elevation={3}>
                        <h2 className="formularTitle"> Calculator impozit auto 2018 </h2>
                        <div Name="line"></div>
                        <br></br>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <Grid container justify='center'>
                                    <TextField className="field" id="outlined-name" label="Nume"
                                        defaultValue={this.state.user.nume ? this.state.user.nume : null}
                                        onChange={this.handleChangeNume}
                                        margin="normal"
                                        variant="outlined"
                                        error={this.state.numeError}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justify='center'>
                                    <TextField
                                        className="field"
                                        id="outlined-name"
                                        label="Prenume"
                                        defaultValue={this.state.user.prenume ? this.state.user.prenume : null}
                                        onChange={this.handleChangePrenume}
                                        margin="normal"
                                        variant="outlined"
                                        error={this.state.prenumeError}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={24} alignContent="space-around" alignItems="center">
                            <Grid item xs={12}>
                                <Grid container justify='center'>
                                    <TextField
                                        className="fieldEmail"
                                        id="outlined-name"
                                        label="E-mail"
                                        defaultValue={this.state.user.email ? this.state.user.email : null}
                                        onChange={this.handleChangeEmail}
                                        margin="normal"
                                        error={this.state.emailError}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <br></br>
                        <div class="line"></div>
                        <br></br>
                        <br></br>
                        <Grid container spacing={24} alignContent="space-around">
                            <Grid item xs={12}>
                                <Grid container justify='center'>
                                    <FormControl variant="outlined" className="formControl">
                                        <InputLabel
                                            ref={ref => {
                                                this.InputLabelRef = ref;
                                            }}
                                            htmlFor="outlined-judet-native-simple"
                                        >
                                            Județ
                                        </InputLabel>
                                        <Select
                                            native
                                            vlue={this.state.judet}
                                            onChange={this.handleChangeJudet}
                                            error={this.state.judetError}
                                            input={
                                                <OutlinedInput
                                                    name="judet"
                                                    labelWidth={40}
                                                    id="outlined-judet-native-simple"
                                                />
                                            }
                                        >
                                            <option value="0">-Alege-</option>
                                            <option value="Alba">Alba</option>
                                            <option value="Arad">Arad</option>
                                            <option value="Arges">Arges</option>
                                            <option value="Bacau">Bacau</option>
                                            <option value="Bihor">Bihor</option>
                                            <option value="Bistrita Nasaud">Bistrita Nasaud</option>
                                            <option value="Botosani">Botosani</option>
                                            <option value="Braila">Braila</option>
                                            <option value="Brasov">Brasov</option>
                                            <option value="Bucuresti">Bucuresti</option>
                                            <option value="Buzau">Buzau</option>
                                            <option value="Calarasi">Calarasi</option>
                                            <option value="Caras Severin">Caras Severin</option>
                                            <option value="Cluj">Cluj</option>
                                            <option value="Constanta">Constanta</option>
                                            <option value="Covasna">Covasna</option>
                                            <option value="Dambovita">Dambovita</option>
                                            <option value="Dolj">Dolj</option>
                                            <option value="Galati">Galati</option>
                                            <option value="Giurgiu">Giurgiu</option>
                                            <option value="Gorj">Gorj</option>
                                            <option value="Harghita">Harghita</option>
                                            <option value="Hunedoara">Hunedoara</option>
                                            <option value="Ialomita">Ialomita</option>
                                            <option value="Iasi">Iasi</option>
                                            <option value="Ilfov">Ilfov</option>
                                            <option value="Maramures">Maramures</option>
                                            <option value="Mehedinti">Mehedinti</option>
                                            <option value="Mures">Mures</option>
                                            <option value="Neamt">Neamt</option>
                                            <option value="Olt">Olt</option>
                                            <option value="Prahova">Prahova</option>
                                            <option value="Salaj">Salaj</option>
                                            <option value="Satu Mare">Satu Mare</option>
                                            <option value="Sibiu">Sibiu</option>
                                            <option value="Suceava">Suceava</option>
                                            <option value="Teleorman">Teleorman</option>
                                            <option value="Timis">Timis</option>
                                            <option value="Tulcea">Tulcea</option>
                                            <option value="Valcea">Valcea</option>
                                            <option value="Vaslui">Vaslui</option>
                                            <option value="Vrancea">Vrancea</option>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={24} alignContent="space-around" alignItems="center">
                            <Grid item xs={12}>
                                <Grid container justify='center'>
                                    <TextField
                                        className="fieldCapacitate"
                                        id="outlined-name"
                                        label="Capacitate cilindrică"
                                        type="number"
                                        value={this.state.capacitate}
                                        onChange={this.handleChangeCapacitate}
                                        margin="normal"
                                        variant="outlined"
                                        error={this.state.capacitateError}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={24} className='containerButton' alignContent="space-around" alignItems="center">
                            <Grid item xs={12}>
                                <Grid container justify='center'>
                                    <div>
                                        <Button onClick={this.handleOnClick}>Calculeaza impozit</Button>
                                        <Dialog
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                            scroll='paper'
                                            aria-labelledby="scroll-dialog-title"
                                        >
                                            <DialogTitle id="scroll-dialog-title">Formular</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Data:       {this.calculateDate()}<br></br>
                                                    Nume:       {this.state.user.nume}<br></br>
                                                    Prenume:    {this.state.user.prenume}<br></br>
                                                    Email:      {this.state.user.email}<br></br>
                                                    <br></br>
                                                    Judet:      {this.state.judet}<br></br>
                                                    Capacitate Cilindrica: {this.state.capacitate} cmc<br></br>
                                                    <br></br><br></br>
                                                    <h3>Valoare impozit 2018: {this.state.valoare} lei</h3>

                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={this.handleClose} alignment='center' color="primary">
                                                    Cancel
                                    </Button>
                                                <Button onClick={this.handleDownloadPDF} color="primary">
                                                    Download PDF
                                     </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container
                            spacing={16}
                            alignContent='center'
                            alignItems="center"
                            justify='center'
                        >
                            <Grid item md={8}>
                                <Grid container justify='center'>

                                    {this.state.invalidNume && (
                                        <div className='invalid-message'>
                                            <p>Introduceți numele dvs.</p>
                                        </div>
                                    )}
                                    {this.state.invalidPrenume && (
                                        <div className='invalid-message'>
                                            <span>Introduceți prenumele dvs.</span>

                                        </div>
                                    )}
                                    {this.state.invalidCapacitate && (
                                        <div className='invalid-message'>
                                            <p>Doar cifre ! <br></br>Introduceți capacitatea cilindrică a motorului automobilului dvs. <br></br>( între 600 și 8000 cmc )</p>
                                        </div>
                                    )}
                                    {this.state.invalidEmail && (
                                        <div className='invalid-message'>
                                            <p>Adresa de email invalidă</p>
                                        </div>
                                    )}
                                    {this.state.invalidJudet && (
                                        <div className='invalid-message'>
                                            <p>Alegeți județul corespunzător</p>
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

export default Formular;