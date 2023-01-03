import { MouseEvent, useRef, useContext } from "react";
import { SessionContext } from "../../context/session";
import { setGuestSession } from "../../utils/auth";

import styles from "./Auth.module.css";
import GoogleOAuth from "../../assets/oauth_google.png";
import FacebookOAuth from "../../assets/oauth_facebook.png";

// TODO: clean up this component

const Auth = () => {
  const guestNameRef = useRef<HTMLInputElement | null>(null);
  const session = useContext(SessionContext);

  async function handleGuestLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!guestNameRef.current || !guestNameRef.current.value) return;

    const user = await setGuestSession(guestNameRef.current.value);

    if (user) {
      session?.setUser(user);
    } else {
      console.log("guest auth failed");
    }
  }

  return (
    <div className={styles.authBox}>
      <div className={`${styles.section} ${styles.sectionLeft}`}>
        <h3>Guest login</h3>
        <form>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="guest-username">
              Username
            </label>
            <input
              type="text"
              id="guest-username"
              ref={guestNameRef}
              className={styles.formInput}
              pattern="[a-zA-Z0-9_-]+"
              title="_ - and alphanumeric characters only"
              required
            />
          </div>
          <button className={styles.formButton} type="submit" onClick={handleGuestLogin}>
            Continue as Guest
          </button>
        </form>
      </div>
      <div className={`${styles.section} ${styles.sectionRight}`}>
        <div className={styles.sectionDisabled}>coming soon.</div>
        <h3>
          Sign In{" "}
          <span className={styles.orRegister}>
            or <a href="#">register</a>
          </span>
        </h3>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Username/Email
            </label>
            <input type="email" id="email" className={styles.formInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input type="password" id="password" className={styles.formInput} />
          </div>
          <button className={styles.formButton} disabled>
            Sign In
          </button>
        </form>
        <div className={styles.oauth}>
          <button className={styles.oauthButton} disabled>
            <img src={GoogleOAuth} alt="Google" />
          </button>
          <button className={styles.oauthButton} disabled>
            <img src={FacebookOAuth} alt="Facebook" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
