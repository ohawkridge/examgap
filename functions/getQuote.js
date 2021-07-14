const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'text',
      q.Let(
        {
          instance: q.Get(
            q.Select(
              ['data', 0],
              q.Paginate(q.Documents(q.Collection('Quote')), {
                size: 1,
                after: q.Floor(
                  q.Divide(
                    q.Multiply(
                      Math.random(),
                      q.Count(q.Documents(q.Collection('Quote')))
                    ),
                    64
                  )
                ),
              })
            )
          ),
        },
        {
          text: q.Concat([
            q.Select(['data', 'quote'], q.Var('instance')),
            '—',
            q.Select(['data', 'author'], q.Var('instance')),
          ]),
        }
      )
    )
    const data = await keyedClient.query(qry)
    // console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
