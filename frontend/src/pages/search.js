import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from '../Components/Dashboard';
import main from '../styles/main.module.css';
import { useState, useEffect, useRef } from 'react';
import VReview from '../Components/View_Review';
import Cookies from "js-cookie";

// export async function getServerSideProps(context) {
//     dbConnect();
//     let sess = await getSession(context);
//     let reviews = await Review.find().populate('userId')
//     let user = await User.find({ _id: sess?.user?._id })
//     //   return data;
//     return {
//         props: {reviews: JSON.parse(JSON.stringify(reviews)), updatedUser: JSON.parse(JSON.stringify(user))}
//     }
// }

export default function Search(){
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('')
    const [sortFilter, setSortFilter] = useState('createdAt')
    const [loggedIn,setLoggedIn] = useState(true && Cookies.get("token"))
    const [newId,setNewId] = useState()
    const [updatedUser,setUpdatedUser] = useState()
    const [reviews,setReviews] = useState([])
    const searchRef = useRef();
    // check if logged in and redirect to login page if so
    useEffect(() => {
        if(!loggedIn){
            window.location.href = "/"
        } else {
            getUser();
            getReviews();
            setIsLoading(false);
        }
    },[]);

    async function getReviews(){
        const token = Cookies.get("token")
        const response = await fetch('http://localhost:3000/api/reviews/getreviews', {
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
        //   return data;
    }

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

    if (isLoading) {
        return <p>Loading...</p>;
    }

    function handleOnChange(){
        setSearchQuery(searchRef.current.value.toLowerCase());
    }
    const handleDropdown = (e) => {
        setSortFilter(e.target.value);
    };


    const filteredReviews = reviews.filter((rev) => {
        return (
            rev.title.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`)) || rev.desc.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`)) || rev.city.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`)) || rev.country.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`)) || rev.hotel.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`))
            // || rev.userId.username.toLowerCase().split('/').some((part) => part.includes(`${searchQuery}`)) 
        )
      });

    console.log(updatedUser)

    return(
        <>
            <Dashboard profileImg={updatedUser?.profilePic}/>
            <h1 className={main.heading}>All Reviews:</h1>
            <div className={main.main1}>
            <div className='form mb-5' style={{'width':'80vw'}}>
                {/* <label for="search" className="form-label">Search:</label> */}
                <input className="form-control" type="text" id="search" name='search' ref={searchRef} onChange={handleOnChange} placeholder='Search through thousands of reviews...'/><br />
                <div style={{transform:'translateX(0vw)', textAlign: 'center'}}>Sort according to: <select value={sortFilter} onChange={handleDropdown}>
                    <option value='createdAt'>Review Date</option>
                    <option value='rating'>Rating</option>
                    <option value='eagleScore'>eagleScore</option>
                    <option value='upvotes'>upvotes</option>
                </select>
                </div>
            </div>
            <div className="row">
            {(sortFilter=='createdAt')?
            (filteredReviews.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1).map((review) => {
                return(
                <VReview key={review._id} rid={review._id} dashImg={review.dashImg} title={review.title} desc={review.desc} rating={review.rating} eagleScore={review.eagleScore} country={review.country} city={review.city} upvotes={review.upvotes.length} upvoted={review.upvotes.includes(newId)} createdAt={review.createdAt} />
            )})):(sortFilter=='rating')?
            (filteredReviews.sort((a, b) => a.rating < b.rating ? 1 : -1).map((review) => {
                return(
                <VReview key={review._id} rid={review._id} dashImg={review.dashImg} title={review.title} desc={review.desc} rating={review.rating} eagleScore={review.eagleScore} country={review.country} city={review.city} upvotes={review.upvotes.length} upvoted={review.upvotes.includes(newId)} createdAt={review.createdAt} />
            )})):(sortFilter=='eagleScore')?
            (filteredReviews.sort((a, b) => a.eagleScore < b.eagleScore ? 1 : -1).map((review) => {
                return(
                <VReview key={review._id} rid={review._id} dashImg={review.dashImg} title={review.title} desc={review.desc} rating={review.rating} eagleScore={review.eagleScore} country={review.country} city={review.city} upvotes={review.upvotes.length} upvoted={review.upvotes.includes(newId)} createdAt={review.createdAt} />
            )})):
            (filteredReviews.sort((a, b) => a.upvotes.length < b.upvotes.length ? 1 : -1).map((review) => {
                return(
                <VReview key={review._id} rid={review._id} dashImg={review.dashImg} title={review.title} desc={review.desc} rating={review.rating} eagleScore={review.eagleScore} country={review.country} city={review.city} upvotes={review.upvotes.length} upvoted={review.upvotes.includes(newId)} createdAt={review.createdAt} />
            )}))}
                </div>
            </div>
        </>
        
    );

}
