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
                  <p>Hello there&mdash;I’m Owen.</p>
                  <p>Thanks for your interest in Examgap. Here’s a few things you should know:</p>
                  <ol>
                  <li>I’ve been a teacher for fourteen years. I created Examgap to use in my department.<br /></li>
                  <li>I can set up your classes for you. Reply to this email with a list of your student's email addresses and I'll take care of everything.<br /></li>
                  <li>To get started yourself, first create a class. Then students can use the link or class code under ‘Invite Students’ to create their own accounts.<br /></li>
                  <li>A level and IT courses aren’t complete yet, but you’ve got access to everything during your trial if you want to check out what’s there.<br /></li>
                  <li>There’s no team behind Examgap—just me. If you encounter a problem, please let me know.<br /></li>
                  </ol>
                  <p>That’s it. I hope you find it useful. If you have questions or feedback, you can reply to this email. Your reply will go straight to me.</p>
                  <p>—Cheers, Owen<br /><a href="https://www.examgap.com">Examgap</a></p>
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
        Data: '5 Important things to know about Examgap',
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
