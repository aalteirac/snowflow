async function sendIt(){
  var m=$("#mess").val();
  var rawResponse=await fetch('/msg', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({message:m})
  });
  const content = await rawResponse.json();

  console.log(content);
}

function init(){
  // window.onfocus = gainedFocus;
  // window.onblur = lostFocus;
}