import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default function() {
  const $auth = getAuth();
  let user;

  const registerUser = async (email, password) => {
    await createUserWithEmailAndPassword($auth, email, password)
    .then((userCredential => {
      // Signed in 
      user = userCredential.user;
    }))
    .catch((error) => {
      console.log(error);
    });
  }

  const loginUser = async (email, password) => {
    await signInWithEmailAndPassword($auth, email, password)
    .then(userLogged => {
      user = userLogged.user
      console.log({user});
    })
    .catch((error) => {
      console.log({error});
    });
  }

  return {
    user,
    registerUser,
    loginUser
  }
}