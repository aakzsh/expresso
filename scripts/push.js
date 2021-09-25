const fb =  firebase.initializeApp(firebaseConfig);
const nameInput = document.getElementById('name');
const bioInput = document.getElementById('bio');
const specializationInput = document.getElementById('specialization');
const phoneInput = document.getElementById('phone');
const gpayInput = document.getElementById('gpay');
const paypalInput = document.getElementById('paypal');
const submitBtn = document.querySelector('.submit-btn');

const db = fb.firestore()
fb.auth().onAuthStateChanged(function(user) {
    
    // console.log(nameInput)
    submitBtn.addEventListener('click', e => {
        const u = user.email;
    const name = nameInput.value;
    const bio = bioInput.value;
    const specialization = specializationInput.value;
    const phone = phoneInput.value;
    const gpay = gpayInput.value;
    const paypal = paypalInput.value;
        e.preventDefault();

        const data = {
            name : name,
            bio : bio,
            specialization: specialization,
            phone: phone,
            gpay: gpay,
            paypal: paypal
        }

        console.log(data, name)

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