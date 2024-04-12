import { useRef, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from '../styles/form.module.css';
import Background2 from '../Components/bg2';

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [wrongUserPass, setWrongUserPass] = useState(false);
  const fnameInputRef = useRef();
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // check if logged in and redirect to home page if so
  useEffect(() => {
	if(registered){
		window.location.href = '/login';
	}
	else setIsLoading(false)
  },[registered]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // This goes to our signup API endpoint
	async function createUser(fname, username, email, password) {
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
		method: 'POST',
		body: JSON.stringify({ fname, username, email, password }),
		headers: {
			'Content-Type': 'application/json',
		},
		});
	
		const data = await response.json();
	
		if (!response.ok) {
		throw new Error(data.message || 'Something went wrong!');
		}
	
		return data;
	}

  async function submitHandler(event) {
    event.preventDefault();

    const enteredFname = fnameInputRef.current.value;
    const enteredUsername = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

      try {
        const result = await createUser(enteredFname, enteredUsername, enteredEmail, enteredPassword);
        setRegistered(true)
		console.log("success");
        window.location.href = '/login'
      } catch (error) {
        console.log(error);
		setWrongUserPass(true);
      }    
  }

  return (
		<div className={styles.body}>
		  	<span className={styles.primarybox}>
				<div className={styles.form}>
					<h2 style={{textAlign: 'center'}}>Sign Up</h2>
					<br/>
					<form onSubmit={submitHandler}> 
						{/* FULL NAME */}
						<div className="form-floating mb-3">
							<input type="name" className="form-control" id="name" placeholder="John Wick" required ref={fnameInputRef}/>
							<label htmlFor="name">Full Name</label>
						</div>

						{/* PHONE NUMBER  */}
						<div className="form-floating mb-3">
							<input type="text" className="form-control" id="username" placeholder="johnwick" required ref={usernameInputRef}/>
							<label htmlFor="username">Username</label>
						</div>

						{/* EMAIL ID */}
						<div className="form-floating mb-3">
							<input type="email" className="form-control" id="email" placeholder="name@example.com" required ref={emailInputRef}/>
							<label htmlFor="email">Email address</label>
						</div>

						{/* PASSWORD  */}
						<div className="form-floating mb-3">
							<input type="password" className="form-control" id="pass" placeholder="Password" required ref={passwordInputRef}/>
							<label htmlFor="pass">Password</label>
						</div>
						
						
						<div style={{textAlign: 'center'}}>          
							<input className="btn btn-outline-success" type="submit" value="Sign Up" />
						</div>

						<div style={{textAlign: 'center'}}>
						<a className={styles.next} href="/newlogin" >Have an account? Sign In here</a>
						{wrongUserPass?
							<p style={{color: 'red'}}>This username/email is already taken!</p>:<></>
						}
						</div>         
					</form>
				</div>
		  	</span>
		  	<Background2></Background2>
			  <style>{`
			body{
				overflow: hidden;
				position: relative;
			}`}</style>
		</div>
	);
}

export default SignUpForm;