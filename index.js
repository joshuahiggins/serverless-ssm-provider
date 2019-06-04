const fs = require('fs');

const getValues = (path = '.env') => fs
  .readFileSync(path, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .map(line => line.split(/=(.*)/))
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

class ServerlessSSMProvider {
  constructor(serverless) {
    this.serverless = serverless;
    this.config = this.serverless.service.custom['serverless-ssm-provider'];
    this.values = this.config ? getValues(this.config.file) : getValues();

    const aws = this.serverless.getProvider('aws');
    const request = aws.request.bind(aws);

    aws.request = (service, method, params, options) => {
      const { Name } = params;
      const Value = this.values[Name];

      if (service === 'SSM' && method === 'getParameter' && Value) {
        return Promise.resolve({
          Parameter: { Value },
        });
      }

      return request(service, method, params, options);
    };

    this.serverless.setProvider('aws', aws);
  }
}

module.exports = ServerlessSSMProvider;
