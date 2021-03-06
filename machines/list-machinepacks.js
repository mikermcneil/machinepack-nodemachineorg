module.exports = {
  friendlyName: 'List machinepacks',
  description: 'List machinepacks in the registry.',


  cacheable: true,


  inputs: {
    registry: {
      description: 'The base URL of the machine registry to use (defaults to the public registry at http://node-machine.org)',
      example: 'http://node-machine.org',
      defaultsTo: 'http://www.node-machine.org'
    }
  },
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Done.',
      example: [{
        identity: 'machinepack-whatever',
        friendlyName: 'Whatever (you know)',
        variableName: 'Whatever',
        description: 'Node.js utilities for working with whatever.',
        version: '0.5.17',
        numMachines: 8
      }]
    }
  },
  fn: function(inputs, exits) {
    var Http = require('machinepack-http');

    // Look up list of machinepacks
    Http.sendHttpRequest({
      baseUrl: inputs.registry,
      url: '/machinepacks'
    }).exec({
      error: exits.error,
      success: function (resp){

        var machinepacks;
        try {
          machinepacks = JSON.parse(resp.body);
        }
        catch (e){
          return exits.error(e);
        }

        return exits.success(machinepacks);
      }
    });
  }
};
