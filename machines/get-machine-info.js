module.exports = {
  friendlyName: 'Get machine info',
  description: 'Get metadata for the specified machine within the specified machinepack.',
  extendedDescription: '',


  cacheable: true,


  inputs: {
    machinepack: {
      description: 'The identity of the machinepack this machine belongs to.',
      example: 'machinepack-whatever',
      required: true
    },
    machine: {
      description: 'The identity of the machine to look up.',
      example: 'do-stuff',
      required: true
    },
    registry: {
      description: 'The base URL of the machine registry to use (defaults to the public registry at http://node-machine.org)',
      example: 'http://node-machine.org'
    }
  },
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    notFound: {
      description: 'No machinepack or machine with specified identity found in registry.'
    },
    success: {
      description: 'Done.',
      example: {
        identity: 'do-stuff',
        friendlyName: 'Do stuff and things',
        variableName: 'doStuff',
        description: 'Do stuff given other stuff.',
        fn: 'some stringified function',
        rawJsonStr: '{"identity": "do-stuff", etc.}'
      }
    }
  },
  fn: function(inputs, exits) {
    var util = require('util');
    var Http = require('machinepack-http');

    var registryBaseUrl = inputs.registry || 'http://www.node-machine.org';

    // Look up machinepack, including list of machines
    Http.sendHttpRequest({
      baseUrl: registryBaseUrl,
      url: util.format('/%s/%s', inputs.machinepack, inputs.machine)
    }).exec({
      error: exits.error,
      notFound: exits.notFound,
      success: function (resp){

        var machine;
        try {
          machine = JSON.parse(resp.body);
        }
        catch (e){
          return exits.error(e);
        }

        // Expose raw JSON string in case additional information needs to be parsed.
        machine.rawJsonStr = resp.body;

        return exits.success(machine);
      }
    });
  }
};
