import React from 'react'

const Nav = ({ openIngredientsModal }) => {
  return (
    <div className='nav'>
      <h1 className='header'>UdaciMeals</h1>
      <button
        className='shopping-list'
        onClick={openIngredientsModal}>
        Shopping List
      </button>
    </div>
  )
}

export default Nav
