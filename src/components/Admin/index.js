import React from 'react';

import { withFirebase } from '../Firebase';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            if (usersObject) {
                const usersList = Object.keys(usersObject).map(key => ({
                    ...usersObject[key],
                    uid: key,
                }));

                this.setState({
                    users: usersList,
                    loading: false,
                });
            } else {
                console.error('Error: Data pengguna tidak ditemukan');
                this.setState({
                    loading: false,
                });
            }


        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading, error } = this.state;

        return (
            <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}
        {error && <p>Error data tidak ditemukan</p>}
        <UserList users={users} />
      </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(AdminPage);