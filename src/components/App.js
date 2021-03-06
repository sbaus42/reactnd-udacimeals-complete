import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'
import { capitalize } from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import FoodList from './FoodList'
import ShoppingListModal from './ShoppingListModal'
import { fetchRecipes } from '../utils/api'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import Nav from './Nav'

class App extends Component {
  state = {
    foodModalOpen: false,
    ingredientsModalOpen: false,
    loadingFood: false,
    meal: null,
    day: null,
    food: null
  }

  openFoodModal = ({ meal, day }) => {
    this.setState(() => ({
      foodModalOpen: true,
      meal,
      day
    }))
  }

  closeFoodModal = () => {
    this.setState(() => ({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null
    }))
  }

  searchFood = (e) => {
    if (!this.input.value) {
      return
    }

    e.preventDefault()

    this.setState(() => ({ loadingFood: true }))

    fetchRecipes(this.input.value)
      .then((food) => this.setState(() => ({
        food,
        loadingFood: false
      })))
  }

  openIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: true}))
  closeIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: false}))
  generateShoppingList = () => {
    return this.props.calendar
      .reduce((result, { meals }) => {
        const { breakfast, lunch, dinner } = meals

        breakfast && result.push(breakfast)
        lunch && result.push(lunch)
        dinner && result.push(dinner)

        return result
      }, [])
    .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), [])
  }

  render() {
    const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state
    const { calendar, removeFromCalendar, addRecipe } = this.props
    const mealOrder = ['breakfast', 'lunch', 'dinner']

    return (
      <div className="container">
        <Nav
          openIngredientsModal={this.openIngredientsModal}
        />
        <ul className="meal-types">
          {mealOrder.map(mealType => (
            <li key={mealType} className="subheader">
              {capitalize(mealType)}
            </li>
          ))}
        </ul>
        <div className='calendar'>
          <div className='days'>
            {calendar.map(({ day }) =>
              <h3 key={day} className='subheader'>{capitalize(day)}</h3>
            )}
          </div>
          <div className='icon-grid'>
            {calendar.map(({ day, meals }) => (
              <ul key={day}>
                {mealOrder.map(meal => (
                  <li key={meal} className='meal'>
                    {meals[meal]
                      ? <div className='food-item'>
                          <img src={meals[meal].image} alt={meals[meal].label} />
                          <button onClick={() => removeFromCalendar({meal, day})}>Clear</button>
                        </div>
                      : <button onClick={() => this.openFoodModal({meal, day})} className='icon-btn'>
                          <CalendarIcon size={30} />
                        </button>
                    }
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={foodModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel='Modal'
        >
          <div>
            {loadingFood === true
              ? <Loading delay={200} type='spin' color='#222' className='loading' />
              : <div className='search-container'>
                  <h3 className='subheader'>
                    Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                  </h3>
                  <div className='search'>
                    <input
                      className='food-input'
                      type='text'
                      placeholder='Search Foods'
                      ref={(input) => this.input = input}
                    />
                    <button
                      className='icon-btn'
                      onClick={this.searchFood}>
                        <ArrowRightIcon size={30}/>
                    </button>
                  </div>
                  {food !== null && (
                    <FoodList
                      food={food}
                      onSelect={(recipe) => {
                        addRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                        this.closeFoodModal()
                      }}
                    />)}
                </div>}
          </div>
        </Modal>
        <ShoppingListModal
          modalStatus={ingredientsModalOpen}
          closeModal={this.closeIngredientsModal}
          generateShoppingList={this.generateShoppingList}
        />

        {/*<FoodModal
          foodModalStatus={foodModalOpen}
          closeFoodModal={this.closeModal}
        />*/}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRecipe: (data) => dispatch(addRecipe(data)),
    removeFromCalendar: (data) => dispatch(removeFromCalendar(data))
  }
}

// Use this function to change how the data is displayed, this
// function converts the state of the
// app to props usable by the component... I believe this also
// connects the component to the store's state, meaning the component
// will update whenever the state changes
function mapStateToProps({ calendar, food }) {
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  return {
    calendar: dayOrder.map((day) => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal]
          ? food[calendar[day][meal]] : null
        return meals
      }, {})
    }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
