async function sendIt(){
  var m=$("#mess").val();
  $("#mess").prop("placeholder","Sending....");
  $("#mess").val("");
  var rawResponse=await fetch('/msg', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({message:m})
  });
  $("#mess").prop("placeholder","Sent!");
  const content = await rawResponse.json();
  console.log(content);
}

function init(){
  // window.onfocus = gainedFocus;
  // window.onblur = lostFocus;
}

function getToken(url,id){
  var userid="aalteirac@tableau.com"
  var iss="9405b41c-2d22-4d30-8097-a359ac27eca3"
  var kid="e83b610c-4834-4b9a-97b9-2bf23e6d81f9"
  var secret="czncA7GATFi1zDWhJ/z+Vi6xrqLqUBTZMbPcfZJtGGY="
  var scopes = ["tableau:views:embed"];
  fetch(`https://tabconnectedapps.herokuapp.com/gimmeJWT?userid=${encodeURIComponent(userid)}&kid=${encodeURIComponent(kid)}&secret=${encodeURIComponent(secret)}&iss=${encodeURIComponent(iss)}&scp=${encodeURIComponent(scopes)}`)
  .then(response => response.json())
  .then(data => {
    if(data.error){
     alert(error);
    }
    else{
      jwt=data.token;
      let tp=`
        <tableau-viz id="tableauViz" src="${url}" 
          token="${data.token}"
          height="100%"
          width="100%"
          toolbar="Bottom" hide-tabs>
        </tableau-viz>`
        document.getElementById(id).innerHTML =tp;
        let viz = document.getElementById('tableauViz');
        viz.addEventListener("firstinteractive", (me)=>{alert(me)});
    }
  });
}