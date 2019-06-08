
  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyA8dNPZcDRi_HVXTPg1W9so48m5l26Fi-g",
    authDomain: "trainscheduler-cab48.firebaseapp.com",
    databaseURL: "https://trainscheduler-cab48.firebaseio.com",
    projectId: "trainscheduler-cab48",
    storageBucket: "trainscheduler-cab48.appspot.com",
    messagingSenderId: "149909566602",
    appId: "1:149909566602:web:92b76742e7fac139"
  };
  
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  
  // Create a variable to reference the database
  var database=firebase.database();
  
  
  //Run Time  
  setInterval(function(startTime) {
    $("#timer").html(moment().format('hh:mm a'))
  }, 1000);
  
  
  $("#add-train").on("click", function() {
    
    event.preventDefault();
  
    // Code in the logic for storing and retrieving the most recent train information
    var train = $("#trainname-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTime = $("#firsttime-input").val().trim();
    
    var trainInfo = { 
      formtrain: train,
      formdestination: destination,
      formfrequency: frequency,
      formfirsttime: firstTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }; 
    database.ref().push(trainInfo);
  
    console.log(trainInfo.formtrain);
    console.log(trainInfo.formdestination);
    console.log(trainInfo.formfrequency);
    console.log(trainInfo.formfirsttime);
    console.log(trainInfo.dateAdded);
  
    $("#trainname-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#firsttime-input").val("");
  
  });
  
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;
  
    
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
  

    $("#timer").text(currentTime.format("hh:mm a"));
  

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);
  

    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);
  
    
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
  

    $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
  
  
  
  $("body").on("click", ".fa-trash", function() {
    $(this).closest("tr").remove(); 
    alert("delete button clicked");
  });
  
  
  function timeUpdater() {
    
    $("#train-table > tbody").empty();
    
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;
  
    
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
    
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
    
    $("#timer").text(currentTime.format("hh:mm a"));
    
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);
  
    
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);
  
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
  
    $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  
    })
  };
  
  setInterval(timeUpdater, 6000);
  
  