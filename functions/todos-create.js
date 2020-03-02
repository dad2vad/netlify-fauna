/* Import faunaDB sdk */
import faunadb from 'faunadb'
const data = {}
data.completed = false

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

/* export our lambda function as named "handler" export */
exports.handler = async (event) => {
  /* parse the string body into a useable JS object */
  
const d = JSON.parse(event.body)
  data.title = d.title || d.update_id || d.timestamp || new Date().toString().split('GMT')[0]
  data.body = d.message || {}
  console.log('\n💬\n', JSON.stringify(data,null,4))
  const todoItem = {
    data: data
  }
  /* construct the fauna query */
  return client.query(q.Create(q.Ref('classes/todos'), todoItem))
    .then((response) => {
    //  console.log('success', response)
      /* Success! return the response with statusCode 200 */
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    }).catch((error) => {
      console.log('error', error)
      /* Error! return the error with statusCode 400 */
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
