import React, {useState} from 'react';
import {Button} from '@material-ui/core';
import firebase from 'firebase/app';
import {storage, db} from '../Firebase';

export default function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on("state_changed", (snapshot) => {
            //progress logic
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, (error) => {
            console.log(error);
        }, () => {
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                //post image inside db
                db.collection("posts").add({
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    image: url,
                    username: username
                });
                setProgress(0);
                setImage(null);
                setCaption("");
            })
        })
    }

    return (
        <div className="image-upload">
            <progress value={progress} max="100" />
            <input className="caption-input" type="text" placeholder="Enter your caption here..." onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button variant="contained" onClick={handleUpload}>Upload</Button>
        </div>
    )
}
