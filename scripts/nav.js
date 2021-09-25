const fb =  firebase.initializeApp(firebaseConfig);
const myProfileDiv = document.getElementById('my-profile')

const db = fb.firestore()
fb.auth().onAuthStateChanged(function(user) {
    console.log(user.uid)
   
    myProfileDiv.innerHTML = `
            <ul class="nav navbar-nav navbar-right" id="my-profile">
            <li><a href="#">Creator's Corner</a></li>
            <li><a href="gratitude.html?user=${user.uid}">My Profile</a></li>
            <li><a href="#">Logout</a></li>
        </ul>
    
    `

  });