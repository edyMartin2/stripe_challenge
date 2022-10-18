require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


/**
 * vinculamos un metodo de pago a un customer
 * @param {*} data 
 * @returns paymentMethod_atach
 */
const Attach = async (data) => {
    let paymentMethod_atach = await stripe.paymentMethods.attach(
        data.paymentMethodId,
        {
            customer: data.customerId
        }
    );
    return paymentMethod_atach;
}

const Create = async (data) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'mxn',
        payment_method_types: ['card'],
        customer: data.customerId,
        payment_method: data.paymentMethodId
    });
    return paymentIntent;
}

const Confirm = async (data) => {
    const paymentIntent = await stripe.paymentIntents.confirm(
        data.paymentIntent,
        { payment_method: data.paymentMethodId }
    );
    return paymentIntent
}

const PaymentIntent = async (data) => {
    var response = { error: [], data: { attach: [], create: [], confirm: [] }, success: 100 }
    console.log(data.error == 100, 'error')

    if (data.error == 100) {
        data.customerId = data.customerId[0] ? data.customerId[0].id : data.customerId.id;
        let attach_response = await Attach(data).then(res => { return res }).catch(e => { return [] })
        let create_response = await Create(data).then(res => { return res }).catch(e => { return [] })
        console.log("entro nivel 1")
        if (attach_response !== [] && create_response !== []) {
            response.data.attach = attach_response;
            response.data.create = create_response;
            data.paymentIntent = create_response.id;
            let confirm_response = await Confirm(data).then(res => { return res }).catch(e => { return [] })
            console.log("entro nivel 2")
            if (confirm_response !== []) {
                response.data.confirm = confirm_response;
                response.error = [];
                response.success = 200;
                console.log("entro nivel 3", response)
            }
        } else {
            console.log("entro nivel 4")
            response.error = "Algun campo esta mal"
        }
       
    }
    return response
}

module.exports = {
    PaymentIntent
}
