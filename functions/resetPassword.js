const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const AWS = require('aws-sdk')
  const data = JSON.parse(event.body)
  const email = data.email
  // Configure fauna client with login secret
  const client = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  // Configure SES
  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
  })
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  const newPass = createPassword()
  try {
    const qry = q.If(
      // Update password if username exists
      q.Exists(q.Match(q.Index('user_by_username'), email)),
      q.Update(
        q.Select('ref', q.Get(q.Match(q.Index('user_by_username'), email))),
        {
          credentials: {
            password: newPass,
          },
        }
      ),
      false
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
                  <p>Here are your new login details:</p>
                  <p>-------------------------</p>
                  Username: ${email}<br />
                  New password: ${newPass}
                  <p>-------------------------</p>
                  <p><a href="https://examgap.com/signin">Login to Examgap</a></p>
                  <p>If you're still having problems, <a href="mailto:support@examgap.com">email support@examgap.com</a>.</p>
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
            Data: '>> Examgap new password',
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
    } else {
      return { statusCode: 400, body: 'Email not found' }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Create random password like jhdy-876
function createPassword() {
  const ltrs = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'g',
    'h',
    'j',
    'k',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  const nums = ['2', '3', '4', '5', '6', '7', '8', '9']
  let out = ''
  for (let i = 0; i < 4; i++) {
    out += ltrs[Math.floor(Math.random() * ltrs.length)]
  }
  out += '-'
  for (let j = 0; j < 4; j++) {
    out += nums[Math.floor(Math.random() * nums.length)]
  }
  return out
}
