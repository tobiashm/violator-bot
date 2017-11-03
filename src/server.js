// Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import processPullRequest from './processPullRequest';

// Functions

const translatePayload = ({ organization, repository, number, pull_request }) => ({
  owner: organization.login,
  repo: repository.name,
  number,
  commit_id: pull_request.head.sha
});

// Server

const app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', (_, response) => {
  response.send('Hello from Violator bot!');
});

app.post('/', ({ headers, body: payload }, response) => {
  const actions = ['opened', 'reopened', 'synchronize'];
  const isProcessablePullRequest = headers['x-github-event'] === 'pull_request' && actions.includes(payload.action);
  if (isProcessablePullRequest) {
    payload = translatePayload(payload)
    console.log('--- process pull-request:', payload);
    processPullRequest(payload);
  } else {
    console.log('--- non-processable pull-request:', headers, payload);
  }
  response.end();
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
