// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require('aws-sdk')

  const requestParams = JSON.parse(event.body)
  const nameStr = requestParams.nameStr
  const message = requestParams.message

  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })

  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const params = {
    Destination: {
      ToAddresses: ['owen@examgap.com'], // Must be array
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                <body>
                  <p>Feedback from: ${nameStr}</p>
                  ${message}
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
        Data: 'Incoming feedback 📩',
      },
    },
    Source: 'Eg Feedback <no-reply@examgap.com>',
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
