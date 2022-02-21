var user="";

setTimeout(() => {
  $('form').submit(function (e){
    e.preventDefault( );
});
}, 700);



async function sendIt(action,param,player,gameID){
  return new Promise(async (resolve,reject)=>{
    var m=$("#mess").val();
    $("#mess").prop("placeholder","Sending....");
    $("#mess").val("");
    var rawResponse=await fetch('/msg', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ts:Date.now(),user:user,action:action,param:param,player:player,gameID:gameID})
    });
    $("#mess").prop("placeholder","Sent!");
    const content = await rawResponse.json();
    resolve();
    console.log(content);
  })
}

function init(){
  user=$("#uname").val();
  if (user==""){
    return;
  }
  else{   
     $("#mainlogin").fadeOut(()=>{
      $("#game").fadeIn();
     });
    // $("body").css("background","none")
  }
}