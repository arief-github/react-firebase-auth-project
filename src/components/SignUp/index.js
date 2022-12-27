import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';

const SignUpPage = () => {
    return (
        <div>
			<h1>SignUp</h1>
			<SignUpForm/>
		</div>
    )
}

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        event.preventDefault();

        const { username, email, passwordOne, isAdmin } = this.state;
        const roles = {};

        if(isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // create a user in your firebase realtime database
                return this.props.firebase
                .user(authUser.user.uid)
                .set({
                    username,
                    email,
                    roles
                })
            })
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onChangeCheckbox = (event) => {
        this.setState({ [event.target.name]: event.target.checked })
    }

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            error
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
				<input
					name="username"
					value={username}
					onChange={this.onChange}
					type="text"
					placeholder="Full Name"
				/>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
				/>
				<input
					name="passwordOne"
					value={passwordOne}
					onChange={this.onChange}
					type="password"
					placeholder="Password"
				/>
				<input
					name="passwordTwo"
					value={passwordTwo}
					onChange={this.onChange}
					type="password"
					placeholder="Confirm Password"
				/>
                <label>
                    Admin:
                    <input
                        name="isAdmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={this.onChangeCheckbox}
                    />
                </label>
				<button disaled={isInvalid} type="submit">Sign Up</button>
				{error && <p>{error.message}</p>}
			</form>
        )
    }
}

const SignUpLink = () => {
    return (
        <p>
			Don't have an account ? <Link to={ROUTES.SIGN_UP}>Sign Up</Link> 
		</p>
    )
}

const SignUpForm = compose(
	withRouter,
	withFirebase,
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };