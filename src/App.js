import './App.css';
import {useState, useEffect} from 'react';
import React from 'react'

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MenuIcon from '@material-ui/icons/Menu';

function App() {

  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipeList, setRecipeList] = useState();
  const [ingredientsAdd, setIngredientAdd] = useState();
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [dimensions, SetDimensions] = useState({
    width: window.innerWidth,
    height:window.innerHeight
  })

  const [count,setCount] = useState(0);

  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
  
  const BASE = 'https://api.spoonacular.com/recipes/findByIngredients?';
  const TOTAL = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=65a19a69d8774ac59ba73e8a628a3c49&ingredients=apples,+flour,+sugar&number=2';
  const itens = 'apples,flour, sugar';

  const fetchData = async(recipeSearch)=>{
    const response = await fetch(`${BASE}apiKey=${API_KEY}&ingredients=${recipeSearch}&number=10`);
    const recipes = await response.json();
    return setRecipeList(recipes);
  }

  const searchBoxStyle = {
    width:'70%',
    marginLeft:'5%'
  } 

  const addButtonStyle={
    backgroundColor: '#2910d0',
    color:'white'
  }

  const searchButtonStyle = {
    backgroundColor:'#2910d0',
    color:'white',
    fontSize:13,
    textTransform: 'none'
  }

  const handleSearch = ()=>{

    const teste = ingredientsList.map((val)=>(
      val.ingredient
    )).join(',');
  
    fetchData(teste);

  }


  const handleAddIngredients = ()=>{ 
    if(ingredientsAdd !== null && ingredientsAdd !== '' && !/^\s*$/.test(ingredientsAdd))
    {
      setCount(i => i+1);
      setIngredientsList([...ingredientsList, {'id':{count},'ingredient': ingredientsAdd}]);
      setIngredientAdd('')
    }
  }

  const ingredientInput = (e)=>{
    let target = e.target.value;
    setIngredientAdd(target)
  }

  const handleRemoveIngredient = (id)=>{
    const newList = ingredientsList.filter((val)=> val.id !==id)
    setIngredientsList(newList)
  }

  const handleKeyPress = (e)=>{
    if(e.key === 'Enter'){
      handleAddIngredients();
    }
  }


  useEffect(() => {
    function handleResize() {
      SetDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })}
      window.addEventListener('resize', handleResize)
      return _ => {
        window.removeEventListener('resize', handleResize)}
})

function toggleSwipeDrawer(){
  setMobileDrawer(!mobileDrawer)
}


  return (

    <div className="App">
        <div className="menu-wrap">
          <div className="title">
            <p>Recipe List</p>
          </div>
          <div className="ingredients-list">
            {ingredientsList.map((val)=>(
              <li>
                <span>{val.ingredient}</span>
                <iconButton onClick={()=>handleRemoveIngredient(val.id)}><ClearIcon/></iconButton>
              </li>
            ))}
          </div>
          <div className="add-ingredients-wrap">
            <TextField size="small" style={searchBoxStyle} variant="outlined" inputProps={{style:{fontSize:15}}} onChange={ingredientInput} onKeyPress={handleKeyPress} value={ingredientsAdd}></TextField>
            <IconButton size="small" style={addButtonStyle} onClick={handleAddIngredients}><AddIcon/></IconButton>
          </div>
          <div className="search-wrap">
            <Button onClick={handleSearch} style={searchButtonStyle} startIcon={<SearchIcon/>}>Search</Button>
          </div>
        </div>
      
      <div className="recipes-list-wrap">

      {dimensions.width <= 450 || dimensions.height <=740? 
      <div className="menu-mobile">
        <div className="menu-mobile-button">
          <Button onClick={toggleSwipeDrawer}><MenuIcon/></Button>
        </div>
        <div className="menu-mobile-title">
          Recipe List
        </div>
        <SwipeableDrawer anchor='bottom' open={mobileDrawer} onClose={toggleSwipeDrawer}>
        <div className="ingredients-list">
            {ingredientsList.map((val)=>(
              <li>
                <span>{val.ingredient}</span>
                <iconButton onClick={()=>handleRemoveIngredient(val.id)}><ClearIcon/></iconButton>
              </li>
            ))}
          </div>
          <div className="add-ingredients-wrap">
            <TextField size="small" style={searchBoxStyle} variant="outlined" inputProps={{style:{fontSize:15}}} onChange={ingredientInput} onKeyPress={handleKeyPress} value={ingredientsAdd}></TextField>
            <IconButton size="small" style={addButtonStyle} onClick={handleAddIngredients}><AddIcon/></IconButton>
          </div>
          <div className="search-wrap">
            <Button onClick={handleSearch} style={searchButtonStyle} startIcon={<SearchIcon/>}>Search</Button>
          </div>
        </SwipeableDrawer>
      </div>: false}
      


        {recipeList && recipeList.map((recipeList)=>(
         <div className="recipe-item">
           <div className="recipe-item-title">
            {recipeList.title}
           </div>
           <div className="recipe-item-content">
             <div className="recipe-item-content-image">
               <img src={recipeList.image}></img>
             </div>
            <div className="recipe-item-content-used-ingredients">
              <p>Used Ingredients: {recipeList.usedIngredientCount}</p>
              <div className="used-ingredients-list">
               {recipeList.usedIngredients.map((used)=>(
                <li>
                  {used.originalString}
                </li>
               ))}
              </div>
            </div>
            <div className="recipe-item-content-missed-ingredients">
              <p>Missed Ingredients: {recipeList.missedIngredientCount}</p>
              <div className="missed-ingredients-list">
                {recipeList.missedIngredients.map((missed)=>(
                  <li>
                    {missed.originalString}
                  </li>
                ))}
              </div>
            </div>
          </div>
          <div className="recipe-likes">
            <p>Likes: {recipeList.likes}</p>       
          </div>
          <div className="recipe-divider"><hr></hr></div>
          </div>
          
        ))}
        
        

      </div>
      
    </div>
  );
}

export default App;
