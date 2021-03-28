// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require('aws-sdk')

  const requestParams = JSON.parse(event.body)
  const email = requestParams.email

  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })
  console.log(`Send email to`, email)
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const params = {
    Destination: {
      ToAddresses: [email], // Must be array
    },
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                  <p>Welcome to Examgap 👋,</p>
                  <p>Examgap is a site that helps you improve your Computer Science results by practising written-answer exam questions.</p>
                  <p>Your teacher will assign you questions to answer, but you can also use it to revise.</p>
                  <p>Your username is ${email}. If you forget your password, you will need to ask your teacher to reset it.</p>
                  <p>If you encounter problems you can email <a href="mailto:support@examgap.com">support@examgap.com</a>.</p>
                  <p>Click <a href="https://examgap.com/signin">here</a> to sign in</p>
                  <br />
                  <p>—Cheers, the Examgap team</p>
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
        Data: 'Your Examgap account',
      },
    },
    Source: 'support@examgap.com',
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
