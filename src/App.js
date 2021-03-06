import React, {useState, useEffect} from 'react';
import './App.css';
import logo from './images/logo.png';
import Post from './components/Post'; 

import {db, auth} from './Firebase';
import { Button, makeStyles, Modal, Input} from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import  InstagramEmbed from 'react-instagram-embed';

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
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if(user) {
        setUser(user);
        console.log(user);
        if(user.displayName) {

        } else {
          return user.updateProfile({
            displayName: username,
          });
        }

      } else {
        setUser(null);
      }
    })
    return () =>  {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signup = (event) => {
    event.preventDefault();

    //create user
    auth.createUserWithEmailAndPassword(email, password)
    .catch((error) => setError(error.message))
    
    setOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  }

  const signin = (event) => {
    event.preventDefault();

    //sign in user
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => setError(error.message))

    
    setOpenLogin(false);
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <div className="App">

      {/* sign up modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="signup-form">
            <center>
              <img className="logo" src={logo} alt="Instagram"/>
            </center>
            {error && <Button className="alert" variant="contained">{error}</Button>}
            <Input placeholder="username" type="text" value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input placeholder="email" type="text" value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input placeholder="password" type="password" value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>Sign Up</Button>
          </form>        
        </div>
      </Modal>

      {/* login modal */}

      <Modal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="signup-form">
            <center>
              <img className="logo" src={logo} alt="Instagram"/>
            </center>
            {error && <Button className="alert" variant="contained">{error}</Button>}
            <Input placeholder="email" type="text" value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input placeholder="password" type="password" value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signin} type="submit">Log In</Button>
          </form>        
        </div>
      </Modal>

      <div className="app-header">
        <img className="logo" src={logo} alt="Instagram"/>
        {
        user?
        <div className="btn-container">
          <h4>@{user.displayName}</h4>
          <Button variant="contained" onClick={() => auth.signOut()}>Log Out</Button>
        </div> :
          <div className="btn-container">
            <Button onClick={() => setOpenLogin(true)}>LogIn</Button>
            <Button variant="contained" onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        }
      </div>

      {user && <ImageUpload username={user.displayName} />}

      <div className="app-posts">
        <div className="app-posts-left">
          {
          posts.map(({id, post}) => (
            <Post user={user} key={id} postId={id} username={post.username} image={post.image} caption={post.caption} />
          ))
          }
        </div>
        <div className="app-posts-right">
          <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
        </div>
      </div>

      
      
    </div>
  );
}

export default App;
