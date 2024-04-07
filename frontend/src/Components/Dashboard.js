import logo from '../public/logo.png'
import styles from './CSS/dash.module.css';
import { useState, useEffect } from 'react';


export default function Dashboard({ profileImg })
{
  const [clientWindowHeight, setClientWindowHeight] = useState("");
  const [backgroundTransparency, setBackgroundTransparency] = useState(0);
  const [linkColor, setaColor] = useState('black');

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

    return(
      <div className={styles.upperbody}>
      
      <nav className= {`navbar navbar-expand-lg ${styles.navbar}`} style={{background: "#35A24E"}}>
      <div className="container-fluid">
        <a className="ms-3" href="/"><img className={styles.logo1} src={logo} alt='Logo'/></a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          {/* <span className="navbar-toggler-icon"> */}
          <img className= {`navbar-toggler-icon ${styles.profile}`} src={profileImg} alt="Profile img" width={500} height={500} style={{borderRadius:'50%'}}/>
          {/* </span> */}
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className={`${styles.ull} navbar-nav ms-auto mb-2 mb-lg-0 me-3`}>
          <li className="nav-item mx-2">
              <a className="nav-link active" aria-current="page" href='/myacc'>My Account</a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link active" aria-current="page" href='/myreviews'>My Reviews</a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link active" aria-current="page" href="/writereview">Write Review</a>                  
            </li> 
            <li className="nav-item mx-2">
              <a className="nav-link active" aria-current="page" href="/search">Browse</a>                  
            </li>

            
          </ul>
          <a href='/myacc'><img className={styles.profile1} src={profileImg} alt="Profile img" width={500} height={500} style={{borderRadius:'50%'}}/></a>

        </div>
      </div>
    </nav>

        {/* <nav className={styles.navbar} id="navbar">
          <a href='/'><img className={styles.logo} src={logo} alt="Logo" /></a>
          <ul className={styles.ull} style={{listStyleType: 'none'}}>
            <li className={styles.nav}><a href='/myreviews' className={styles.nav3}>My Reviews</a></li>
            <li className={styles.nav}><a href='/writereview' className={styles.nav3}>Write Review</a></li>
            <li className={styles.nav}><a href='/search' className={styles.nav3}>Browse</a></li>
            <a href='/myacc'><img className= {styles.profile} src={profileImg} alt="Profile img" width={500} height={500} style={{borderRadius:'50%'}}/></a> 
          </ul>
            </nav> */}
            <style jsx global>{`
    body {
      overflow-x: hidden;
      position: relative;
    }
    `}</style>
        </div>
        
    );
}