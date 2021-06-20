const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const feedback = data.feedback
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  // Configure email
  const AWS = require('aws-sdk')
  AWS.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
    region: 'eu-west-2',
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
    // const ses = new AWS.SES({ apiVersion: '2010-12-01' })
    // const params = {
    //   Destination: {
    //     ToAddresses: ['owen@examgap.com'], // Must be array
    //   },
    //   Message: {
    //     Body: {
    //       Html: {
    //         // HTML Format of the email
    //         Charset: 'UTF-8',
    //         Data: `<html>
    //               <body>
    //                 Incoming feedback from: ${name}
    //                 <br />
    //                 Email: ${email}
    //                 <br />
    //                 ${message}
    //               </body>
    //           </html>`,
    //       },
    //       Text: {
    //         Charset: 'UTF-8',
    //         Data: '',
    //       },
    //     },
    //     Subject: {
    //       Charset: 'UTF-8',
    //       Data: 'In-app feedback',
    //     },
    //   },
    //   Source: 'feedback@examgap.com',
    // }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
