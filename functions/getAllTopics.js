const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  const allCourses = data.allCourses
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
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
            q.Paginate(
              // Show all course topics in autocomplete?
              q.If(
                allCourses,
                q.Documents(q.Collection('Course')),
                q.Filter(
                  q.Documents(q.Collection('Course')),
                  q.Lambda(
                    'cRef',
                    q.Select(['data', 'active'], q.Get(q.Var('cRef')), false)
                  )
                )
              )
            ),
            q.Lambda(
              'ref',
              q.Prepend(
                q.Let(
                  {
                    instance: q.Get(q.Var('ref')),
                  },
                  {
                    header: q.UpperCase(
                      q.Concat([
                        q.Select(['data', 'board'], q.Var('instance')),
                        ' ',
                        q.Select(['data', 'shortName'], q.Var('instance')),
                      ])
                    ),
                    active: q.Select(['data', 'active'], q.Var('instance')),
                  }
                ),
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
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
