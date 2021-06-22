const faunadb = require('faunadb')
const q = faunadb.query
const AWS = require('aws-sdk')

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const feedback = data.feedback
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Create(q.Collection('Feedback'), {
      data: {
        feedback,
        user: q.Concat([
          q.Select(['data', 'username'], q.Get(q.CurrentIdentity())),
          ' (',
          q.Select('id', q.CurrentIdentity()),
          ')',
        ]),
        created: q.Now(),
      },
    })
    const data = await keyedClient.query(qry)
    // Configure and send email
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
                    <p>Feedback from: ${data.data.user}</p>
                    ${feedback}
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
    ses
      .sendEmail(params)
      .promise()
      .then(function (data) {
        console.log(data.MessageId)
      })
      .catch(function (err) {
        console.error(err, err.stack)
      })
    return {
      statusCode: 200,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
