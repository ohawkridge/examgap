const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const topics = data.topics
  const questionId = data.questionId
  const secret = data.secret
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        // Get topic ids of existing topics
        existing: q.Select(
          'data',
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('question_topics'),
                q.Ref(q.Collection('Question'), questionId)
              )
            ),
            q.Lambda('ref', q.Select('id', q.Var('ref')))
          )
        ),
      },
      {
        // Find topic IDs to add/remove
        add: q.Difference(topics, q.Var('existing')),
        remove: q.Difference(q.Var('existing'), topics),
      }
    )
    const data = await keyedClient.query(qry)
    const qry2 = q.Do(
      // Remove unneeded map docs
      q.Map(
        data.remove,
        q.Lambda(
          'id',
          q.Delete(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('question_topic_delete'),
                  q.Ref(q.Collection('Question'), questionId),
                  q.Ref(q.Collection('Topic'), q.Var('id'))
                )
              )
            )
          )
        )
      ),
      // Create new maps
      q.Map(
        data.add,
        q.Lambda(
          'id',
          q.Create(q.Collection('TopicQuestion'), {
            data: {
              question: q.Ref(q.Collection('Question'), questionId),
              topic: q.Ref(q.Collection('Topic'), q.Var('id')),
            },
          })
        )
      )
    )
    await keyedClient.query(qry2)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err.description)
    return { statusCode: 500, body: err.toString() }
  }
}
