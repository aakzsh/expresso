const fb =  firebase.initializeApp(firebaseConfig);
const nameInput = document.querySelector('.name');
const bioInput = document.querySelector('.bio');
const specializationInput = document.querySelector('.specialization');
const phoneInput = document.querySelector('.phone');
const gpayInput = document.querySelector('.gpay');
const paypalInput = document.querySelector('.paypal');
const submitBtn = document.querySelector('.submit-btn');

const db = fb.firestore()
fb.auth().onAuthStateChanged(function(user) {
    const u = user.email;
    const name = nameInput.value;
    const bio = bioInput.value;
    const specialization = specializationInput.value;
    const phone = phoneInput.value;
    const gpay = gpayInput.value;
    const paypal = paypalInput.value;

    submitBtn.addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name : name,
            bio : bio,
            specialization: specialization,
            phone: phone,
            gpay: gpay,
            paypal: paypal
        }

        db.collection('profile')
            .doc(u)
            .set(data)
            .then(() => {
                console.log("success")
                window.location.href = "profile.html"
            })
            .catch(err => console.error(err))

        
    })

  });



// loginBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const email = emailInput.value;
//     const bio = bioInput.value;

//     const auth = fb.auth();

    

// })