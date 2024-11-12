import { useState } from 'react'

const Title = ({ title_name }) => {
  return <h2>{title_name}</h2>
}

// Button component that accepts a label and onClick handler
const Button = ({ button_name, onClick }) => {
  return <button onClick={onClick}>{button_name}</button>
}

// StatisticLine component for displaying a single statistic
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

// Statistic component for displaying all statistics
const Statistic = ({ good, bad, neutral }) => {
  const all = good + bad + neutral
  const score = good * 1 + bad * -1 + neutral * 0

  if (all === 0) {
    return (
      <div>
        <h3>No feedback given</h3>
      </div>
    )
  }

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average score" value={(score / all).toFixed(2)} />
        <StatisticLine text="positive percentage" value={(good / all * 100).toFixed(1) + ' %'} />
      </table>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title title_name="give feedback" />
      <Button button_name="good" onClick={() => setGood(good + 1)} />
      <Button button_name="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button button_name="bad" onClick={() => setBad(bad + 1)} />
      <Statistic good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App
