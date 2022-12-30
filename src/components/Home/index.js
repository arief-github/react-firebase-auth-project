import React, { Component } from 'react';
import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

const HomePage = () => (
		<div>
			<h1> HomePage </h1>
			<p>The Home Page is accessible by every signed in user</p>

			<Messages/>
		</div>
)
	 


class MessagesBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			messages: [],
		}
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.messages().on('value' , snapshot => {
			const messageObject = snapshot.val();

			if(messageObject) {
				this.setState({ loading: false })

				const messageList = Object.keys(messageObject).map(key => ({
					...messageObject[key],
					uid: key
				}))

				this.setState({
					messages: messageList,
					loading: false,
				})
			} else {
				this.setState({ messages: null, loading: false })
			}
		})
	}

	componentWillUnmount() {
		this.props.firebase.messages().off();
	}

	render() {
		const { messages, loading } = this.state;

		return (
			<div>
				{ loading && <div>loading...</div> }

				{messages ? (<MessageList messages={messages}/>) : (<div>There are no messages ... </div>)}
				
			</div>
		)
	}
}

const MessageList = ({ messages }) => ( 
	<ul>
		{
			messages.map(message => (<MessageItem key={message.uid} message={message} />))
		}
	</ul>
)

const MessageItem = ({ message }) => (
	<li>
		<strong>{message.userId}</strong> { message.text }
	</li>
)

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition)
)(HomePage);