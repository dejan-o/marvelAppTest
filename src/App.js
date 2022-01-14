import React,{ useState, useEffect } from 'react';
import './App.scss';
import { useLocalStorageState } from './utils';
import SearchBox from './components/search-box/SearchBox';
import CardList from './components/card-list/CardList';
import PaginationControled from './components/pagination/PaginationControled';
import { apiKey } from './apiKey';
import axios from 'axios';
import Spinner from './components/spinner/Spinner';
import NoResultScreen from './components/no-results-screen/NoResultScreen';


const App = () => {

  //state
  const [ bookmarked, setBookmarked ] = useLocalStorageState('marvel_characters'); 
  const [ searchField, setSearchField ] = useState('');
  const [ page, setPage ] = useState(1);
  const [ pageCount, setPageCount ] = useState(0);
  const [ characters, setCharacters ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  // fetch charactes inside useEffect
  useEffect( () => {
    let active = true;
    const name = searchField.trim();
    if(name){
        setIsLoading(true);
        const offset = (page-1)*20;
        axios({
          url: 'https://gateway.marvel.com:443/v1/public/characters',
          params: {
            apikey: apiKey,
            nameStartsWith: name,
            limit: 20,
            offset: offset,
          }
        }).
        then( response => {
            const {results, total} = response.data.data;
            if(active){
              setCharacters(results);
              setPageCount(Math.ceil((total / 20)));
              setIsLoading(false);
            }
        }
        ).catch( e => {
          setCharacters([])
          setIsLoading(false)
        })
      }
    else{
      setCharacters([]);
      setPageCount(Math.ceil((bookmarked.length / 20)));
      setIsLoading(false);
    }

    return () => {
      // set flag to false to prevent previous updating if search input changes
      active = false;
    }
      },[searchField, page]);

      

  const onSearchChange = (event) => {
    setPage(1);
    setPageCount(0);
    setSearchField(event.target.value);
  }


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const onBookmarkChange = (isBookmarked, element) => {
    if(!isBookmarked){
      setBookmarked([...bookmarked, element]);
    }
    else{
      if(bookmarked.length === 1)
        setPageCount(0);
      setBookmarked(bookmarked.filter( item => element.id !== item.id))
    }
    }
  
    const checkIsBookmarked = (element) => {
      return bookmarked.some( item => item.id === element.id);
    }
    
    const bookmarkedRender = bookmarked.slice((page-1) * 20, (page-1)*20 + 20);
    // flag for no results, if user types something that doesn't match any marvel character to show no results component
    const noResults = !!searchField.trim() && !characters.length

  return (
    <div className="app">
      {/* header and search  */}
      <header className="main-header">
        <h1 className="main-header__title">MARVEL CHARACTERS</h1>
      </header>
      <SearchBox onChange={onSearchChange} />
      
      {/* if loading show spinner */}
      {!isLoading ? (
        // if no result show no result component
        !noResults ? (
          <>
          <CardList characters={searchField ? characters : bookmarkedRender } onBookmarkChange={onBookmarkChange} isBookmarkedFunction={checkIsBookmarked}/>
          {!!pageCount &&
            <PaginationControled handleChange={handlePageChange} page={page} count={pageCount}/>
          }
          </>
          )
          :
          <NoResultScreen />
          )
        : 
        <Spinner />
      }
    </div>
  )
}

export default App;