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
                  <p>Hello there&mdash;I’m Owen.
                  <p>I created Examgap myself. Thanks for registering&mdash;I hope you find it useful.</p>
                  <p>-=-=-=-=-=-=-=-=-=-=-=-=</p>
                  <p>Getting Started</p>
                  <p>The first thing to do is to create a class. Then you can create an assignment and share the link with your students.</p>
                  <p>Students can use the link or class code to create their own accounts. Alternatively, I can setup your classes for you. Simply reply to this email with a list of your student's email addresses and I'll take care of it.</p>
                  <p>-=-=-=-=-=-=-=-=-=-=-=-=</p>
                  <p>Thanks again for your interest.</p>
                  <p>—Cheers, Owen</p>
                  <p><a href="https://examgap.com/signin">Sign in to Examgap</a></p>
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
