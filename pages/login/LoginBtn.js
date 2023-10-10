import { useEffect, useState } from "react";
import { useAuth } from '@/lib/AuthUserContext';
import VerifyEmail from "./verify";
import SignInPage from "./signIn";
export default function LoginBtn({ alertMe }) {
    const [pageName, setPageName] = useState('signin');
    const auth = useAuth()
    let [authPageShow, setAuthPageShow] = useState(false);
    const showDialog = () => {
        if (auth.email) {
            auth.SignOut()
        }
        else {
            setAuthPageShow(true)
        }
    }
    const closeDialog = () => {
        setAuthPageShow(false);
        setPageName('signin');
    }

    return (
        <>
            <button
                style={{ color: "white" }}
                onClick={showDialog} >
                {auth.email ? "Logout" : "Sign In"}
            </button >
            {authPageShow &&
                <div className='mmodal' id="modal_1">
                    <div className="mmodal-body">
                        <div className="close"> <button onClick={closeDialog}>X</button></div>
                        <div className="hello" >
                            {pageName === 'emailverify' &&
                                // <app-verify-email ></app-verify-email >
                                //"Email Verify"
                                <VerifyEmail
                                    closeDialog={closeDialog}
                                    setPageName={setPageName}
                                    alertMe={alertMe}
                                />
                            }
                            {pageName === 'forgotpassword' &&
                                "Forgot Pass"
                                //<app-forgot-pass></app-forgot-pass>
                            }
                            {pageName === 'signin' &&
                                //"Sign In"
                                <SignInPage
                                    closeDialog={closeDialog}
                                    setPageName={setPageName}
                                    alertMe={alertMe}
                                />
                                //<app-lgpage></app-lgpage >
                            }
                            {pageName === 'signup' &&
                                "Sign In"
                                // <SignUpPage closeDialog={closeDialog} setPageName={setPageName}/>
                                //<app-lgpage></app-lgpage >
                            }
                        </div >
                    </div >
                </div  >
            }
        </>
    )
}
