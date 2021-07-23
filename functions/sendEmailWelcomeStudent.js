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
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const params = {
    Destination: {
      ToAddresses: [email], // Must be array
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                  <p>Dear Student,</p>
                  <p>You’re receiving this email because your teacher has created a new account for you at <a href="https://www.examgap.com" title="Open Examgap.com">Examgap.com</a>.</p>
                  <p>Examgap is a site that helps you improve your results by practising exam questions online. Your teacher will set assignments, but you can revise on your own too.</p>
                  <p>
                  +----------------------------------+<br />
                  >> <a href="https://www.examgap.com/signin" title="Sign in to Examgap">Sign in to Examgap</a><br /><br />
                  Username: ${email}<br />
                  Password: password<br />
                  +----------------------------------+<br />
                  </p>
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
    Source: 'Examgap <support@examgap.com>',
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
