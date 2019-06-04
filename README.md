# serverless-ssm-provider

This [Serverless](https://github.com/serverless/serverless) plugin allows you to simulate AWS SSM parameters in your `serverless.yml` template. The plugin intercepts requests to AWS and returns values found in your local environment files when a match is found. Otherwise the request passes through to AWS as usual.


## Installation

Install the plugin via npm:

```sh
npm i -D serverless-ssm-provider
```

Add the following to your `serverless.yml` file:

```yml
plugins:
  - serverless-ssm-provider
```


## Usage

By default, `serverless-ssm-provider` reviews all AWS SSM requests and attempts to match the request path to an `.env` file for overrides.

Example function:

```yml
functions:
  hello:
    handler: handler.hello
    environment:
      MY_SECRET: ${ssm:/hello/mySecretKey}
```

Example `.env` file:

```
/hello/mySecretKey=test
```

Since this plugin intercepts requests before they are sent to AWS, the plugin allows you to work truly offline without error due to failed requests.


## Configuration

To override the default file location:

```yml
custom:
  serverless-ssm-provider:
    file: ssm.env
```
