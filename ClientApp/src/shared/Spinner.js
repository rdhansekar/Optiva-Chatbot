import React, { Component } from 'react'
import {showLoadingIndicator} from '../service/httputlity';

export class Spinner extends Component {
  render() {
    return (
      <div className={`${showLoadingIndicator ? "":"hide"}`}>
        <div className="spinner-wrapper">
          <div className="donut"></div>
        </div>
      </div>
    )
  }
}

export default Spinner
