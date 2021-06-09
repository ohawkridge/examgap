const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      0,
      q.Select(
        ['data'],
        // https://github.com/shiftx/faunadb-fql-lib/blob/master/src/functions/Flatten.ts
        q.Reduce(
          q.Lambda(
            ['acc', 'val'],
            q.Prepend(
              q.Var('acc'),
              q.If(q.IsArray(q.Var('val')), q.Var('val'), [q.Var('val')])
            )
          ),
          [],
          q.Map(
            q.Paginate(q.Documents(q.Collection('Course'))),
            q.Lambda(
              'ref',
              q.Prepend(
                {
                  header: q.UpperCase(
                    q.Concat([
                      q.Select(['data', 'name'], q.Get(q.Var('ref'))),
                      ' (',
                      q.Select(['data', 'board'], q.Get(q.Var('ref'))),
                      ')',
                    ])
                  ),
                },
                q.Select(
                  ['data'],
                  q.Map(
                    q.Paginate(q.Match(q.Index('course_topics'), q.Var('ref'))),
                    q.Lambda(
                      'tRef',
                      q.Let(
                        {
                          instance: q.Get(q.Var('tRef')),
                        },
                        {
                          id: q.Select(['ref', 'id'], q.Var('instance')),
                          name: q.Select(['data', 'name'], q.Var('instance')),
                        }
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
    const data = await keyedClient.query(qry)
    // console.log(JSON.stringify(data, null, 2))
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
