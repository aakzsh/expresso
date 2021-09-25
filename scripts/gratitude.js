

const containerDiv = document.getElementById('container')


window.addEventListener('load', () => {
    const fb =  firebase.initializeApp(firebaseConfig);


const db = fb.firestore()
    const param = window.location.href.split("=")[1];
    
    const docref = db.collection('profile').doc(param)

    docref.get().then(doc => {
        const {name, bio, specialization, phone, gpay, paypal} = doc.data();
        console.log('success')
        containerDiv.innerHTML = `
        <br><br>
        <center> <div style="background-color: white; height: 12rem; width: 12rem; border-radius: 30rem;"><img class="pfp" src="../assets/pfp.jpg" /></div></center>
        <br>
        <center><p style="font-size: 4rem; color: white;">${name}</p></center>
        <br>
        <center> <div style="background-color:  rgba(83, 54, 157, 1);
            ; height: 3rem; width: 25rem; border-radius: 20px;"><center><p style="color: white; padding-top: 0.5rem;">${specialization}</p></center></div></center>
          <br><br>
          <center> <div style="
            height: 3rem; width: 25rem; border-radius: 20px;"><center><p style="color: white; padding-top: 0.5rem;">${bio}</p></center></div></center>
          <center><img src="../assets/down.svg" alt="" style="margin-top: 10rem;"></center>

          <center><h2 style="margin-top: 8rem; color: rgb(233, 223, 223); padding-top: 0.5rem;">Express Your Gratitude</h2></center>
        <br><br>
        
            
            
        <br> <br> <br> <br> <br>
          <h5 style="font-size: large;">Send a Personalised Thank You Note</h5> 
     
        <br>
        <center><form >
            <div class="form-group">
                <label for="message"></label>
                <input placeholder="Type your message" style="width: 80%; max-width: 500px; color: white; height: 20rem; background-color: rgba(37, 39, 82, 1);
            " type="text" class="form-control" id="message" aria-describedby="emailHelp" >
            </div>
        </form></center>
            <br><br>
            <button class="btn1" style="border-radius: 20px; height: 4rem;">Send</button>
           
        <br><br>

        <h5 style="color: white; font-size: large;">Support My Venture</h5>
        <br>
           
            <br><br>
            
            <button class="btn1" style="border-radius: 1px; height: 4rem; width: 24rem;" onclick="window.alert('paypal email:${paypal}')">Paypal</button>
            <br><br>
            <div id="containerr"></div>
        
        
        
        `


        const baseRequest = {
              apiVersion: 2,
              apiVersionMinor: 0
            };
            const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
            
            const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
            
            const tokenizationSpecification = {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                'gateway': 'example',
                'gatewayMerchantId': 'exampleGatewayMerchantId'
              }
            };
            
            /**
             * Describe your site's support for the CARD payment method and its required
             * fields
             *
             * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
             */
            const baseCardPaymentMethod = {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: allowedCardAuthMethods,
                allowedCardNetworks: allowedCardNetworks
              }
            };
            
            const cardPaymentMethod = Object.assign(
              {},
              baseCardPaymentMethod,
              {
                tokenizationSpecification: tokenizationSpecification
              }
            );
            
            let paymentsClient = null;
            
            
            function getGoogleIsReadyToPayRequest() {
              return Object.assign(
                  {},
                  baseRequest,
                  {
                    allowedPaymentMethods: [baseCardPaymentMethod]
                  }
              );
            }
            function getGooglePaymentDataRequest() {
              const paymentDataRequest = Object.assign({}, baseRequest);
              paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
              paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
              paymentDataRequest.merchantInfo = {
                // @todo a merchant ID is available for a production environment after approval by Google
                // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
                // merchantId: '01234567890123456789',
                merchantName: name
              };
            
              paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
            
              return paymentDataRequest;
            }
            
            /**
             * Return an active PaymentsClient or initialize
             *
             * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
             * @returns {google.payments.api.PaymentsClient} Google Pay API client
             */
            function getGooglePaymentsClient() {
              if ( paymentsClient === null ) {
                paymentsClient = new google.payments.api.PaymentsClient({
                    environment: 'TEST',
                  paymentDataCallbacks: {
                    onPaymentAuthorized: onPaymentAuthorized
                  }
                });
              }
              return paymentsClient;
            }
            
            /**
             * Handles authorize payments callback intents.
             *
             * @param {object} paymentData response from Google Pay API after a payer approves payment through user gesture.
             * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData object reference}
             *
             * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentAuthorizationResult}
             * @returns Promise<{object}> Promise of PaymentAuthorizationResult object to acknowledge the payment authorization status.
             */
            function onPaymentAuthorized(paymentData) {
              return new Promise(function(resolve, reject){
                // handle the response
                processPayment(paymentData)
                  .then(function() {
                    resolve({transactionState: 'SUCCESS'});
                  })
                  .catch(function() {
                    resolve({
                      transactionState: 'ERROR',
                      error: {
                        intent: 'PAYMENT_AUTHORIZATION',
                        message: 'Insufficient funds, try again. Next attempt should work.',
                        reason: 'PAYMENT_DATA_INVALID'
                      }
                    });
                  });
              });
            }
            
            /**
             * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
             *
             * Display a Google Pay payment button after confirmation of the viewer's
             * ability to pay.
             */
            function onGooglePayLoaded() {
              const paymentsClient = getGooglePaymentsClient();
              paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
                .then(function(response) {
                  if (response.result) {
                    addGooglePayButton();
                  }
                })
                .catch(function(err) {
                  // show error in developer console for debugging
                  console.error(err);
                });
            }
            
            /**
             * Add a Google Pay purchase button alongside an existing checkout button
             *
             * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
             * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
             */
            function addGooglePayButton() {
              const paymentsClient = getGooglePaymentsClient();
              const button =
                  paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
              document.getElementById('containerr').appendChild(button);
            }
            
            /**
             * Provide Google Pay API with a payment amount, currency, and amount status
             *
             * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
             * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
             */
            function getGoogleTransactionInfo() {
              return {
                    displayItems: [
                    {
                      label: "Subtotal",
                      type: "SUBTOTAL",
                      price: "11.00",
                    },
                  {
                      label: "Tax",
                      type: "TAX",
                      price: "1.00",
                    }
                ],
                countryCode: 'US',
                currencyCode: "USD",
                totalPriceStatus: "FINAL",
                totalPrice: "10.00",
                totalPriceLabel: "Total"
              };
            }
            
            
            /**
             * Show Google Pay payment sheet when Google Pay payment button is clicked
             */
            function onGooglePaymentButtonClicked() {
              const paymentDataRequest = getGooglePaymentDataRequest();
              paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
            
              const paymentsClient = getGooglePaymentsClient();
              paymentsClient.loadPaymentData(paymentDataRequest);
            }
            
            let attempts = 0;
            function processPayment(paymentData) {
              return new Promise(function(resolve, reject) {
                setTimeout(function() {
                  // @todo pass payment token to your gateway to process payment
                  paymentToken = paymentData.paymentMethodData.tokenizationData.token;
            
                  if (attempts++ % 2 == 0) {
                    reject(new Error('Every other attempt fails, next one should succeed'));      
                  } else {
                    resolve({});      
                  }
                }, 500);
              });
            }
    })
    .catch(err => {
        console.log(err)
    })

})