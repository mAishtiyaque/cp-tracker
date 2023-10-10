import styles from '@/styles/verify.module.css'
// import {useAuthValue} from './AuthContext'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthUserContext';
// import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function VerifyEmail({ closeDialog, alertMe = () => { } }) {
  const { SendEmailVerification, Reload, emailVerified, email, token } = useAuth();

  // const {currentUser} = useAuthValue()
  const [time, setTime] = useState(60)
  const [timeActive, setTimeActive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      Reload()
        .then((res) => {
          // console.log(res,'>>>',emailVerified,exe)
          if (emailVerified) {
            clearInterval(interval)
            closeDialog();
          }
        })
        .catch((err) => {
          alertMe(err.message, 'danger');
        })
    }, 2000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [email])
  useEffect(() => {
    // console.log('Verify Changed', emailVerified)
    if (emailVerified) {
      axios.post('api/set_new_user', {
        data: { email, token }
      }).then(res => {
        console.log(">>> res ", res)
        // (res.data.acknowledged) ? alertMe('Verified User!', 'success') : null // success
      }).catch(err => {
        alertMe('Something going wrong') // failure
      })
      closeDialog();
    }
    // eslint-disable-next-line
  }, [emailVerified])

  useEffect(() => {
    let interval = null
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    } else if (time === 0) {
      setTimeActive(false)
      setTime(60)
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [timeActive, time, setTimeActive])

  const resendEmailVerification = () => {
    SendEmailVerification()
      .then(() => {
        setTimeActive(true)
      }).catch((err) => {
        alertMe(err.message, 'danger')
      })
  }
  return (
    <div className='center'>
      <div className={styles.verifyEmail}>
        <h1>Verify your Email Address</h1>
        <p>
          <strong>A Verification email has been sent to:</strong><br />
          <span>{email}</span>
        </p>
        <span>Follow the instruction in the email to verify your account</span>
        <button
          onClick={resendEmailVerification}
          disabled={timeActive}
        >Resend Email {timeActive && time}</button>
      </div>
    </div>
  )
}

export default VerifyEmail
