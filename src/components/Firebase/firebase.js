import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectID: process.env.REACT_APP_PROJECT_ID,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderID: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appID: process.env.REACT_APP_APP_ID,
	measurementID: process.env.REACT_APP_MEASUREMENT_ID,
}

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig);

		this.auth = app.auth();
	}

	// auth API for create user and sign in
	doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
	doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

	// auth API for signOUt
	doSignOut = () => this.auth.signOut();

	// auth API for reset and change password
	doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
	doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);	
}

export default Firebase;