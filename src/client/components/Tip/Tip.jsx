import React from "react";
import "./style.css";

export default class Tip extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        }

    }

    render() {
        return (
            <li onClick={this.onClick}>{ this.state.value }</li>
        )
    }

    onClick = () => {
        this.props.onClick(this.state.value);
    }
};

