import React from 'react'
import '../../pages/HomeSkills.css';


function card(props){
    return (
        <>
        <div>
        <figure>
            <img src={props.img} alt="Mountains"/>
            <figcaption>{props.name}</figcaption>
        </figure>
        </div>
        </>
    )

}
export default card;