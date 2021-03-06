import processPullRequest from './processPullRequest';
import translatePayload from './translatePayload';

const processableActions = ['opened', 'reopened', 'synchronize', 'edited'];

const response = (message, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify({ message })
});

export async function lint(event) {
  const payload = JSON.parse(event.body);
  const githubEvent = event.headers['X-GitHub-Event'];

  if (!githubEvent) {
    return response('No X-Github-Event found on request', 412);
  }

  if (githubEvent === 'ping') {
    return response('pong');
  }

  if (githubEvent !== 'pull_request') {
    return response(`Unsupported X-GitHub-Event; [${githubEvent}]`, 412);
  }

  if (!processableActions.includes(payload.action)) {
    return response(`Unsupported action; [${payload.action}]`, 200);
  }

  await processPullRequest(translatePayload(payload));

  return response('Processing done');
}
