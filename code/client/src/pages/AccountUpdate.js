import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/lessons.scss";
import { accountUpdate } from "../Services/account";
import UpdateCustomer from "../components/UpdateCustomer";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


//Component responsable to update user's info.
const AccountUpdate = ({ id }) => {
  const [data, setData] = useState({});
  const [customer, setCustomer] = useState({});
  const [paymentData, setPaymentData] = useState({})
  const [key, setKey] = useState('');
  //Get info to load page, User payment information, config API route in package.json "proxy"
  useEffect(() => {
    const setup = async () => {
      const result = accountUpdate(id);
      if (result !== null) {
        setData(result);
      }
    };
    setup();
  }, [id]);


  useEffect(() => {
    axios.get(`http://localhost:4242/get_account/${id}`).then(res => {
      console.log('customer data', res.data);
      setCustomer(res.data.customer);
      setPaymentData(res.data.payment_method);
    }).catch(err => {
      console.log('Intencion de pedir customer', err);
      setCustomer({})
    })

  }, [])

  useEffect(() => {
    axios.get('http://localhost:4242/get_key')
      .then(res => {
        console.log('la respuesta', res.data.app_key)
        setKey(res.data.app_key)
      })
      .catch(e => {
        console.log(e);
        setKey('error', e)
      })
  }, [])

 

  const promise = loadStripe(key);
  return (
    <main className="main-lessons">
      <Header />
      <div className="eco-items" id="account-information">
        {
          //User's info shoul be display here
        }
        <h3>Account Details</h3>
        <h4>Current Account information</h4>
        <h5>We have the following card information on file for you: </h5>
        <p>
          Billing Email:&nbsp;&nbsp;<span id="billing-email">{customer.email ? customer.email : ''}</span>
        </p>
        <p>
          Card Exp Month:&nbsp;&nbsp;<span id="card-exp-month">{paymentData.card ? paymentData.card.exp_month : ''}</span>
        </p>
        <p>
          Card Exp Year:&nbsp;&nbsp;<span id="card-exp-year">{paymentData.card ? paymentData.card.exp_year : ''}</span>
        </p>
        <p>
          Card last 4:&nbsp;&nbsp;<span id="card-last4">{paymentData.card ? paymentData.card.last4 : ''}</span>
        </p>
      </div>
      <Elements stripe={promise}>
        <UpdateCustomer />
      </Elements>
    </main>
  );
};

export default AccountUpdate;
