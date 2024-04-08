import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import view from './CSS/view.module.css';
import LinesEllipsis from 'react-lines-ellipsis'
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

async function toggleLike(id) {
  const token = Cookies.get("token")
  const response = await fetch('http://localhost:3000/api/reviews/likeunlike', {
    method: 'POST',
    body: JSON.stringify({ id }),
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

export default function VReview({ rid, dashImg, title, desc, rating, eagleScore, country, city, upvotes, upvoted, createdAt })
{   
  const [disableState, setDisableState] = useState(false);
  const [likeState, setLikeState] = useState(upvoted)
  const newdate = createdAt
  useEffect(() => { setLikeState(upvoted)}, [upvoted] )
  const date = new Date(createdAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
  var sentiment;
  if (eagleScore.charAt(0)=='-'){
      sentiment = 'red';
  } else if (eagleScore.charAt(0)=='9'){
    sentiment = 'lime';
  } else {
    sentiment = 'yellow';
  }

  async function handleLikeUnlike(){
    try {
      setDisableState(true)
      const result = await toggleLike(rid);
      console.log('success');
      setDisableState(false)
      //reloadSession();
    } catch (error) {
      console.log(error)
    }
  }
  
    return(
        // <div classNameName={view.box}>
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 pb-5">
                <div className="card" style={{'maxHeight':'625px', 'minWidth':'300px'}}>
                    <img src={dashImg=="" ? "https://res.cloudinary.com/dkslaee8q/image/upload/v1681582347/samples/landscapes/nature-mountains.jpg" : dashImg} className={`card-img-top ${view.cover}`} alt="..." height={500} width={500}/>
                    <div className="card-body">
                      {/* <h5 className="card-title mb-1">{title}</h5> */}
                      <LinesEllipsis className='h5 card-title mb-1' text={title} maxLine='1' ellipsis='...' trimRight basedOn='letters' />
                      {/* <p className="card-subtitle text-muted mb-2"><b>Reviewer:</b>  @{reviewer}</p> */}
                      <LinesEllipsis className='card-text' text={desc} maxLine='2' ellipsis='...' trimRight basedOn='letters' />
                      {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item"><b>Rating:</b> {rating}{/*<i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star"></i> <i className="bi bi-star"></i>*/}
                      <span style={{'float':'right'}}><b>EagleScore:</b> <span style={{'padding':'3px','borderRadius':'10px','backgroundColor': `${sentiment}`}}> {eagleScore} </span></span>
                      </li>
                      <li className="list-group-item"><b>Country:</b> {country} <span style={{'float':'right'}}><b>City:</b> {city}</span></li>
                      <li className="list-group-item">
                        <a href={`/review/${rid}`} className="card-link btn btn-primary">Read Full Review</a>
                        {/* {console.log(likeState,upvoted)} */}
                        {upvoted?(likeState?<button onClick={()=>{handleLikeUnlike();setLikeState(!likeState);}} className="card-link btn btn-success mb-n1" style={{'float':'right'}} disabled={disableState}><span>{upvotes}</span>&nbsp;&nbsp;<i className="bi bi-hand-thumbs-up-fill"></i></button>:<button onClick={()=>{handleLikeUnlike();setLikeState(!likeState);}} className="card-link btn btn-outline-success mb-n1" style={{'float':'right'}} disabled={disableState}><span>{upvotes-1}</span>&nbsp;&nbsp;<i className="bi bi-hand-thumbs-up"></i></button>):(likeState?<button onClick={()=>{handleLikeUnlike();setLikeState(!likeState);}} className="card-link btn btn-success mb-n1" style={{'float':'right'}} disabled={disableState}><span>{upvotes+1}</span>&nbsp;&nbsp;<i className="bi bi-hand-thumbs-up-fill"></i></button>:<button onClick={()=>{handleLikeUnlike();setLikeState(!likeState);}} className="card-link btn btn-outline-success mb-n1" style={{'float':'right'}} disabled={disableState}><span>{upvotes}</span>&nbsp;&nbsp;<i className="bi bi-hand-thumbs-up"></i></button>)}
                      </li>
                    </ul>
                    <div className="card-footer" height={10}>
                        <p className='m-0 p-0'>Posted on: {date}</p>
                    </div>
                </div>
            </div>
    );
}