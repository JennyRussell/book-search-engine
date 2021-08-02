const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// importing apollo server
const { ApolloServer } = require ('apollo-server-express')
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// create new Apollo server and pass in schema

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
  
});

// Apollo server is integrated with Express app using middleware
server.applyMiddleware({ app });


app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});