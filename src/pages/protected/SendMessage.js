import React from 'react';

function SendMessage() {
  const sendMessage = async () => {
    const sms = {
      username: 'Bondiadmin',
      password: 'Bp@@2025',
      apicode: '1',
      msisdn: '01680178503',
      countrycode: '880',
      cli: '2222',
      messagetype: '1',
      message: 'SingleSMS_JesonTest1',
      messageid: '0',
    };
    const response = await fetch(
      'https://gpcmp.grameenphone.com/ecmapigw/webresources/ecmapigw.v2',
      {
        method: 'POST',
        body: sms,
      },
    );
    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      SendMessage
      <button onClick={sendMessage}>Message</button>
    </div>
  );
}

export default SendMessage;
