// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require('aws-sdk')

  const requestParams = JSON.parse(event.body)
  const id = requestParams.id
  const username = requestParams.username
  const school = requestParams.school

  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })

  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const params = {
    Destination: {
      ToAddresses: ['owen@examgap.com', 'owen.hawkridge@chauncy.org.uk'], // Must be array
    },
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                    >> New sign up from:
                    <br />
                    ${username} (${id}) at ${school}.
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
        Data: '>> New Signup',
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
