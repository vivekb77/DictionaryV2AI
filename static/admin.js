
checkLogin();
function checkLogin() {
    firebase.auth().onAuthStateChanged((user)=>{

        if(!user){
            location.replace("/") // if user is not logged in , send to home page
        }
        if(user){
            if(user.uid != "IJUpHkceApftKQeAn05r1LIJRIi1"){
                location.replace("/") // if user is not admin , send to home page
            }
            if(user.uid == "IJUpHkceApftKQeAn05r1LIJRIi1"){
                GetData();
                countTotalRecords();
                countTotalUsers();
                totalTokensUsed();
                queryTokensUsed();
                answerTokensUsed();
            } 
        }
    })
}



var  VAArray = [];
var counter = 0;  

function GetData(){


   const database = firebase.database();
   
   
database.ref('/VirtulAssistant').orderByChild("createdDate").limitToLast(100) 
   .once("value",function(ALLRecords){
       ALLRecords.forEach(
           function(CurrentRecord) {
       

   var input = CurrentRecord.val().input;
   var output = CurrentRecord.val().output;
   var totaltokensused = CurrentRecord.val().totaltokensused;
   var createdDate = CurrentRecord.val().createdDate;

//way 1 just displays day and month
//    let options = { month: 'short', day: 'numeric' };
//   let formatteddate0  = new Date(createdDate);
//   var formatteddate = (formatteddate0.toLocaleDateString("en-US", options));

// way 2 both time and date
var date = new Date(createdDate).toLocaleDateString("en-UK")

var time = new Date(createdDate).toLocaleTimeString("en-UK")

var formatteddate = date+" " +time;

              var VAObject = 
                   {"input":input,
                   "output":output,
                   "totaltokensused":totaltokensused,
                   "formatteddate":formatteddate};
                  
               
               VAArray.push(VAObject)
                 
           });
         
    //new questions at the top
      VAArray.reverse()

        counter = 1;  
        
        AddData(VAArray);
       

       });

}





function AddData (VAArray){
  
   //remove the placeholer first
   const placeholder1 = document.getElementById('placeholder-animation1');
   placeholder1.innerHTML ='';
   const placeholder2 = document.getElementById('placeholder-animation2');
   placeholder2.innerHTML ='';
   const placeholder3 = document.getElementById('placeholder-animation3');
   placeholder3.innerHTML ='';

for (i=0 ;i < VAArray.length; i++){
  
  
var galaxzdiv = document.createElement('div');
galaxzdiv.className = 'post-preview';
galaxzdiv.id = 'galaxzdiv'+counter;
document.getElementById('maindiv').append(galaxzdiv);

var toppara = document.createElement('p');
toppara.className = 'post-meta';
toppara.id = 'toppara'+counter;
document.getElementById('galaxzdiv'+counter).append(toppara);


amountneeded = ((VAArray[i].totaltokensused/1000)*0.02).toFixed(3);

var curatedDate = document.createElement('span');
curatedDate.id = 'curatedDate'+counter;
curatedDate.innerText = "T- "+VAArray[i].totaltokensused+ "   ($ "+amountneeded +")";
document.getElementById('toppara'+counter).append(curatedDate);

var curatedDate = document.createElement('span');
curatedDate.id = 'curatedDate'+counter;
curatedDate.innerText = VAArray[i].formatteddate;
document.getElementById('toppara'+counter).append(curatedDate);

var titleDesc = document.createElement('a');
titleDesc.id = 'titleDesc'+counter;
// titleDesc.value = VAArray[i].galaxzId;
document.getElementById('galaxzdiv'+counter).append(titleDesc);

var title = document.createElement('h5');
title.id = 'post-title'+counter;
title.className = 'post-title';
title.innerText = VAArray[i].input;
document.getElementById('titleDesc'+counter).append(title);

var postsubtitle = document.createElement('h6');
postsubtitle.id = 'post-subtitle'+counter;
postsubtitle.className = 'post-subtitle';
postsubtitle.innerText = VAArray[i].output;
document.getElementById('titleDesc'+counter).append(postsubtitle);

var br = document.createElement("br");
document.getElementById('galaxzdiv'+counter).append(br);

var hr = document.createElement("hr");
hr.className='my-4';
hr.id = 'hr'+counter;
document.getElementById('galaxzdiv'+counter).append(hr);

++counter;

}


}



function countTotalRecords(){


const database = firebase.database();
   
   
database.ref('VirtulAssistant').once('value', function(snapshot) {
   // console.log("Count!", snapshot.numChildren());
   document.getElementById('totalRecords').innerText="Total Queries --- "+snapshot.numChildren(); 
 });

}


function countTotalUsers(){


const database = firebase.database();
   
   
database.ref('UserUsedTokens').once('value', function(snapshot) {
   // console.log("Count!", snapshot.numChildren());
   document.getElementById('totalUsers').innerText="Total Users --- "+snapshot.numChildren(); 
 });

}



function totalTokensUsed(){

let totaltokensusedsofar = 0

const database = firebase.database();
   
database.ref('/VirtulAssistant').orderByChild("totaltokensused")
   .once("value",function(ALLRecords){
       ALLRecords.forEach(
           function(CurrentRecord) {
              
   var tokenusedforeachquery = CurrentRecord.val().totaltokensused;

   totaltokensusedsofar = tokenusedforeachquery+totaltokensusedsofar;

  
   });
   var totalAmountusedsofar = ((totaltokensusedsofar/1000)*.02).toFixed(3);
   document.getElementById('totalTokens').innerText="Total tokens used --- " +totaltokensusedsofar +"  ( $ " +totalAmountusedsofar+")"; 
        
           
   });

}



function queryTokensUsed(){

let totalquerytokensusedsofar = 0

const database = firebase.database();
   
database.ref('/VirtulAssistant').orderByChild("querytokensused")
   .once("value",function(ALLRecords){
       ALLRecords.forEach(
           function(CurrentRecord) {
              
   var eachquerytokens = CurrentRecord.val().querytokensused;

   totalquerytokensusedsofar = totalquerytokensusedsofar+eachquerytokens;

  
   });
   var totalAmountusedsofar = ((totalquerytokensusedsofar/1000)*.02).toFixed(3);
   document.getElementById('queryTokens').innerText="Query tokens used --- " +totalquerytokensusedsofar +"  ( $ " +totalAmountusedsofar+")"; 
        
           
   });

}



function answerTokensUsed(){

let totalanswertokensusedsofar = 0

const database = firebase.database();
   
database.ref('/VirtulAssistant').orderByChild("answertokensused")
   .once("value",function(ALLRecords){
       ALLRecords.forEach(
           function(CurrentRecord) {
              
   var eachanswertokensusedsofar = CurrentRecord.val().answertokensused;

   totalanswertokensusedsofar = totalanswertokensusedsofar+eachanswertokensusedsofar;

  
   });
   var totalAmountusedsofar = ((totalanswertokensusedsofar/1000)*.02).toFixed(3);
   document.getElementById('answerTokens').innerText="Answer tokens used --- " +totalanswertokensusedsofar +"  ( $ " +totalAmountusedsofar+")"; 
        
           
   });

}

