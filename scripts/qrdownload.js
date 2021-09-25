
const qrDiv = document.querySelector('.qr-download')

window.addEventListener('load', e => {
    const para = window.location.href.split("=")[1]

    qrDiv.innerHTML = `
    <img src=
    "https://chart.googleapis.com/chart?cht=qr&chl=${para}&chs=160x160&chld=L|0\"
            class="qr-code img-thumbnail img-responsive" />
    
      <a href="https://chart.googleapis.com/chart?cht=qr&chl=${para}&chs=500x500&chld=L|0\.png" target="_blank" download>
          <button class="btn1" >Download</button> 
      </a>
    
    
    `
    
})