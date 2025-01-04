import React from 'react';

function SendMessage() {
  const sendMessage = async () => {
    const sms = {
      username: 'Bondiadmin',
      password: '4Q4Nu9$vuW2zhE@s',
      apicode: '1',
      msisdn: '01680178503',
      countrycode: '880',
      cli: 'BP OTP',
      messagetype: '1',
      message: 'SingleSMS_JesonTest1',
      messageid: '0',
    };

    try {
      const response = await fetch(
        'https://gpcmp.grameenphone.com/ecmapigw/webresources/ecmapigw.v2',
        {
          method: 'POST',

          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json', // Set the content type
          },
          body: JSON.stringify(sms), // Convert the JavaScript object to JSON
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response Data:', data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      SendMessage
      <button onClick={sendMessage}>Message</button>
    </div>
  );
}

export default SendMessage;
