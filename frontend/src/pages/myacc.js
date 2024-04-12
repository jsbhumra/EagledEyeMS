import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from '../Components/Dashboard';
import main from '../styles/main.module.css'
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function MyAcc(){
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [loggedIn,setLoggedIn] = useState(true && Cookies.get("token"))
    const [updatedUser,setUpdatedUser] = useState()
    const [reviewNum,setReviewNum] = useState(0)
    const [upvotes,setUpvotes] = useState(0)
    // check if logged in and redirect to login page if so
    useEffect(() => {
        if(!loggedIn){
            window.location.href = "/"
        } else {
            getUser();
            getData()
            setIsLoading(false);
        }
    },[]);

    async function updateProfile(img) {
        const token = Cookies.get("token")
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/update`, {
          method: 'POST',
          body: JSON.stringify({ img }),
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
        });
      
        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong!');
        }
      
        return data;
      }

    async function getData(){
        const token = Cookies.get("token")
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/getmyreviews`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
          });

          const data = await response.json();
        
          if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
          }
          setReviewNum(data.length)
            let theseUpvotes = 0;
            for (let i = 0; i < data.length; i++){
                theseUpvotes += data[i].upvotes.length
            }
            setUpvotes(theseUpvotes)
        //   return data;
    }

    async function getUser(){
        const token = Cookies.get("token")
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
          });
        
          const data = await response.json();
        
          if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
          }
        console.log(data)
        
        setUpdatedUser(data)
    }


    function handleOnChange(changeEvent) {
        const reader = new FileReader();

        reader.onload = function(onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
            setUploadData(undefined);
        }

        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    async function signOut(){
        Cookies.remove("token")
        window.location.href = '/'
    }

    async function handleOnSubmit(event) {
        event.preventDefault();
    
        const form = event.currentTarget;
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    
        const formData = new FormData();
    
        for ( const file of fileInput.files ) {
          formData.append('file', file);
        }
    
        formData.append('upload_preset', 'profilePics');
    
        const data = await fetch('https://api.cloudinary.com/v1_1/dkslaee8q/image/upload', {
          method: 'POST',
          body: formData
        }).then(r => r.json());

        setImageSrc(data.secure_url);
        setUploadData(data);


        try {
            // console.log(data)
            const result = await updateProfile(data.secure_url);
            console.log("success");
            // reloadSession();
          } catch (error) {
            console.log("error")
          }
      }
    
    if (isLoading) {
        return <p>Loading...</p>;
    }

    return(
        <>
        <Dashboard profileImg={updatedUser?.profilePic}/>
            <div className={main.main}>
            <img className={main.dp} src={updatedUser?.profilePic} alt='Profile Image' width={500} height={500} style={{borderRadius:'50%'}}/>
                {/* USER NAME & USERNAME -- BACKEND CONNECTION */}
                <br/>
                <br/>
                <div className={main.details}>
                    {updatedUser?.fname}
                    <br/>
                    @{updatedUser?.username}
                    <br/>
                    Reviews: {reviewNum}
                    <br />
                    Total Review Likes: {upvotes}
                    <br />
                    <button onClick={() => signOut()} className={main.sout}>Sign Out</button>
                </div>
                <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit} className={main.form}>
                <label className="form-label">Change your profile Pic:</label>
                <input className="form-control" type="file" id="file" name='file' />
                {imageSrc && !uploadData && (
                    <p>
                    <button>Upload Files</button>
                    </p>
                )}

                {uploadData && (
                    <p className='text-success'>Profile picture changed successfully!<br/>Please refresh to view changes.</p>
                )}
                </form>
            </div>
        </>

    );
    }

