import express, { response } from 'express'

const app = express()

app.get("/users", (request, response) => {
  return response.json({ message: 'Hello World - NLW04' })
})

app.post("/users", (request, response) => {
  return response.json({ message: "os dados foram salvos com sucesso!" })
})

app.listen(3333, () => {
  console.log('Server running at port 3333...')
})