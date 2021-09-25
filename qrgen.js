const profilemap = new Map();

function generate(){
   
    profilemap.set('name', document.getElementById('name').value);
    profilemap.set('bio', document.getElementById('bio').value);
    profilemap.set('specialisation', document.getElementById('specialisation').value);
    profilemap.set('phone', document.getElementById('phone').value);
    profilemap.set('gpay', document.getElementById('gpay').value);
    profilemap.set('paypal', document.getElementById('paypal').value);
    window.location.href='qrdownload.html';
    console.log(profilemap);
}