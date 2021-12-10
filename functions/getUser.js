const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const username = data.username
  const password = data.password
  const ctx = process.env.CONTEXT
  // Use ExamgapDev database in development
  const secret = ctx === 'dev' ? process.env.DEV_KEY : process.env.SECRET_KEY
  const client = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'user',
      q.Let(
        {
          // Use login secret to try for user credentials
          // https://docs.fauna.com/fauna/current/api/fql/functions/login?lang=javascript
          // Returns auth object
          obj: q.Login(
            q.Match(q.Index('user_by_username'), q.LowerCase(username)),
            {
              password,
              ttl: q.TimeAdd(q.Now(), 14, 'days'),
            }
          ),
          usr: q.Select('data', q.Get(q.Select('instance', q.Var('obj')))),
        },
        {
          user: q.Merge(q.Var('usr'), {
            secret: q.Select('secret', q.Var('obj')),
            id: q.Select(['instance', 'id'], q.Var('obj')),
            // For teachers, get school if we find a ref
            school: q.If(
              q.Select('teacher', q.Var('usr')),
              q.If(
                q.IsRef(q.Select('school', q.Var('usr'))),
                q.Select(
                  ['data', 'name'],
                  q.Get(q.Select('school', q.Var('usr')))
                ),
                q.Select('school', q.Var('usr'))
              ),
              'N/A'
            ),
            subscriptionDays: q.If(
              q.Select('teacher', q.Var('usr')),
              q.TimeDiff(
                q.Now(),
                q.Select('subscriptionExpires', q.Var('usr')),
                'days'
              ),
              'N/A'
            ),
            // For students, get recent assignments
            recent: 'DEBUG',
            // q.If(
            //   q.Select('teacher', q.Var('usr')),
            //   '',
            //   q.Take(
            //     4,
            //     q.Reverse(
            //       q.Select(
            //         'data',
            //         q.Map(
            //           q.Paginate(
            //             q.Match(
            //               q.Index('student_assignments'),
            //               q.CurrentIdentity()
            //             )
            //           ),
            //           q.Lambda(
            //             'ref',
            //             q.Let(
            //               {
            //                 instance: q.Get(q.Var('ref')), // Assignment
            //               },
            //               {
            //                 id: q.Select(['ref', 'id'], q.Var('instance')),
            //                 name: q.Select(['data', 'name'], q.Var('instance')),
            //                 start: q.Select(
            //                   ['data', 'start'],
            //                   q.Var('instance'),
            //                   'N/A'
            //                 ),
            //                 dateDue: q.Select(
            //                   ['data', 'dateDue'],
            //                   q.Var('instance')
            //                 ),
            //                 group: q.Let(
            //                   {
            //                     instance: q.Get(
            //                       q.Select(['data', 'group'], q.Var('instance'))
            //                     ),
            //                   },
            //                   {
            //                     name: q.Select(
            //                       ['data', 'name'],
            //                       q.Var('instance')
            //                     ),
            //                   }
            //                 ),
            //                 numQuestions: q.Count(
            //                   q.Select(['data', 'questions'], q.Var('instance'))
            //                 ),
            //                 live: q.LT(
            //                   q.ToDate(
            //                     q.SubString(
            //                       q.Select(
            //                         ['data', 'dateDue'],
            //                         q.Var('instance')
            //                       ),
            //                       0,
            //                       10
            //                     )
            //                   ),
            //                   q.ToDate(q.Now())
            //                 ),
            //               }
            //             )
            //           )
            //         )
            //       )
            //     )
            //   )
            // ),
          }),
        }
      )
    )
    const data = await client.query(qry)
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
