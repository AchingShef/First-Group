import React from "react";
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
                    <input type="text" id="main" value={this.state.value} className="main" placeholder="Input Data..." onChange={this.handleChange}></input>
                </form>
                <ul>
                    {
                        this.state.tips.forEach((item) => {
                            debugger;
                        })
                    }
                </ul>
            </div>
        )
    }

    handleChange = (e) => {
        let value = e.target.value;

        if (value.length > 2) {
            if (this.idx) {
                clearTimeout(this.idx);

                this.idx = null;
            }

            this.idx = setTimeout(() => {
                fetch(`/api/getTips?text=${value}`)
                    .then(res => res.json())
                    .then(tips => this.setState({tips: tips.tips})
                );
            }, 1000);
        }

        this.setState({
            value: value
        });
    }
};

