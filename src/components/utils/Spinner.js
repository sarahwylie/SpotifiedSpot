import React from "react";

const Spinner = (props) => {
    return (
      <div
        className="spinner-grow text-info mt-5"
        style={{ height: ({ h }) => h, width: ({ w }) => w }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };
  
  export default Spinner;