import React,{ useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
 

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

useEffect(()=>{
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      
      setUser(authUser);
      console.log(authUser);
    }
    else{
      setUser(null);
    }

  });
  return () =>{
    unsubscribe();
  }
},[user, username])  

useEffect(() =>{
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
    setPosts(snapshot.docs.map(doc => ({
      id:doc.id,
      post:doc.data()
    })));
  });
},[]);

const signUp = (event) =>{
  event.preventDefault();

  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser) =>{
    return authUser.user.updateProfile({
      displayName: username,
    })
  })
  .catch((error) => alert(error.message));
  setOpen(false);
}

const signIn = (event) =>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

  setOpenSignIn(false);
}

  return (
    <div className="app">
   
    
      <Modal
      open={open}
      onClose={() => setOpen(false) }
      >
       <div style={modalStyle} className={classes.paper}>
       <form className = "app__signup">
       <center>
          <img 
            className = "app__headerImage"
            src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjtjBw4xwF01ZdKL1cmnYZD3vdavlQPOWA7w&usqp=CAU"
            alt=""
          />
          </center>
       <Input
            placeholder = "username"
            type = "text"
            value = {username}
            onChange = {(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder = "email"
            type = "text"
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder = "password"
            type = "password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
          />
          <Button onClick = {signUp}>Sign Up</Button>
       </form>
      </div>
      </Modal>
      <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false) }
      >
       <div style={modalStyle} className={classes.paper}>
       <form className = "app__signup">
       <center>
          <img 
            className = "app__headerImage"
            src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjtjBw4xwF01ZdKL1cmnYZD3vdavlQPOWA7w&usqp=CAU"
            alt=""
          />
          </center>
          <Input
            placeholder = "email"
            type = "text"
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder = "password"
            type = "password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
          />
          <Button onClick = {signIn}>Sign In</Button>
       </form>
      </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage"
          src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjtjBw4xwF01ZdKL1cmnYZD3vdavlQPOWA7w&usqp=CAU"  
          alt=""
        />
        {user ?
       (
         <Button onClick = {() => auth.signOut() } >Logout</Button>
         )
       :(
         <div className = "app__loginContainer">
         <Button onClick = {() => {setOpenSignIn(true)}} >Sign In</Button>
         <Button onClick = {() => {setOpen(true)}} >Sign Up</Button>
         </div>
         
         )}
      </div>
      <div className = "app__posts">
      <div className = "app__postLeft">
      {
        posts.map(({id,post})=>(
          <Post key = {id}
                postId = {id}
                user = {user}
                username = {post.username}
                caption = {post.caption}
                imageUrl = {post.imageUrl}
          />
        ))
      }
      </div>
      <div className = "app__postRight">
        
      </div>
      
    
      </div>
        
      {user?.displayName ? (
      <ImageUpload username = {user.displayName}/>
    ):(
      <h3>You need to Login to upload</h3>
    )}
    </div>
  );
}

export default App;
