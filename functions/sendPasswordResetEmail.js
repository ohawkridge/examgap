const faunadb = require('faunadb')
const q = faunadb.query

// Generate a random id for password reset email
// https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/
const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // Return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

exports.handler = async (event) => {
  const AWS = require('aws-sdk')
  const data = JSON.parse(event.body)
  const email = data.email
  const ctx = process.env.CONTEXT
  // Use ExamgapDev database in development
  const secret = ctx === 'dev' ? process.env.DEV_KEY : process.env.SECRET_KEY
  const client = new faunadb.Client({
    secret,
  })
  // Configure SES
  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const code = guid()
  try {
    // Save password reset id and time in database
    // TODO Check username exists
    const qry = q.Update(
      q.Select('ref', q.Get(q.Match(q.Index('user_by_username'), email))),
      {
        data: {
          reset: {
            code,
            time: q.Now(),
          },
        },
      }
    )
    // Execute query
    const data = await client.query(qry)
    if (data) {
      // Send password in email
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
                  <p>Hello,</p>
                  <p>Click the link below to reset your password for Examgap.</p>
                  <p>----------------------------------------------------</p>
                  <a href='https://examgap.com/new-pass?c=${code}'>https://examgap.com/new-pass?c=${code}</a><br />
                  <p>----------------------------------------------------</p>
                  <p>Link is valid for 1 hour. If you didn’t ask to reset your password, you can ignore this email.</p>
                  <p>Still having problems? Email <a href="mailto:support@examgap.com">support@examgap.com</a></p>
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
            Data: 'Reset your password 🔒',
          },
        },
        Source: 'Examgap <no-reply@examgap.com>',
      }
      return ses
        .sendEmail(params)
        .promise()
        .then((data) => {
          console.log('email submitted to SES', data)
          return {
            statusCode: 200,
            body: `ok`,
          }
        })
        .catch((error) => {
          console.log(error)
          return {
            statusCode: 500,
            body: `Message unsuccesfully sent, error: ${error}`,
          }
        })
    } else {
      return { statusCode: 200, body: 'Email not found' }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
