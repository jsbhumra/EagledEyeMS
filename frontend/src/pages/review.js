import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate, useParams } from "react-router-dom";
import css from '../styles/fr.module.css'
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

// export async function getServerSideProps(context) {
//   // const router = useRouter()
//   const rid = context.query.id;
//   // console.log(rid)
//   dbConnect();
//   let review = await Review.findById(rid).populate('userId')
//   //   return data;
//   return {
//       props: {review: JSON.parse(JSON.stringify(review))}
//     // props: {review}
//     }
// }

export default function FReview()
{   
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();
  const [closeState,setCloseState] = useState('bi-x-square text-success');
  const [loggedIn,setLoggedIn] = useState(true && Cookies.get("token"))
  const [review,setReview] = useState()
  const [createDate,setCreateDate] = useState()
  const [travelDate,setTravelDate] = useState()

  useEffect(() => {
    if(!loggedIn){
        window.location.href = "/"
    } else {
        fetchData()
        setIsLoading(false);
    }
},[]);

  async function fetchData(){
    const token = Cookies.get("token")
    const response = await fetch('http://localhost:3000/api/reviews/getreview', {
        method: 'POST',
        body: JSON.stringify({id: id}),
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
      setReview(data)
      setCreateDate(new Date(data.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }))
      setTravelDate(new Date(data.traveledAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }))
  }

  if (isLoading) {
    return <p>Loading...</p>;
}

  // const newdate = createdAt

    async function onClose()
    {
    //   router.back();
      navigate(-1)
    }
  
    return(
      <>
        <div style={{position:'fixed', right:'2vw', top:'2vh' }} onClick={()=>onClose()} onMouseEnter={()=>setCloseState('bi-x-square-fill text-success')} onMouseLeave={()=>setCloseState('bi-x-square')}>
        <i className={`bi ${closeState}`} style={{fontSize:'50px'}}></i>
              </div>
              <div className={css.box}>
       
       <h1>{review?.title}</h1>
       {/* <p className={css.deets}>@ username</p> */}
       <div className={`${css.deets} mt-3`}>
         {/* <br/> */}
         <img src={review?.dashImg=="" ? "https://res.cloudinary.com/dkslaee8q/image/upload/v1681582347/samples/landscapes/nature-mountains.jpg" : review?.dashImg} alt="Img" className={css.i} width={500} height={500}></img>
         {/* <img src={dashImg} alt="Img" className={css.i}></img> */}
         {/* <br/> */}
         <br/>
         <hr style={{borderColor: '#35A24E' , opacity:'0.8'}}/>
         <br/>
         <p className="" > 
         {/* <span style={{float: 'left',marginLeft:'1vw'}}><b>Username: </b>@{review.userId.username}</span> */}
         <span style={{float: 'right',marginRight:'1vw'}}><b>Posted At: </b>{createDate}</span> </p>
         {/* <p className="mt-2" > <span style={{float: 'left',marginLeft:'2vw'}}><b>Username: </b>{reviewer}</span><span style={{float: 'right',marginRight:'2vw'}}><b>Date: </b>{date}</span> </p> */}
         <br/>
         <p className="" > <span style={{float: 'left',marginLeft:'1vw'}}><b>Rating: </b>{review?.rating}</span><span style={{float: 'right',marginRight:'1vw'}}><b>Date of Travel: </b>{travelDate}</span> </p>
         {/* <p className="mt-2" > <span style={{float: 'left',marginLeft:'2vw'}}><b>Rating: </b>{rating}</span><span style={{float: 'right',marginRight:'2vw'}}><b>EagleScore: </b> {eagleScore}</span> </p> */}
         <br/>
         <p className="" > <span style={{float: 'left',marginLeft:'1vw'}}><b>Place: </b>{review?.hotel}, {review?.city}, {review?.country}</span><span style={{float: 'right',marginRight:'1vw'}}><b>EagleScore: </b>{review?.eagleScore}</span> </p>

         {/* <p className='mt-2' style={{float: 'left',marginLeft:'2vw'}}><b>Place: </b>{Hotel}, {city}, {country}</p> */}
         {/* <p className='mt-2' style={{float: 'left',marginLeft:'1vw'}}><b>Place: </b>{review.hotel}, {review.city}, {review.country}</p> */}
         <br/>
         {/* <br/> */}
         <hr style={{borderColor: '#35A24E' , opacity:'0.8'}}/>

         <br/>
         <p>{review?.desc}</p>
       </div>
       </div>
       
      </>
      



    );
}