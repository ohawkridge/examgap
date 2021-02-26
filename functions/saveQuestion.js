const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const edit = data.edit
  const questionId = data.questionId
  const selectedTopics = data.selectedTopics
  const marks = data.marks
  const newObj = {
    marks: data.marks,
    text: data.text,
    modelAnswer: data.modelAnswer,
    keywords: data.keywords,
    maxMark: data.maxMark,
    minWords: minWords(data.minWords),
    guidance: data.guidance,
  }
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    let qry = q.Do(
      q.If(
        edit,
        q.Do(
          // Update existing question document
          q.Update(q.Ref(q.Collection('Question'), questionId), {
            data: newObj,
          }),
          // Delete TopicQuestion mappings
          // (will be recreated below)
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('question_topics_maps'),
                q.Ref(q.Collection('Question'), questionId)
              )
            ),
            q.Lambda('ref', q.Delete(q.Var('ref')))
          )
        ),
        // Create new question
        q.Create(q.Collection('Question'), {
          data: newObj,
        })
      )
    )
    let data = await keyedClient.query(qry)

    qry = q.Do(
      // Create new mappings in TopicQuestion
      q.Map(
        selectedTopics,
        q.Lambda(
          'ref',
          q.Create(q.Collection('TopicQuestion'), {
            data: {
              question: data.ref.id,
              topic: q.Ref(q.Collection('Topic'), q.Var('ref')),
            },
          })
        )
      ),
      // Update text for marks and create any new marks
      // N.B. NEVER delete marks!! (They could be
      // awarded to existing responses)
      q.Foreach(
        marks,
        q.Lambda(
          'ref',
          q.If(
            q.Equals(q.Var('ref').id, ''),
            // Create a new mark
            q.Create(q.Collection('Mark'), {
              data: {
                text: q.Var('ref').text,
                question: data.ref.id,
              },
            }),
            // Update an existing mark
            q.Update(q.Ref(q.Collection('Mark'), q.Var('ref').id), {
              data: {
                text: q.Var('ref').text,
              },
            })
          )
        )
      )
    )
    data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Calculate 12% less than the word count of model answer
function minWords(text) {
  return String(
    Math.round(text.trim().replace(/\s+/gi, ' ').split(' ').length * 0.88)
  )
}
