import React from 'react'
import spinnerImage from './spinnerImage.gif';

const Spinner = () => {
  return (
    <div>
      <img src={spinnerImage} alt="Loading" style={{ width: '200px', margin: 'auto', display: 'block' }}/>
    </div>
  )
}

export default Spinner;
