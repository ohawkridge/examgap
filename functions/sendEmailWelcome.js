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
                  <p>Hello 👋,</p>
                  <p>I’m Owen from Examgap. Thanks for registering for a trial—I hope you find our service valuable.</p>
                  <p>Once you’ve created your first class, you can add students by going to ‘Students’ -> Actions -> Add students.</p>
                  <p>Alternatively, I’d be happy to set up your classes for you. Simply reply with a list of student email addresses for each class and I’ll add them to your account. The same goes for additional teacher accounts for your department.</p>
                  <p>Thanks again for your interest.</p>
                  <p><a href="https://examgap.com/signin">Sign in to Examgap</a></p>
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
