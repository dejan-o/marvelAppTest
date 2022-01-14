import React from 'react'
import './Card.scss'

const Card = ( { element, onBookmarkChange, isBookmarked } ) => {
    const {thumbnail, name} = element;
    const link = thumbnail.path + '.' + thumbnail.extension;
    
    return (
        <figure className="card">
        <div className="card__img">
            <img src={link} alt="img"></img>
        </div>
        <figcaption className="card__name">{name}</figcaption>
        <button className={`card__bookmark ${isBookmarked ? 'bookmarked' : null}`} onClick={() => onBookmarkChange(isBookmarked, element)}>bookmark</button>
        </figure>
    )
}


export default Card;
