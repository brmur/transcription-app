/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
ABOUT THIS NODE.JS EXAMPLE: This example works with AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/transcribe-app.html.

Purpose:
recorder.ts is part of a tutorial demonstrating how to build and deploy an app that transcribes and displays
voice recordings for authenticated users. To run the full tutorial, see
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/transcribe-app.html.

Running the code:
For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/transcribe-app.html.

*/
// Functions for recording transcriptions
// Enable microphone on browser
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  handlerFunction(stream);
});

// Handler function to manage recordings
function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      let blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
      var recordedAudio = document.getElementById("recordedAudio");
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
      recordedAudio.autoplay = true;
      sendData(blob);

      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: "eu-west-1"});
      const userParams = {
        AccessToken: getAccessToken()
      };
      cognitoidentityserviceprovider.getUser(userParams, function (err, data) {
        // an error occurred
        if (err) console.log(err, err.stack);
        else console.log(data.Username)
        var username = data.Username;
        console.log('the username', username)
        upload(blob, username)
      });
      // Upload recording to Amazon S3 bucket
      alert("Refresh page in ~1 min to view your transcription.");
    }
  };
}

function sendData(data) {
  console.log("sent");
  console.log(recordedAudio.src.split("/", -1)[3]);
}

// Start recording
window.startRecord = function () {
  console.log("Recording started");
  var record = document.getElementById("record");
  var stop = document.getElementById("stopRecord");
  record.disabled = true;
  record.style.backgroundColor = "blue";
  stop.disabled = false;
  audioChunks = [];
  rec.start();
};

// Stop recording
window.stopRecord = function () {
  console.log("Recording stopped");
  var record = document.getElementById("record");
  var stop = document.getElementById("stopRecord");
  var audioDownload = document.getElementById("audioDownload");
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red";
  rec.stop();
  audioDownload.click();
};
