import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from '../Components/Dashboard';
import write from '../styles/write.module.css'
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect, useRef } from 'react';
import Cookies from "js-cookie";

export default function WriteReview(){
    const [loggedIn,setLoggedIn] = useState(true && Cookies.get("token"))
    const [updatedUser,setUpdatedUser] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState();
  const [travelDate, setTravelDate] = useState();
  const [confirmAlert, setConfirmAlert] = useState('');
  const titleInputRef = useRef();
  const descInputRef = useRef();
  const countryInputRef = useRef();
  const cityInputRef = useRef();
  const hotelInputRef = useRef();
  
  // check if logged in and redirect to login page if so
  useEffect(() => {
        if(!loggedIn){
            window.location.href = "/"
        } else {
            getUser();
            setIsLoading(false);
        }
    },[]);

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

    async function newReview(title,img,desc,rt,country,city,hotel,date) {
        const token = Cookies.get("token")
        const rating = parseInt(rt)
        const resp0 = await fetch('http://jsbhumra.pythonanywhere.com/review?desc='+desc,{
            method: 'POST'
        })
        const descData = await resp0.json();
        var score = descData.score;
        var mult="";
        if(descData.sentiment=='Positive'){
            mult="";
        } else {
            mult="- ";
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/addreview`, {
          method: 'POST',
          body: JSON.stringify({ title, img, desc, rating, country, city, hotel, date, score, mult }),
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
        });
      
        const data = await response.json();
        console.log(data)
      
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong!');
        }
      
        return data;
      }

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
        //setImageSrc(onLoadEvent.target.result);
        //setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
}

  if (isLoading) {
      return <p>Loading...</p>;
  }

  const onOptionChange = e => {
    setRating(e.target.value)
  }
  const onDateChange = e => {
    setTravelDate(e.target.value)
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

    const formData = new FormData();

    for ( const file of fileInput.files ) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'reviewPics');

    const data = await fetch('https://api.cloudinary.com/v1_1/dkslaee8q/image/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    //setImageSrc(data.secure_url);
    //setUploadData(data);
    const revTitle = titleInputRef.current.value;
    const revDesc = descInputRef.current.value;
    const revCountry = countryInputRef.current.value;
    const revCity = cityInputRef.current.value;
    const revHotel = hotelInputRef.current.value;
    const revDate = travelDate;
    const revRat = rating;

    try {
        console.log(data)
        const result = await newReview(revTitle,data.secure_url,revDesc,revRat,revCountry,revCity,revHotel,revDate);
        setConfirmAlert('Submitted successfully!');
        console.log('success');
        window.location.href = '/myreviews'
      } catch (error) {
        console.log(error)
      }
  }


    return(
        <>
            <Dashboard profileImg={updatedUser?.profilePic}></Dashboard>
            <h1 className={write.heading}>Write Review</h1>
            <form method='post' className={write.form} onSubmit={handleOnSubmit}>
          
                {/* TITLE */}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="title" placeholder="johnwick" required ref={titleInputRef}/>
                    <label>Title</label>
                  </div>
                <div className="form-floating mb-3">
                    <TextareaAutosize type="text" className="form-control" id="desc" placeholder="johnwick" required ref={descInputRef}/>
                    <label>Description</label>
                  </div>                
                
                {/* DOB  */}
                <div className="form-floating mb-3">
                    <input type="date" className="form-control" id="bdate" placeholder="date" required onChange={onDateChange}/>
                    <label htmlFor="bdate">Date of Travel</label>
                </div>
                {/* {travelDate} */}
                {/* COUNTRY */}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="Title" placeholder="johnwick" required ref={countryInputRef}/>
                    <label>Country</label>
                  </div>
                {/* CITY */}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="Title" placeholder="johnwick" required ref={cityInputRef}/>
                    <label>City</label>
                  </div>
                {/* HOTEL */}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="Title" placeholder="johnwick" required ref={hotelInputRef}/>
                    <label>Hotel</label>
                  </div>
                 
                <label className='col-md-2 my-2 me-2'>Rating</label>
                <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" checked={rating === "1"} onChange={onOptionChange}/>
                <label className="form-check-label" for="inlineRadio1">1</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" checked={rating === "2"} onChange={onOptionChange}/>
                <label className="form-check-label" for="inlineRadio2">2</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="3" checked={rating === "3"} onChange={onOptionChange}/>
                <label className="form-check-label" for="inlineRadio3">3</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="4" checked={rating === "4"} onChange={onOptionChange}/>
                <label className="form-check-label" for="inlineRadio4">4</label>
                </div>
                <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="5" checked={rating === "5"} onChange={onOptionChange}/>
                <label className="form-check-label" for="inlineRadio5">5</label>
                </div>
                {/* <p>{rating}</p> */}<br/>
                <label for="file" className="form-label mt-3">Upload an image file for the review <i>(a placeholder image will be used if nothing uploaded!)</i></label>
                <input className="form-control" type="file" id="file" name='file' onChange={handleOnChange}/>
               
                
                <br/>
                <div style={{textAlign: 'center'}}>          
							<input className="btn btn-outline-success" type="submit" value="Submit" />
              <p className='text-success'>{confirmAlert}</p>
						</div>
            </form>
        
        </>
         
    );

}
