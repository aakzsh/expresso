const fb =  firebase.initializeApp(firebaseConfig);


const db = fb.firestore()

const containerDiv = document.getElementById('container')


window.addEventListener('load', () => {
    const param = window.location.href.split("=")[1];
    
    const docref = db.collection('profile').doc(param)

    docref.get().then(doc => {
        const {name, bio, specialization, phone, gpay, paypal} = doc.data();

        containerDiv.innerHTML = `
        <br><br>
        <center> <div style="background-color: white; height: 12rem; width: 12rem; border-radius: 30rem;"></div></center>
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
        <h5 style="color: white; font-size: large;">Support My Venture</h5>
        <br>
            <!-- <button class="btn1" style="border-radius: 10px; height: 4rem; ">Google Pay</button> -->
            <br><br>
            <script src="../scripts/gratitude.js"></script>
            <button class="btn1" style="border-radius: 1px; height: 4rem; width: 24rem;" onclick="window.alert('paypal email: ${paypal}')">Paypal</button>
            <br><br>
            <div id="containerr"></div>
            <script async
              src="https://pay.google.com/gp/p/js/pay.js"
              onload="onGooglePayLoaded()"></script>
            
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

        
        
        
        
        `
    })
    .catch(err => {
        console.log(err)
    })

})