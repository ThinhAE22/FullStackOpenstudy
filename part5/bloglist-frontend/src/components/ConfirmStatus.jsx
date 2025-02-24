const CStatus = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="status">{message}</div>
}

export default CStatus
