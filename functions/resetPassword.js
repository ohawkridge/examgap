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
  console.log(`Function received`, email)
  // Cofigure AWS SES
  AWS.config.update({
    accessKeyId: 'AKIAJTQG3TNUQDRGXZOA',
    secretAccessKey: '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',
    region: 'eu-west-2',
  })
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  try {
    const newPass = createPassword()
    const qry = q.If(
      // Update password if username exists
      q.Equals(q.Exists(q.Match(q.Index('user_by_username'), email)), true),
      q.Update(
        q.Select(['ref'], q.Get(q.Match(q.Index('user_by_username'), email))),
        {
          credentials: {
            password: newPass,
          },
        }
      ),
      false
    )
    const data = await client.query(qry)
    // If success, send new password in email
    if (data) {
      const params = {
        Destination: {
          ToAddresses: [email], // Must be array
        },
        Message: {
          Body: {
            Html: {
              // HTML format of the email
              Charset: 'UTF-8',
              Data: `<html>
                      <body>
                        <p>Your password for Examgap was successfully reset.</p>
                        <p>-=-=-=-=-=-=-=-=-=-=-=-=-</p>
                        <p>Username: ${email}</p>
                        <p>New password: ${newPass}</p>
                        <br />
                        <p><a href="https://examgap.com/signin">Login to Examgap</a></p>
                        <br />
                        <br />
                        <p>If you're still having problems, email support@examgap.com.</p>
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
        Source: 'support@examgap.com',
      }
      ses.sendEmail(params)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
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
