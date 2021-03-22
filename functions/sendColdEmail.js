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
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                  <p>Hi&mdash;I’m Owen, a Computer Science and I.T. teacher for fourteen years.</p>
                  <p>We all know students need to practise exam-style questions, yet most learning platforms focus on multiple choice and gap fills. Finding, photocopying, and marking questions is a hassle too—and where do you record the results? If that sounds familiar, you might be interested in Examgap.</p>
                  <p>Examgap is a tool I built that lets students practise written-answer questions to achieve higher grades on Computer Science exams. It makes marking more efficient; helps you diagnose weaknesses, and differentiation is built in.</p>
                  <p>I’d really appreciate it if you could check it out. You can get a 30-day free trial at <a href="https://examgap.com/trial">Examgap.com/trial</a>. No payment information required.</p><br />
                  <p>&mdash;Cheers, Owen</p>
                  owen@examgap.com
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
        Data: 'Improve Your Computer Science Results',
      },
    },
    Source: 'owen@examgap.com',
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
