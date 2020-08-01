
  import firebase from "firebase";
  const firebaseApp = firebase.initializeApp({
    << your config  >>
  });
  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();
  const storage = firebaseApp.storage();

  export {db, auth, storage};