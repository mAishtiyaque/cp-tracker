import { useAuth } from "@/lib/AuthUserContext";
import LoginBtn from "./LoginBtn";
import Image from "next/image";
import styles from "@/styles/userProfile.module.css";

export default function UserProfile({ alertMe }) {
  const auth = useAuth();
  return (
    <div>
      <div className={styles.user_details}>
        {auth.email && (
          <div className={styles.user}>
            <div className={styles.avatar}>
              {auth.photoURL && (
                <Image
                  width={100}
                  height={100}
                  src={auth.photoURL}
                  alt="User Pic"
                />
              )}
            </div>
            <div className={styles.user_names}>
              <span className={styles.name}>
                {auth.name}
                {auth.emailVerified ? (
                  <svg
                    stroke="currentColor"
                    fill="#7d6cf0"
                    strokeWidth="0"
                    viewBox="-2 -2 24 24"
                    height="1em"
                    width="1em"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path>
                  </svg>
                ) : null}
              </span>
              <span className={styles.email}>{auth.email}</span>
            </div>
          </div>
        )}
        <LoginBtn alertMe={alertMe} />
      </div>
    </div>
  );
}
