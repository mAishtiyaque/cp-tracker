import { useRef, useState } from 'react';
import { useAuth } from '@/lib/AuthUserContext';

export default function SignInPage({ closeDialog, setPageName, alertMe }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { SignIn, SendEmailVerification,SignOut } = useAuth();
  const onSubmit = event => {
    // setError(null)
    SignIn(email, password)
      .then(authUser => {
        if (!authUser.user.emailVerified) {
          SendEmailVerification()
            .then(() => {
              // setTimeActive(true)
              setPageName('emailverify');
            })
            .catch(err => alertMe(err.message, 'danger'))
        } else {
          closeDialog();
          alertMe('Logged In Success!', 'success')
        }
      })
      .catch(error => {
        alertMe(error.message, 'danger')
      });
    event.preventDefault();
  };
  const transRef = useRef()
  const transLogReg = (opera) => {
    if (opera === 'signup')
      transRef.current.classList.add('marginleft');
    else if (opera === 'signin')
      transRef.current.classList.remove('marginleft');
  }
  const handleForgotPassword = () => {
    setPageName('forgotpassword')
  }
  return (
    <div className="main2">
      <div className="thirdparty">
        <div
        // onClick="googleAuth()"
        >
          <span>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px"
              viewBox="0 0 48 48" enableBackground="new 0 0 48 48" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
              </path>
            </svg>
          </span>
          <span>Continue with Google</span>
        </div>
        <div>
          <span>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em"
              width="1em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z">
              </path>
            </svg>
          </span>
          <span>Continue with Facebook</span>
        </div>
        <div>
          <span>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em"
              width="1em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z">
              </path>
              <path
                d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z">
              </path>
            </svg>
          </span>
          <span>Continue with Apple</span>
        </div>
      </div>
      <div className="horizon"></div>
      <div className="trans" ref={transRef}>
        <div>
          <div className="userpass">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              name="email"
              id="loginEmail"
              placeholder="Email"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              id="loginPassword"
            />
            <div>
              <input type="checkbox" /> <span>Keep me signed in until sign out</span>
            </div>
            <button className="signin" onClick={onSubmit}>Sign In</button>
            <button className="forgot" onClick={handleForgotPassword}>Forgot password? </button>
          </div>
          <div className="signup"> No account?
            <button onClick={() => transLogReg('signup')}> Create one</button>
          </div>
        </div>
        <div>
          <SignUpPage setPageName={setPageName} alertMe={alertMe} />
          <div className="signup">Already a member?
            <button onClick={() => transLogReg('signin')}>Sign In </button>
          </div>
        </div>
      </div>
    </div>

  )
}

const SignUpPage = ({setPageName,alertMe}) => {
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  // const router = useRouter();
  // const [error, setError] = useState(null);
  const { SignUp, SendEmailVerification,UpdateProfile } = useAuth();
  const onSubmit = event => {
    // setError(null)
    //check if passwords match. If they do, create user in Firebase
    // and redirect to your logged in page.
    if (passwordOne === passwordTwo)
      SignUp(email, passwordOne)
        .then(authUser => {
          UpdateProfile(newName, photoUrl)
          .then(() => {
            SendEmailVerification()
            .then(() => {
                  console.log("Success. The user is created in Firebase",authUser)
                  // setTimeActive(true) // for resend
                  setPageName('emailverify');

                }).catch((err) => alertMe(err.message, 'danger'))
            })
            .catch(error => {
              alertMe(error.message, 'danger')
            });
        }).catch(error => {
          alertMe(error.message, 'danger')
        });
    else
      alertMe("Password do not match", 'danger')
    event.preventDefault();
  };

  return (

    <div className="userpass">
      <input
        type="text"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        name="newName"
        id="newName"
        placeholder="Enter your name"
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        name="email"
        id="signUpEmail"
        placeholder="Email"
      />
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        onChange={(event) => setPasswordOne(event.target.value)}
        id="signUpPassword"
        placeholder="Password"

      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="password"
        value={passwordTwo}
        onChange={(event) => setPasswordTwo(event.target.value)}
        id="signUpPassword2"
      />
      <input
        type="text"
        value={photoUrl}
        onChange={(event) => setPhotoUrl(event.target.value)}
        name="photoUrl"
        id="photoUrl"
        placeholder="Insert URL for profile image (optional)" />
      <button className="signin" onClick={onSubmit}>
        Sign Up
      </button>
    </div>
  )
}

//export SignUpPage;