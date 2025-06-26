/**
 * This function is triggered when a response is submitted to the Google Form.
 * It retrieves the form response and sends it as a message to a Slack channel using a webhook.
 * For file uploads, it gets the file URLs and includes them in the message.
 * Make sure to replace slackWebhookUrl with your own Slack webhook URL.
 *
 * @param {Object} event The form submit event.
 */
function onFormSubmit(event) {
  const { response: formResponse } = event;
  const itemResponses = formResponse.getItemResponses();
  const formData = {};

  itemResponses.forEach((thisItem) => {
    const question = thisItem.getItem().getTitle();
    const answer = thisItem.getResponse();
    const itemType = thisItem.getItem().getType();

    if (itemType === FormApp.ItemType.FILE_UPLOAD) {
      const fileUrls = [];
      if (typeof answer === 'string') {
        const fileId = answer.trim();
        const fileUrl = DriveApp.getFileById(fileId).getUrl();
        fileUrls.push(fileUrl);
      } else if (Array.isArray(answer)) {
        answer.forEach((file) => {
          const fileId = file.trim();
          const fileUrl = DriveApp.getFileById(fileId).getUrl();
          fileUrls.push(fileUrl);
        });
      }
      formData[question] = fileUrls;
    } else if (itemType === FormApp.ItemType.GRID || itemType === FormApp.ItemType.CHECKBOX_GRID) {
      const gridItem = thisItem.getItem();
      let rows;
      if (itemType === FormApp.ItemType.GRID) {
        rows = gridItem.asGridItem().getRows();
      } else {
        rows = gridItem.asCheckboxGridItem().getRows();
      }

      const formattedAnswer = [];
      if (answer) {
        rows.forEach((rowTitle, j) => {
          const rowResponse = answer[j] || '';
          let responseText = '';

          if (Array.isArray(rowResponse)) { // Checkbox Grid
            const filteredResponse = rowResponse.filter((c) => c && c.length > 0);
            if (filteredResponse.length > 0) {
              responseText = filteredResponse.join(', ');
            }
          } else { // Multiple Choice Grid
            responseText = rowResponse;
          }
          formattedAnswer.push(`${rowTitle}: ${responseText}`);
        });
      }
      formData[question] = formattedAnswer.join('\n');
    } else if (Array.isArray(answer)) {
      formData[question] = answer.join(', ');
    } else {
      formData[question] = answer;
    }
  });

  const slackWebhookUrl = 'https://hooks.slack.com/services/xxxxxxxxx/yyyyyyyyy/zzzzzzzzzzzzzzzzzzzzzzzz'; // Replace with your own Slack webhook URL.
  const payload = {
    text: 'New Forms response',
    attachments: [
      {
        fallback: 'Forms response',
        color: '#36a64f',
        fields: [],
      },
    ],
  };

  Object.keys(formData).forEach((key) => {
    let value = formData[key];
    if (Array.isArray(value)) {
      value = value.join('\n');
    }
    const field = {
      title: key,
      value,
      short: false,
    };
    payload.attachments[0].fields.push(field);
  });

  const options = {
    method: 'post',
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(slackWebhookUrl, options);
}

