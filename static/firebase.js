const firebaseConfig = {
  apiKey: "AIzaSyCfh8ymafgCM1QlcBO9O1VOwnkJnyfWb2o",
  authDomain: "dictionaryv2ai.firebaseapp.com",
  projectId: "dictionaryv2ai",
  storageBucket: "dictionaryv2ai.appspot.com",
  messagingSenderId: "934362094197",
  appId: "1:934362094197:web:7837491958e6cd3c9a763c",
  measurementId: "G-XQM2M8YGF3"
};

     // Initialize Firebase
     //const app = initializeApp(firebaseConfig);
     //const analytics = getAnalytics(app);

     firebase.initializeApp(firebaseConfig);
     const analytics = firebase.analytics();