import React, {Component} from 'react'
import Header from '../Header'
import './login.css'
import LoginForm from './LoginForm'

class Login extends Component {
    constructor() {
        super()            
    }
    render () {
        return (
            <div>
                <Header/>
                <LoginForm/>
            </div>       
        )
    }
}

export default Login;