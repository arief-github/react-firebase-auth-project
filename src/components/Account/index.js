import React from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => {
	return (
		<div>
			<h1> AccountPage </h1>
			<PasswordForgetForm/>
			<PasswordChangeForm/>
		</div>
	)
}

export default AccountPage;