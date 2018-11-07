import React, {Component} from 'react'
import './header.css'

class Header extends Component {
    constructor(props){
        super(props);
        if(this.props.subtitle)
        {console.log(this.props.subtitle);
        console.log(!!!this.props.subtitle);  
        }
    }
    render(){
        return (
            <div className="header">
                <div className="header--content">
                    <div className="header--title">
                        Tema 1 - eGovernment 
                    </div>
                    {!!this.props.subtitle && <div className="header--subtitle">{this.props.subtitle}</div>}
                 </div>
            </div>
        )
    }
}
export default Header;