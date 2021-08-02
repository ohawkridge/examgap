// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require('aws-sdk')

  const requestParams = JSON.parse(event.body)
  const username = requestParams.username

  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })

  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const params = {
    Destination: {
      ToAddresses: [username], // Must be array
    },
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                  <p>Hello,</p>
                  <p>Thanks for your interest in Examgap and for taking time to try it. I hope you find it useful.</p>
                  <p>There’s no team behind Examgap—just me. I created it to use in my department and it’s become a regular part of my teaching.</p>
                  <p>If you encounter a problem, have questions or feedback, please do email me.</p>
                  <p>PS—It'd be my pleasure to setup your classes for you. Just reply with lists of your student’s email addresses for each class you’d like.</p>
                  <p>Thanks again.</p>
                  <p>—Cheers, Owen</p>
                  </body>
              </html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: '',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome to Examgap',
      },
    },
    Source: 'Owen <owen@examgap.com>',
  }

  return ses
    .sendEmail(params)
    .promise()
    .then((data) => {
      console.log('email submitted to SES', data)
      return {
        statusCode: 200,
        body: `Message sent`,
      }
    })
    .catch((error) => {
      console.log(error)
      return {
        statusCode: 500,
        body: `Message unsuccesfully sent, error: ${error}`,
      }
    })
}
