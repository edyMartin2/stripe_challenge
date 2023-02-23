import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const UpdateCustomer = () => {
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [buttondisabled, setButtondisabled] = useState(true)
  //estilos del card element 
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  //card element 
  const handleChange = async (event) => {
    if (event.complete == true || email !== '' && name !== '') {
      setButtondisabled(false)
    }
    console.log(event.complete)
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");

  };

  // useEffect(() => {
    // if () {
    //   setButtondisabled(false)
    // } else {
    //   setButtondisabled(true)
    // }
  // })


  return (
    <div className="lesson-form">
      <form>
        <div className="lesson-desc">
          <h3>Update your Payment details</h3>
          <div className="lesson-info">
            Fill out the form below if you'd like to us to use a new card.
          </div>
          <div className="lesson-grid">
            <div className="lesson-inputs">
              <div className="lesson-input-box">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  autoComplete="cardholder"
                  className="sr-input"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
              </div>
              <div className="lesson-input-box">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  autoComplete="cardholder"
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </div>
              <div className="lesson-input-box">
                <div className="lesson-card-element">
                  <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="sr-field-error" id="card-errors" role="alert"></div>
            <div
              className="sr-field-error"
              id="customer-exists-error"
              role="alert"
              hidden
            ></div>
          </div>
          <button id="submit" disabled={buttondisabled}>
            <div className="spinner hidden" id="spinner"></div>
            <span id="button-text">Save</span>
          </button>
          <div className="lesson-legal-info">
            Your new card will be charged when you book your next session.
          </div>
        </div>
      </form>
      <div className="sr-section hidden completed-view">
        <h3 id="signup-status">Payment Information updated </h3>
        <Link to="/lessons">
          <button>Sign up for lessons under a different email address</button>
        </Link>
      </div>
    </div>
  );
};
export default UpdateCustomer;
