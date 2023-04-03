/**
 * This function is triggered when a response is submitted to the Google Form.
 * It retrieves the form response and sends it as a message to a Slack channel using a webhook.
 * For file uploads, it gets the file URL and includes it in the message.
 * Make sure to replace slackWebhookUrl with your own Slack webhook URL.
 * 
 * @param {Object} event - The form submit event.
 */
function onFormSubmit(event) {
  // Get the form response and item responses.
  var formResponse = event.response;
  var itemResponses = formResponse.getItemResponses();

  // Initialize an empty object to store the form data.
  var formData = {};

  // Loop through each item response and add it to the formData object.
  for (var i = 0; i < itemResponses.length; i++) {
    var thisItem = itemResponses[i];
    var question = thisItem.getItem().getTitle().trim() + ":";
    var answer = thisItem.getResponse();
    formData[question] = answer;
    
    // If the item is a file upload, get the file URL and store it in the formData object.
    if (thisItem.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
      var fileUrl = DriveApp.getFileById(answer).getUrl();
      formData[question] = fileUrl;
    }
  }
  
  // Set up the Slack message payload.
  var slackWebhookUrl = 'https://hooks.slack.com/services/xxxxxxxxx/yyyyyyyyy/zzzzzzzzzzzzzzzzzzzzzzzz'; // Replace with your own Slack webhook URL.
  var payload = {
    'text': 'New Form Response Received: ', // Set the message text.
    'attachments': [ // Set the message attachments.
      {
        'fallback': 'New Form Response', // Set the fallback message for devices that can't display attachments.
        'color': '#36a64f', // Set the attachment color.
        'fields': [] // Initialize an empty array to store the attachment fields.
      }
    ]
  };
  
  // Loop through each question in the formData object and add it as a field in the message attachment.
  for (var key in formData) {
    var value = formData[key];
    var field = {
      'title': key,
      'value': value,
      'short': false
    };
    payload.attachments[0].fields.push(field);
  }
  
  // Set up the options for the UrlFetchApp.fetch() method.
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };
  
  // Send the message to the Slack channel using the webhook.
  UrlFetchApp.fetch(slackWebhookUrl, options);
}

