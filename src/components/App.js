import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'

class App extends Component {
  render() {
    return (
      <div>
        Hello World
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

// Use this function to change how the date is displayed formatted
// as the function suggests, this function converts the state of the
// app to props usable by the component... I believe this also
// connects the component to the store's state, meaning the component
// will update whenever the state changes
function mapStateToProps(calendar) {
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  return {
    calendar: dayOrder.map((day) => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal]
          ? calendar[day][meal] : null
        return meals
      }, {})
    }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
