import GitHubApi from 'github';
import flatMap from './flatMap';
import eslintAdapter from './eslintAdapter';
import stylelintAdapter from './stylelintAdapter';

const config = {
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
};

Object.keys(config).forEach(key => {
  if (!config[key]) {
    console.error(`Missing ${key} config! Exiting...`);
    process.exit(1);
  }
});

// Github configuration

const github = new GitHubApi();

github.authenticate(Object.assign({ type: 'basic' }, config));

// Functions

const translatePayload = ({ organization, repository, number, pull_request }) => ({
  owner: organization.login,
  repo: repository.name,
  number,
  commit_id: pull_request.head.sha
});

const files = (owner, repo, number) =>
  github.pullRequests.getFiles({
    owner,
    repo,
    number
  }).then(response => response.data);

const makeContentFetcher = (owner, repo, commit_id) => file =>
  github.repos.getContent({
    owner,
    repo,
    path: file.filename,
    ref: commit_id
  }).then(response => Buffer.from(response.data.content, 'base64').toString());

const processPullRequest = ({ owner, repo, number, commit_id }) =>
  files(owner, repo, number)
    .then(files => [files, makeContentFetcher(owner, repo, commit_id)])
    .then(([files, fetchContent]) => Promise.all([
      eslintAdapter(fetchContent)(files),
      stylelintAdapter(fetchContent)(files)
    ]).then(flatMap))
    .then(comments => {
      if (comments.length === 0) return;
      const review = {
        owner,
        repo,
        number,
        commit_id,
        event: 'REQUEST_CHANGES',
        body: 'ESLint & stylelint violations found.',
        comments
      };
      console.log('--- posting review:', review);
      return github.pullRequests.createReview(review);
    })
    .catch(error => console.error('=== something bad happened!!!', error));

export default payload =>
  processPullRequest(translatePayload(payload));
