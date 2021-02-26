const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const email = data.email
  // configure fauna client with login secret
  const client = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  try {
    const qry = q.Update(
      q.Select(['ref'], q.Get(q.Match(q.Index('user_by_username'), email))),
      {
        credentials: {
          password: createPassword(),
        },
      }
    )
    const data = await client.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Create random password like jhdy8762
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
    'r',
    's',
    't',
    'v',
    'x',
    'y',
  ]
  const nums = ['2', '3', '4', '5', '6', '7', '8', '9']
  let out = ''
  for (let i = 0; i < 4; i++) {
    out += ltrs[Math.floor(Math.random() * ltrs.length)]
  }
  for (let j = 0; j < 4; j++) {
    out += nums[Math.floor(Math.random() * nums.length)]
  }
  return out
}
