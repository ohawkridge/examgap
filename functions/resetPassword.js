const faunadb = require('faunadb')
const q = faunadb.query

// Actually reset a user's password
exports.handler = async (event) => {
  const AWS = require('aws-sdk')
  const data = JSON.parse(event.body)
  const password = data.password
  const code = data.code
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
  // Find user from code and update password
  const qry = q.If(
    q.Exists(q.Match(q.Index('user_by_code'), code)),
    q.Let(
      {
        userRef: q.Get(q.Match(q.Index('user_by_code'), code)),
      },
      {
        ref: q.Select('ref', q.Var('userRef')),
        valid: q.LTE(
          q.TimeDiff(
            q.Select(['data', 'reset', 'time'], q.Var('userRef')),
            q.Now(),
            'minutes'
          ),
          60
        ),
      }
    ),
    false // Cose not found
  )
  const res = await client.query(qry)
  if (!res) {
    return { statusCode: 403, body: 'Invalid code' }
  }
  // Code has expired
  if (!res.valid) {
    return { statusCode: 403, body: 'Code expired' }
  }
  // Second query to actually apply new password
  const qry2 = q.Update(res.ref, {
    credentials: {
      password,
    },
  })
  const data2 = await client.query(qry2)
  const email = data2.data.username
  console.debug('Pw reset for', email)
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
                  <p>Your password for Examgap.com was successfully reset.</p>
                  <p>If you did <strong>not</strong> request a password reset please email <a href="mailto:support@examgap.com">support@examgap.com</a>.</p>
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
        Data: 'Your password was reset',
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
}
