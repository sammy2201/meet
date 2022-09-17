

function joinmeet() {
  var code = document.getElementById("code-value").value;
  var meetUrl = window.location.origin+"/"+code;
  window.open(meetUrl, '_blank').focus();
}


function newmeet() {
  var code= Math.floor(Math.random()*10000000)+"-"+Math.floor(Math.random()*10000000);
  var meetUrl = window.location.origin+"/"+code;
  window.open(meetUrl, '_blank').focus();
}
