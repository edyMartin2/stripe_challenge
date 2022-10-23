import React, { useEffect, useState } from "react";
import SignupComplete from "./SignupComplete";
import PaymenFor from './PaymentFor'
// import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import axios from 'axios';




const RegistrationForm = ({ selected, details }) => {

  // const [key, setKey] = useState('')
  const [active, setActive] = useState(false)
  const [display, setDisplay] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [card, setCard] = useState([])
  const [customer, setCustomer] = useState([])
  const [dataBack, setDataBack] = useState([])
  const [last4, setLast4] = useState('')
  const [buttondisabled, setButtondisabled] = useState(true);
  const [redirect, setRedirect] = useState(false)
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState('');
  const [emailhidden, setEmailhidden] = useState(true);

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


  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {

      let paymentId = payload.paymentMethod.id
      let card = payload.paymentMethod.card
      setLast4(card.last4)
      setCard(payload)
      cerate_customer(paymentId);

      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }


    // if (payload.error) {
    //   setError(`Payment failed ${payload.error.message}`);
    //   setProcessing(false);
    // } else {
    //   setError(null);
    //   setProcessing(false);
    //   setSucceeded(true);
    // }

  };

  const cerate_customer = (paymentId) => {
    var data = JSON.stringify({
      "email": email,
      "name": name,
      "paymentMethodId": paymentId
    });

    var config = {
      method: 'post',
      url: 'http://localhost:4242/lessons',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setCustomer(response.data.customer.data)
        setDataBack(response.data)

        let emailHidden = response.data.customer.error === 500 ? false : true;
        setEmailhidden(emailHidden)
        let paymentIntent = response.data.PaymentIntent.data;
        let status = paymentIntent ? paymentIntent.confirm ? paymentIntent.confirm.status === 'succeeded' ? true : false : false : false;
        let typeOfRedirect = paymentIntent ? paymentIntent.next_action ? paymentIntent.next_action.use_stripe_sdk.type : false : false;
        let url = typeOfRedirect === "three_d_secure_redirect" ? paymentIntent.next_action.use_stripe_sdk.stripe_js : false;
        if (emailHidden === true) {
          if (status === true && url === false && emailhidden === true) {
            setActive(true)
            setButtondisabled(true)
          } else {
            console.log('errores', status, url, emailhidden)
            setActive(false)
            setButtondisabled(false)
            setRedirect(url)
          }
        }
      })
      .catch(function (error) {
        setCustomer([])
      });

  }


  const handleChange = async (event) => {
    // if (event.complete && email !== '' && name !== '') {
    //   setButtondisabled(false)
    // }
    console.log(event)
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");

  };

  useEffect(() => {
    console.log('datos finales', dataBack, error, card, '<----------------------')
  })

  if (selected !== -1) {
    return (
      <div className={`lesson-form`}>
        <div className={`lesson-desc ${active === false ? '' : 'hidden'}`}>
          <form id="payment-form" onSubmit={handleSubmit} >
            <h3>Registration details</h3>
            <div id="summary-table" className="lesson-info">
              {details}
            </div>
            <div className="lesson-grid">
              <div className="lesson-inputs">
                <div className="lesson-input-box first">
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    autoComplete="cardholder"
                    className="sr-input"
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </div>
                <div className="lesson-input-box middle">
                  <input
                    type="text"
                    id="email"
                    value={email}
                    placeholder="Email"
                    autoComplete="cardholder"
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>
                <div className="lesson-input-box middle">
                  <div className="lesson-card-element">
                    <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="sr-field-error" id="card-errors" role="alert">
                {error}
              </div>

              <div
                className="sr-field-error"
                id="customer-exists-error"
                role="alert"
                hidden={emailhidden}
              >
                A customer with the email address of {email}
                <span id="error_msg_customer_email"></span> already exists. If
                you'd like to update the card on file, please visit
                <span id="account_link"></span>.
              </div>
            </div>
            {/* <button id="submit" disabled={buttondisabled}>
              <div className="spinner hidden" id="spinner">

              </div>
              <span id="button-text">Request Lesson</span>
            </button> */}

            <button
              disabled={processing || disabled || succeeded}
              id="submit"
            >
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Request Lesson"
                )}
              </span>
            </button>
            <div className="lesson-legal-info">
              Your card will not be charged. By registering, you hold a session
              slot which we will confirm within 24 hrs.
            </div>
          </form>
        </div>
        <SignupComplete active={active} email={email} last4={last4} customer_id={customer.id} />
      </div >
    );
  } else {
    return "";
  }
};
export default RegistrationForm;
