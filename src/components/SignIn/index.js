import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const SignInPage = () => {
    return (
        <div>
			<h1> Sign In </h1>
			<SignInForm/>
			<SignInGoogle/>
			<PasswordForgetLink/>
			<SignUpLink/>
		</div>
    )
}

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
}

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        event.preventDefault();
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch((error) => {
                this.setState({ error });
            })
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
		        <input
		          name="email"
		          value={email}
		          onChange={this.onChange}
		          type="text"
		          placeholder="Email Address"
		        />
		        <input
		          name="password"
		          value={password}
		          onChange={this.onChange}
		          type="password"
		          placeholder="Password"
		        />
		        <button disabled={isInvalid} type="submit">
		          Sign In
		        </button>

		        {error && <p>{error.message}</p>}
      		</form>
        )
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null }
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: [],
                    })
                    .then(() => {
                        this.setState({ error: null });
                        this.props.history.push(ROUTES.HOME)
                    })
                    .catch(error => {
                        this.setState({ error })
                    })
            })
            .catch(err => {
                this.setState({ err })
            })

        event.preventDefault();
    }

    render() {
        const { error } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
				<button type="submit" >Sign In With Google</button>

				{error && <p>{error.message}</p>}
			</form>
        )
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(SignInFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

export default SignInPage;
export { SignInForm, SignInGoogle };