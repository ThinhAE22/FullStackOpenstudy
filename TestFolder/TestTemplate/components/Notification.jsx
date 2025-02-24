import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

// Define PropTypes
Notification.propTypes = {
  message: PropTypes.string, // message is a string but not required (can be null)
};

export default Notification;
