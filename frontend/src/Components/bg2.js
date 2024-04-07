import styles from './CSS/background2.module.css';
import Bg_2 from '../public/Bg_2.png';
import logo from '../public/logo.png'
export default function Background2(){
    return(
        <>
        <img className={styles.logo} src={logo} alt="Logo" onClick={()=>window.location.href = '/'} />
        <span className={styles.box}>
            <img className={styles.bg2} src={Bg_2} alt="Background Image" />
          </span>
        </>
    );
}