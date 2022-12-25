import React from 'react';
import * as ROLES from '../../constants/roles';

const AdminPage = () => {
	return (
		<div>
			<h1> AdminPage </h1>
			<p> 
				Restricted area! Only users with the admin role are authorized
			</p>
		</div>
	)
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN]

export default AdminPage;