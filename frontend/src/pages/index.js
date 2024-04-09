import logo from '../public/logo.png';
import el1 from '../public/Ellipse 1.png'
import el2 from '../public/Ellipse 2.png'
import el3 from '../public/Ellipse 3.png'
import styles from '../styles/styles.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function Home(){
  const [clientWindowHeight, setClientWindowHeight] = useState("");
  const [backgroundTransparency, setBackgroundTransparency] = useState(0);
  const [linkColor, setaColor] = useState('black');
  const [loggedIn, setLoggedIn] = useState(
    true && Cookies.get("token")
  );

    const handleScroll = () => {
      setClientWindowHeight(window.scrollY);
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll); 
      return () => window.removeEventListener("scroll", handleScroll);
      });
      useEffect(() => {
        if (clientWindowHeight>10){
            setBackgroundTransparency(100);
            setaColor('white');
        }
        if (clientWindowHeight<10){
          setBackgroundTransparency(0);
          setaColor('black');
        }
      }, [clientWindowHeight]);

    async function signOut() {
      Cookies.remove("token");
      window.location.href = '/'
    }


    return (
      <div className={styles.upperbody}>
       
        <nav className= {`navbar navbar-expand-lg ${styles.navbar}`}>
          <div className="container-fluid">
            <a className="ms-3" href="/"><img className={styles.logo1} src={logo} alt='Logo'/></a>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className={`${styles.ull} navbar-nav ms-auto mb-2 mb-lg-0 me-3`}>

                {!loggedIn?<>
                <li className="nav-item mx-2">
                  <a className="nav-link active" aria-current="page" href="/login">Log In</a>                  
                </li> 
                <li className="nav-item mx-2">
                  <a className="nav-link active" aria-current="page" href="/signup">Sign Up</a>                  
                </li></>:<>
                <li className="nav-item mx-2">
                  <a className="nav-link active" aria-current="page" href="/search">Browse</a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link active" aria-current="page" href="mailto:praneel.bora@somaiya.edu">Contact</a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link active" aria-current="page" href='/' onClick={() => signOut()}>Sign Out</a>                  
                </li></>}
                

                
              </ul>
              
            </div>
          </div>
        </nav>


        {/* HERO SECTION  */}
        <section className={styles.hero}>
          <div className={styles.lorem}>THE travel website,<br/> for the travelers,<br/> by the travelers!</div>
          <img className={styles.el1} src={el1} alt="Ellipse1" />
          <img className={styles.el2} src={el2} alt="Ellipse2" />
          <img className={styles.el3} src={el3} alt="Ellipse3" />
        </section>
        
    <style>{`
    html, body {
      overflow: hidden;
      position: relative;
    }
    `}</style>
      </div>
    );
  }
