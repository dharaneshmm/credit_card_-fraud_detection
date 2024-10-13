import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { toast } from 'react-toastify';
import { setDoc, doc } from 'firebase/firestore';
import googleLogo from '../google.png'; // Import image directly

function SignInwithGoogle() {
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '', // Extract first name
          lastName: user.displayName?.split(' ')[1] || '', // Extract last name
          photo: user.photoURL || '', // Handle cases where photoURL might be undefined
        });
        toast.success('User logged in Successfully', {
          position: 'top-center',
        });
        window.location.href = '/'; // Redirect to home or desired page
      }
    } catch (error) {
      console.error('Error during Google login:', error.message);
      toast.error('Failed to log in with Google', {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div className="google-signin-container">
      <p className="continue-p">-- Or continue with --</p>
      <div
        className="google-signin-button"
        onClick={googleLogin}
        style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
      >
        <img
          src={googleLogo}
          alt="Sign in with Google"
          style={{ width: '40px', height: '40px' }} // Adjust size as needed
        />
      </div>
    </div>
  );
}

export default SignInwithGoogle;
