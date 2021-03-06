import React from "react";
import Tip from "../Tip/Tip.jsx";
import "./style.css";

export default class Form extends React.Component {
    state = {
        value: "",
        tips: []
    }

    idx = null;

    render() {
        return (
            <div>
                <form>
                    <label htmlFor="main">Input Data</label>
                    <input type="text" id="main" value={ this.state.value } className="main" placeholder="Input Data..." onChange={ this.handleChange }></input>
                </form>
                <ul>
                    {
                        this.state.tips.map(item => (<Tip key={ item.id } value={ item.value } onClick={ this.onLiClick }/>))
                    }
                </ul>
            </div>
        )
    }

    handleChange = (e) => {
        let value = e.target.value;

        this.setState({
            tips: []
        });

        if (this.idx) {
            clearTimeout(this.idx);

            this.idx = null;
        }

        if (value.length > 2) {
            this.idx = setTimeout(() => {
                fetch(`/api/getTips?text=${value}`)
                    .then(res => res.json())
                    .then(tips => {
                        return this.setState({tips: tips})
                    });
            }, 1000);
        }

        this.setState({
            value: value
        });
    }

    onLiClick = (value) => {
        this.setState({
            value: value,
            tips: []
        });
    }
};

