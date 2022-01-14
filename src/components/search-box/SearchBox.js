import React, { useState } from 'react'
import './SearchBox.scss'

export const SearchBox = ({ onChange }) => {

    const [isActive, setIsActive] = useState(false);

    return (
        <input 
            className={`search ${isActive ? 'search--active' : ''}`}
            type="search"
            placeholder="search characters"
            onChange = {onChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
        />
    );
} 

export default SearchBox;