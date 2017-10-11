# Violator bot

This is a fork and rewrite of [ESLint bot](https://github.com/Bernardstanislas/linter-bot).

Violator bot is a tool that will help your improve your code quality by linting it automatically with [ESLint](https://eslint.org) and [stylelint](https://stylelint.io) on every pull-request updates on your Github repository, and sending back reviews directly on Github.

Once plugged on your repo's webhooks, any pushed code will be linted, then commented directly on the commit page on Github.

## Installation

Clone the repo, then do a

```bash
yarn
```

*Optional* : create a new Github account for your bot, which will be used to author the comments.

## Configuration

You need to provide credentials to the Github account you want to use for the post-linting comments, as well as a file filter regex to determine whether a changed file should be linted or not.

This configuration gets taken from the environment, as follows :

```sh
GITHUB_USERNAME=username # Your bot's Github username
GITHUB_PASSWORD=password # Your bot's Github password
```

You also need to configure ESLint through the [.eslintrc](http://eslint.org/docs/user-guide/configuring). That's where all your linting rules go.

Eventually, you'll need to register your bot as a webhook for the repo you want to lint. Simply go the the settings page of your repo and add a new webhook pointing at your server's URL. Leave all the other options at their default value.

**Note** : you might be working on a npm-based project, in that case don't forget to modify the `FILE_FILTER` value to fit your needs and ignore the `node_modules` directory, otherwise you will end up with a slightly overshooting bot linting all your dependencies...

## Running

To start the bot simply run
```bash
yarn start
```

## Moving on

You might have noticed the `Procfile` in the repository. It enables you to run the bot on a [Heroku](https://www.heroku.com) VM.

I find it very convenient for this tool since you don't need many resources to run this small server. Moreover, you will be provided a fixed DNS, which is very convenient to register the webhook from Github.
