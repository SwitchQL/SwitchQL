//node libraries
import React, { Component } from 'react';
import some from 'lodash.some'

//internal files
import './styles/form.css';
import logo from './img/logo.png';
import icon from './img/icon.png';

const databaseTypes = ['PostgreSQL', 'MySQL', 'SQLServer'];

export default class Form extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: '',
            host: '',
            port: '',
            user: '',
            password: '',
            database: '',
            schema: '',
            type: 'PostgreSQL',
            formError: { twoConnect: false, incomplete: false, emptySubmit: false }
        };

        this.valueChange = this.valueChange.bind(this);
        this.submit = this.submit.bind(this);
        this.connFormStarted = this.connFormStarted.bind(this);
    }

    valueChange ({ target }) {
        const { name, value } = target;
        this.setState({ [name]: value });
    }

    submit () {
        if (!this.isFormValid()) return false;

        const { formError, ...payload } = this.state

        this.props.onSubmit(JSON.stringify(payload));

        this.setState({
            value: '',
            host: '',
            port: '',
            user: '',
            password: '',
            database: '',
            schema: '',
            type: 'PostgreSQL',
            formError: { twoConnect: false, incomplete: false, emptySubmit: false }
        });
    }

    connFormStarted () {
        const { host, port, user, password, database } = this.state
        return !!(host || port || user || password || database)
    }

    isFormValid () {
        const { formError, type, ...form } = this.state

        if (!some(form, val => !!val)) {
            this.setState({ formError: { emptySubmit: true } });
            return false;
        }

        const { value, host, port, user, password, database, schema } = form
        const formComplete = !!(host && port && user && password && database)

        if ((!value && !formComplete) || !schema) {
            this.setState({ formError: { incomplete: true } });
            return false;
        }


        this.setState({ formError: { twoConnect: false, incomplete: false, emptySubmit: false } })
        return true;
    }

    render () {
        let formError;

        if (this.state.formError.incomplete) {
            formError = (
                <div className="warning">
                    <b>*</b>These fields are required.
                </div>
            );
        } else if (this.state.formError.emptySubmit) {
            formError = (
                <div className="warning">Please choose a connection method.</div>
            );
        }

        const classList = this.props.isOpen
            ? `formvis fadeInScale`
            : `formvis fadeOutScale`;

        return (
            <div className={classList}>
                <form>
                    <div className="formIn">
                        <a
                            href="https://github.com/SwitchQL/SwitchQL/blob/master/README.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={icon} className="icon" />
                        </a>
                        <img src={logo} className="logo" />
                        <div className="welcome">
                            switch<b>QL</b>
                        </div>

                        <div className="radioWrapper">
                            {databaseTypes.map((n, i) => {
                                return (
                                    <label key={i} className="radioBtn">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={n}
                                            checked={this.state.type === n}
                                            onChange={this.valueChange}
                                        />
                                        {n}
                                    </label>
                                );
                            })}
                        </div>

                        <div className="connect">Connect To Your Database</div>
                        <textarea
                            placeholder="Connection String"
                            name="value"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.value}
                            onChange={this.valueChange}
                            disabled={this.connFormStarted()}
                        />

                        <input
                            placeholder="Schema*"
                            name="schema"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.schema}
                            onChange={this.valueChange}
                        />

                        <div className="connect">Connection String Unavailable?</div>
                        <textarea
                            disabled={this.state.value}
                            placeholder="Host Name*"
                            name="host"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.host}
                            onChange={this.valueChange}
                        />

                        <textarea
                            disabled={this.state.value}
                            placeholder="Port Number*"
                            name="port"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.port}
                            onChange={this.valueChange}
                        />

                        <textarea
                            disabled={this.state.value}
                            placeholder="User Name*"
                            name="user"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.user}
                            onChange={this.valueChange}
                        />

                        <input
                            disabled={this.state.value}
                            placeholder="Password*"
                            name="password"
                            className="question"
                            required
                            autoComplete="off"
                            type="password"
                            value={this.state.password}
                            onChange={this.valueChange}
                        />

                        <textarea
                            disabled={this.state.value}
                            placeholder="Database Name*"
                            name="database"
                            className="question"
                            required
                            autoComplete="off"
                            type="text"
                            value={this.state.database}
                            onChange={this.valueChange}
                        />

                        <button
                            type="button"
                            className="button"
                            onClick={this.submit}
                        >
                            Generate GraphQL
                        </button>

                        <button
                            type="button"
                            className="exit"
                            onClick={() => this.props.onClose()}
                        >
                            ×
                        </button>
                        {formError}
                    </div>
                </form>
            </div>
        );
    }
}
