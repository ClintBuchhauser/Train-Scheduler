$(document).ready(function () {

    // Initialize Firebase
    var database = firebase.database();

    // Button to add trains - update HTML & database
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Turn inputs to variables
        var trainName = $("#train-input").val().trim();
        var trainDest = $("#destination-input").val().trim();
        var trainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
        var trainFreq = $("#frequency-input").val().trim();

        // Create local temporary object to hold train data
        var newTrain = {
            name: trainName,
            dest: trainDest,
            time: trainTime,
            freq: trainFreq
        };

        // Upload train data to database
        database.ref().push(newTrain);

        console.log("New Train Name: " + newTrain.name);
        console.log("New Train Destination: " + newTrain.dest);
        console.log("New Train Arrival: " + newTrain.time);
        console.log("New Train Frequency: " + newTrain.freq);

        alert("Train successfully added");

        // Clears input boxes
        $("#train-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");
    });

    // Firebase event for adding a row to the html for new train
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        // Store values in variables
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().dest;
        var trainTime = childSnapshot.val().time;
        var trainFreq = childSnapshot.val().freq;

        // console.log(trainName);
        // console.log(trainDest);
        // console.log(trainTime);
        // console.log(trainFreq);

        // Prettify train start time
        var trainTimePretty = moment.unix(trainTime).format("HH:mm");
        console.log("First Train Arrival: " + trainTimePretty);

        // Calculate the difference between current time and first train arrival, divided by the frequency of the trains
        var timeDiff = moment().diff(moment.unix(trainTime), "minutes") % trainFreq;
        // Calculate when the next train will arrive
        var minutes = trainFreq - timeDiff;
        // Converts the next train arrival into our HH:mm format
        var trainNext = moment().add(minutes, "m").format("hh:mm A");

        console.log("Next Arrival: " + trainNext);

        // Append train data to html table
        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
            trainFreq + "</td><td>" + trainNext + "</td><td>" + minutes + "</td></tr>");

    });
});