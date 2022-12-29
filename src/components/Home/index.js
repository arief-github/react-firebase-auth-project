import React from 'react';
import { withAuthorization, withEmailVerification } from '../Session';
import { compose } from 'recompose';

const HomePage = () => {
	return (
		<div>
			<h1> HomePage </h1>
			<p>The Home Page is accessible by every signed in user</p>
		</div>
	)
}

const condition = authUser => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition)
)