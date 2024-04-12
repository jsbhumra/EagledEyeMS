import { useRef, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from "js-cookie";
import styles from '../styles/form.module.css';
import Background2 from '../Components/bg2';

function LogInForm() {
  const [isLoading, setIsLoading] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  console.log(process.env)
  console.log(process.env.REACT_APP_BACKEND_URL)

  async function signIn(email, password) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

  useEffect(() => {
    setIsLoading(false)
  },[]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value.trimEnd();
    const enteredPassword = passwordInputRef.current.value;

    try {
        const data = await signIn(enteredEmail,enteredPassword);
        const token = data["x-auth-token"];

        Cookies.set("token", token, { expires: 365 }); // Token expires after 365 days
        
		console.log("success");
        window.location.href = '/'
      } catch (error) {
        console.log(error);
      }    

    // optional: Add validation here
    

    

  }
    return (
        <div className={styles.body}>
          <span className={styles.primarybox}>
            <div className={styles.form}>
              <h2 style={{textAlign: 'center'}}>Log In</h2>
              {/* <div className={styles.form} /> */}
              <div className={styles.inner}>
                <form onSubmit={submitHandler}>
                  {/* USERNAME */}
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" placeholder="johnwick@babayaga.com" required ref={emailInputRef}/>
                    <label htmlFor="email">Email</label>
                  </div>
                  {/* PASSWORD  */}
                  <div className="form-floating mb-2">
                    <input type="password" className="form-control" id="pass" placeholder="Password" required ref={passwordInputRef}/>
                    <label htmlFor="pass">Password</label>
                  </div>
                  {/* FORGOT PASSWORD  */}
                  <div style={{width: '100%', textAlign: 'right'}}><a className={styles.next} href="/forgot">Forgot Password</a>
                  </div>
                  {/* LOGIN BUTTON  */}
                  <div style={{textAlign: 'center'}}>
                    <button className="btn btn-outline-success">Log In</button>
                  </div>
                  {/* SIGNUP BUTTON  */}
                  <div style={{width: '100%', textAlign: 'center'}}><a className={styles.next} href="/newsignup">New? Sign Up here</a>
                  </div>
                </form>
              </div>  
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

export default LogInForm;