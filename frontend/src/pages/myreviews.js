import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from '../Components/Dashboard';
import VReview from '../Components/View_Review';
import main from '../styles/main.module.css';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function MyReviews(){
    const [isLoading, setIsLoading] = useState(true);
    const [loggedIn,setLoggedIn] = useState(true && Cookies.get("token"))
    const [newId,setNewId] = useState()
    const [updatedUser,setUpdatedUser] = useState()
    const [reviews,setReviews] = useState([])
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

    async function getUser(){
        const token = Cookies.get("token")
        const response = await fetch('http://localhost:3000/api/users/me', {
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
        setNewId(data._id)
    }

    async function getData(){
        const token = Cookies.get("token")
        const response = await fetch('http://localhost:3000/api/reviews/getmyreviews', {
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

          setReviews(data)
    }


    if (isLoading) {
        return <p>Loading...</p>;
    }

    return(
        <>
            <Dashboard profileImg={updatedUser?.profilePic}/>
            <h1 className={main.heading}>My Reviews:</h1>
            <div className={main.main1}>
            <div className="row my-1">
            {reviews.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1).map((review) => {
                return(
                <VReview key={review._id} rid={review._id} dashImg={review.dashImg} title={review.title} reviewer={review.userId.username} desc={review.desc} rating={review.rating} eagleScore={review.eagleScore} country={review.country} city={review.city} upvotes={review.upvotes.length} upvoted={review.upvotes.includes(newId)} createdAt={review.createdAt} />
            )})}
                
                </div>
            </div>
        </>
        
    );

}
