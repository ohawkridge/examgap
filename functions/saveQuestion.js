const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  // Build the object here so we can reuse it
  const questionObj = {
    text: data.question.text,
    maxMark: data.question.maxMark,
    modelAnswer: data.question.modelAnswer,
    keywords: data.question.keywords,
    minWords: minWords(data.question.modelAnswer),
    guidance: data.question.guidance,
  }

  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        // First create/update the question
        instance: q.If(
          q.Equals(data.edit, true),
          // Update existing question document
          // N.B. You can't use dot syntax inside FQL anymore!?
          q.Update(
            q.Ref(q.Collection('Question'), q.Select(['question', 'id'], data)),
            {
              data: questionObj,
            }
          ),
          // Create new question docment
          q.Create(q.Collection('Question'), {
            data: questionObj,
          })
        ),
      },
      {
        topics: q.Do(
          // Delete all existing topic mappings
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('question_topics_maps'),
                q.Select('ref', q.Var('instance'))
              )
            ),
            q.Lambda('ref', q.Delete(q.Var('ref')))
          ),
          // Create new mappings
          q.Map(
            q.Select(['question', 'selectedTopics'], data),
            q.Lambda(
              'ref',
              q.Create(q.Collection('TopicQuestion'), {
                data: {
                  question: q.Select('ref', q.Var('instance')),
                  topic: q.Ref(q.Collection('Topic'), q.Var('ref')),
                },
              })
            )
          )
        ),
        // We need to return the question id
        id: q.Select(['ref', 'id'], q.Var('instance')),
      }
    )
    const res = await keyedClient.query(qry)

    // NEVER delete marks!! (could be awarded to existing responses)
    // Don't use Foreach or Map. This results in identical
    // timestamps and therefore random ordering of marks
    for (const mark of data.question.marks) {
      const qry2 = q.If(
        q.Equals(q.Select('id', mark), ''), // New marks don't have an id yet
        // Create new
        q.Create(q.Collection('Mark'), {
          data: {
            text: q.Select('text', mark),
            question: q.Ref(q.Collection('Question'), res.id),
          },
        }),
        // Update existing
        q.Update(q.Ref(q.Collection('Mark'), q.Select('id', mark)), {
          data: {
            text: q.Select('text', mark),
          },
        })
      )
      await keyedClient.query(qry2)
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Calculate 10% less than the word count of model answer
function minWords(text) {
  return String(
    Math.round(text.trim().replace(/\s+/gi, ' ').split(' ').length * 0.9)
  )
}
