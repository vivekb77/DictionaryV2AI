
//login start
var userId=null;
var totalTokensUsedByUserToday;


//to do on page load start
analytics.logEvent('Virtul Assistant page visited', { name: ''});
//disable the copy button till output is written

document.getElementById("copyButton").disabled = true;
document.getElementById("shareButton").disabled = true;
document.getElementById('submitRequirements').disabled=false;



checkLogin();
function checkLogin() {
    firebase.auth().onAuthStateChanged((user)=>{

        if(!user){
            //if user is not logged in
            document.getElementById("LogInButton").style.visibility = "visible";
            document.getElementById("loggedinemail").style.visibility = "hidden";
            document.getElementById("logoutButton").style.visibility = "hidden";
            console.log("not user1");
        }
        if(user){
            var userisAorNot = user.isAnonymous.toString();

            if(userisAorNot === "true"){
                 // if user isAnonymous and not logged in 
                 document.getElementById("LogInButton").style.visibility = "visible";
                 document.getElementById("loggedinemail").style.visibility = "hidden";
                 document.getElementById("logoutButton").style.visibility = "hidden";
                 console.log("not user2");
            }
            if(userisAorNot === "false"){
               //if user is logged in
               document.getElementById("LogInButton").style.visibility = "hidden";
               document.getElementById("loggedinemail").style.visibility = "visible";
               document.getElementById("logoutButton").style.visibility = "visible";
            
            document.getElementById("loggedinemail").innerText = "Logged in as "+user.email.slice(0, 25);  // email display first 15 chars
            console.log("user");
            userId = user.uid;
            
            getTotalTokensUsedToday();  //update the total tokens used at page load

            }
            
            
        }
    })
}


function logIn(){


var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithRedirect(provider);

    firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */
        analytics.logEvent('Login successful', { name: ''});

      }
     
analytics.logEvent('Login attempted', { name: ''});


    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
    
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

}



function logOut(){
  
    firebase.auth().signOut()
    userId = null // have to do or user id logic on page works as if user was logged even when logged out
   
    document.getElementById("LogInButton").style.visibility = "visible";
    document.getElementById("loggedinemail").style.visibility = "hidden";
    document.getElementById("logoutButton").style.visibility = "hidden";
    
}

// login end

var  requirements;

 //called on ask button click
function gatherDataToSend(){

    console.log(totalTokensUsedByUserToday);

     //only logged in users can query
    if(userId == null){
        document.getElementById('validation').innerText="Login with Google (takes just ~10 secs) to ask Questions";
    }

        //only logged in users can query
    if(userId !== null){

        if(totalTokensUsedByUserToday > 300)
        {
            document.getElementById('validation').innerText="You've reached the limit of your daily use. Please try again tomorrow.";
            rpT7Y6a8WRF();
        }

        if(totalTokensUsedByUserToday <= 300)
        {

            //validate if field is not empty. //this is the input sent to AI
            var  queryByUser = document.getElementById('user_requirement').value.trim();  

            if (queryByUser==null || queryByUser==""){  
                document.getElementById('validation').innerText = "Enter something";
            return false;  
            } if(queryByUser.length>300){  
                document.getElementById('validation').innerText = "Too long, 300 chars max";
            return false;  
            }  

            document.getElementById("loader").removeAttribute("hidden");
            document.getElementById('copyButton').value="Copy Answer";
            document.getElementById('shareButton').value="Share this";
            document.getElementById('copyButton').disabled=true;
            document.getElementById("shareButton").disabled = true;
            document.getElementById('validation').innerText="";  
            var  showProgress = document.getElementById('outputAnswerToDisplay');
            showProgress.innerText = "Thinking...This may take a few seconds. Please Wait...";
                
            
            // for adding to DB
            input = queryByUser.trim();

            document.getElementById('submitRequirements').value="Thinking...";  
            document.getElementById('submitRequirements').disabled = true; 
            
            
            //send requirements to moderate
            moderateContent(queryByUser);

            //log event
            askButtonClicked();
        }
    }
}


function askButtonClicked(){
   
    analytics.logEvent('Ask Button clicked', { name: ''});
    
}


//moderate user query and warn of content violates policies
var isQueryContentBad;
function moderateContent(queryByUser){

    let querysentToAI = queryByUser.trim();

    const request = new XMLHttpRequest();
    request.open("POST",'/moderateContent?requirement='+querysentToAI,true);
    
    request.onload=() => {

        let isQueryContentBad1 = request.responseText//response wiil be true or false , if true contennt violates policies
        // convert data into JSON object
        
        var parsedData = JSON.parse(isQueryContentBad1);
        isQueryContentBad = parsedData.results[0].flagged.toString();  
       


        // if value is true don't display output and show warning
        if (isQueryContentBad == "true"){
            document.getElementById('validation').innerText="This Query violates our content policies, no answer is displayed.";
            document.getElementById('outputAnswerToDisplay').innerText="This Query violates our content policies, no answer is displayed.";  

            document.getElementById('topfieldofAnswer').innerText = "Bad request";

            document.getElementById('submitRequirements').value="Ask";  
            document.getElementById('submitRequirements').disabled=false;

            beYwbUH4XJ2F6bPYUefH();

        }

        if (isQueryContentBad == "false"){
            askAI(queryByUser);

        }
      
    }
    
    request.send();
    
    }

var responsefromAI;


function askAI(queryByUser){

    let querysentToAI = queryByUser;
    
//send the info requirement as query string

    const request = new XMLHttpRequest();
    request.open("POST",'/askAI?requirement='+querysentToAI,true);
    
    request.onload=() => {

         responsefromAI = request.responseText //response from AI 
        
        displayOutput(responsefromAI);   //display the resonse on UI
    }
    
    request.send();
    
    }

    

// display answer on UI
function displayOutput(responsefromAI){

    document.getElementById('submitRequirements').value="Ask";  
    document.getElementById('submitRequirements').disabled=false;

    //display the result on the label
    
    document.getElementById('topfieldofAnswer').innerText = "Answer";
    // convert data into JSON object
    var parsedData = JSON.parse(responsefromAI);

    let cleanData = parsedData.choices[0].text.trim();  
    let totaltokensused1 = parsedData.usage.total_tokens;
    let querytokensused1 = parsedData.usage.prompt_tokens;
    let answertokensused1 = parsedData.usage.completion_tokens;

    document.getElementById("loader").setAttribute("hidden","");

    //display the result on the label
    const  outputLabel = document.getElementById('outputAnswerToDisplay');
    outputLabel.innerText = cleanData.slice(0, 2000);  
   

        //enable the copy button
    document.getElementById("copyButton").disabled = false;
    document.getElementById("shareButton").disabled = false;

    // for adding to DB
    output = cleanData;
    totaltokensused = totaltokensused1;
    querytokensused = querytokensused1;
    answertokensused = answertokensused1;
    
    addDataToDB();


}


//to add to db
var input ;
var output;
let totaltokensused;
let querytokensused;
let answertokensused;
var firebasePrimaryId;

function addDataToDB(){
   
    const database = firebase.database();
    const usersRef = database.ref('/VirtulAssistant');
    const autoId = usersRef.push().key
    
    usersRef.child(autoId).set({
    
     input: input.trim(),
     output: output.trim(),
     userId:userId,
     totaltokensused: totaltokensused,
     querytokensused: querytokensused,
     answertokensused:answertokensused,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
   
    firebasePrimaryId = autoId;

    updateURLandTitle();
    
    //add tokens used against the user // will be needed later or data analysis
    //logged in user -- add tokens used with its own row
    //but if user is not logged in a row for all users with undefined key is updated , this will hold all non logged users total used tokens
    tokensUsedByUser(); 
    addtokensUsedByUserDetailed();

}


function updateURLandTitle(){

    //update the title and url q string each time new query is done
    // pushState () -- 3 parameters, 1) state object 2) title and a URL)
    window.history.pushState('', "", '?id='+firebasePrimaryId);
    document.title = "DictionaryV2 - "+input;
    
    }

    
//keep adding user used tokens to db start

function tokensUsedByUser(){
   

    const database = firebase.database();
 
     
     database.ref('/UserUsedTokens/' +userId).update({ 
     totaltokensused:firebase.database.ServerValue.increment(totaltokensused)}),
    
    database.ref('/UserUsedTokens/' +userId).update({ 
    querytokensused:firebase.database.ServerValue.increment(querytokensused)}),

    database.ref('/UserUsedTokens/' +userId).update({ 
    answertokensused:firebase.database.ServerValue.increment(answertokensused)})

    // database.ref('/UserUsedTokens/' +userId).update({ 
    // lastUpdatedDate:firebase.database.ServerValue.set(firebase.database.ServerValue.TIMESTAMP)})

   
}


function addtokensUsedByUserDetailed(){
   
    const database = firebase.database();
    const usersRef = database.ref('/tokensUsedByUserDetailed');
    const autoId = usersRef.push().key
    
    usersRef.child(autoId).set({
    
     userId:userId,
     totaltokensused: totaltokensused,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
    getTotalTokensUsedToday(); //update the total tokens used
}


function getTotalTokensUsedToday(){


    totalTokensUsedByUserToday = 0;
    
    const database = firebase.database();
       
    database.ref('/tokensUsedByUserDetailed').orderByChild("userId").equalTo(userId) 
       .once("value",function(ALLRecords){
           ALLRecords.forEach(
               function(CurrentRecord) {
                  
       var totalTokensUsedByUserToday1 = CurrentRecord.val().totaltokensused;
       var createdDate1 = CurrentRecord.val().createdDate;
       
        var createdDate = new Date(createdDate1).toLocaleDateString(); 
        var todaysDate = new Date().toLocaleDateString();   
    
       //add all tokens used by user in the same day 
        if(createdDate === todaysDate){
             totalTokensUsedByUserToday = totalTokensUsedByUserToday+totalTokensUsedByUserToday1;
        }
    
       });     
       
      
       });
    
    
    }


// START 
//when user opens the link shared 
//pull data using qstring and display on textarea and output label

var sharedfirebasePrimaryId1 = new URLSearchParams(window.location.search);
var sharedfirebasePrimaryId = sharedfirebasePrimaryId1.get('id') //get id from query string 


//only trigger this if there is query string in the url
if(sharedfirebasePrimaryId !== null){
    firebasePrimaryId=sharedfirebasePrimaryId;  //this is needed because -- when user opens link sent by other user and shares it without clicking ask , url still has key of what was shared
    getDataOfSharedQuestion();
}


function getDataOfSharedQuestion(){

    const database = firebase.database();
    
    database.ref('/VirtulAssistant').orderByKey()  
    .equalTo(sharedfirebasePrimaryId).limitToLast(1)   
    .once("value",function(ALLRecords){
        ALLRecords.forEach(
            function(CurrentRecord) {
               
     input = CurrentRecord.val().input;
     output = CurrentRecord.val().output;

    document.getElementById("loader").setAttribute("hidden","");
    var  textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.value = input.trim();

    //here we display full data though user is not logged in , in displat data func we display 500 chars for not logged in
    var  placeholderTextLabel = document.getElementById('outputAnswerToDisplay');
    placeholderTextLabel.innerText = output.trim();

    //update the page title
    document.title = "DictionaryV2 - "+input;

      });      
    
        
        });
        document.getElementById('shareButton').value="Share this";
        document.getElementById('shareButton').disabled=false;
        document.getElementById('copyButton').value="Copy Answer";
        document.getElementById('copyButton').disabled=false;

        analytics.logEvent('Shared Question viewed', { name: ''});

    }
// END


// start
//get a different placeholder in the textarea every time page is loaded, only trigger this if there is NO query string in the url
if(sharedfirebasePrimaryId == null){
   getDataOfPlaceholderContent();
}

function getDataOfPlaceholderContent(){

    var placeholderTextArray = [];

    const database = firebase.database();
    
    database.ref('/PlaceholderText').orderByChild("createdDate")  
    .limitToLast(10)   
    .once("value",function(ALLRecords){
        ALLRecords.forEach(
            function(CurrentRecord) {
                
                

    var placeholderText = CurrentRecord.val().placeholderText;

    var placeholderTextObj = 
            {"placeholderText":placeholderText,
            };
        
            placeholderTextArray.push(placeholderTextObj)

        });      
    document.getElementById("loader").setAttribute("hidden","");
        //set any random placeholder in textarea  from DB when page is reloaed
    let randomNum  = Math.floor(Math.random() * placeholderTextArray.length);
    
    // because if not here  this loads first and if connection is slow new placeholder takes time to load and this shows up
    //this is just a backup if placeholer pulling from dbfails 
    var textAreaplaceholeder = "Eg. Summary of book Guns. Germs and Steel"
    var  textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.innerText = textAreaplaceholeder;

        
    var  textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.value = placeholderTextArray[randomNum].placeholderText;


            });
            
        }
//end

function affiliate1(){

    
    analytics.logEvent('Affiliate Link1 clicked', { name: ''});
  
    
    }

function affiliate2(){


    analytics.logEvent('Affiliate Link2 clicked', { name: ''});
   
    
    }

function shareURL(){


    urltoshare = "https://www.dictionaryv2.com/?id="+firebasePrimaryId;

    navigator.clipboard.writeText(urltoshare);

    document.getElementById('shareButton').value="Link Copied..";

    analytics.logEvent('Link shared', { name: ''});
        
}   


function clearAll(){
    
    document.getElementById('submitRequirements').value="Ask"; 
    document.getElementById('submitRequirements').disabled=false;

    var textAreaplaceholeder = ""
    var  textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.value = textAreaplaceholeder;

    document.getElementById('validation').innerText="";  
    document.getElementById("loader").setAttribute("hidden","");
    
    var  placeholderTextLabel = document.getElementById('outputAnswerToDisplay');
    placeholderTextLabel.innerText = "Your AI generated answer will appear here\n\n Dictionary Version 2 is your virtual assistant that can:\n- Answer general Questions \n- Brainstorm new ideas \n- Draft emails \n- Generate ideas for your business \n- Paste a link and it will summarize\n- Write social posts, tweets, poems, songs\n\nUse this instead of Google search when you want direct answers instead of clicking links on Google."

    document.getElementById('copyButton').value="Copy Answer";
    document.getElementById('copyButton').disabled=true;
    document.getElementById('shareButton').value="Share this";
    document.getElementById('shareButton').disabled=true;
    document.getElementById('topfieldofAnswer').innerText = "Answer";

    //update the title and url and title to just domain
    // pushState () -- 3 parameters, 1) state object 2) title and a URL)
    window.history.pushState('', "", '/');
    document.title = "DictionaryV2";

    analytics.logEvent('Clear All clicked', { name: ''});

}

function copyOutput(){
    

     var  outputAnswerToDisplay = document.getElementById('outputAnswerToDisplay');
     let  textToCopy = outputAnswerToDisplay.innerText;
     //console.log(textToCopy);
     navigator.clipboard.writeText(textToCopy);

     document.getElementById('copyButton').value="Answer Copied..";
   
     analytics.logEvent('Answer Copied', { name: ''});

 }



 function beYwbUH4XJ2F6bPYUefH(){
   
    
    const database = firebase.database();
    const usersRef = database.ref('/beYwbUH4XJ2F6bPYUefH');
    const autoId = usersRef.push().key
    
    usersRef.child(autoId).set({
    
     input: input.trim(),
     userId:userId,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
  

}

function rpT7Y6a8WRF(){
    const database = firebase.database();
    const usersRef = database.ref('/rpT7Y6a8WRF');
    const autoId = usersRef.push().key
    
    usersRef.child(autoId).set({
    
     userId:userId,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    }) 
}

