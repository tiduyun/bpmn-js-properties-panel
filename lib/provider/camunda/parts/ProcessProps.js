'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  propertyEntryFactory = require('../../../PropertyEntryFactory'),
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  domQuery = require('min-dom/lib/query');


function modifyBusinessObject(element, property, values) {
  var businessObject = getBusinessObject(element).get('processRef'),
      change = {};
  change[property] = values[property];

  return {
    cmd:'properties-panel.update-businessobject',
    context: {
      element: element,
      businessObject: businessObject,
      referenceProperty: property,
      properties: change
    }
  };
}

function getModifiedBusinessObject(element, property) {
  var bo = getBusinessObject(element).get('processRef'),
      res = {};

  res[property] = bo.get(property);

  return res;
}

module.exports = function(group, element) {
  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')) {
    // name
    var label = (is(element, 'bpmn:Participant')) ? 'Process Name' : 'Name';

    var nameEntry = propertyEntryFactory.textField({
      id: 'name',
      description: '',
      label: label,
      modelProperty: 'name'
    });

    // in participants we have to change the default behavior of set and get
    if(is(element, 'bpmn:Participant')) {
      nameEntry.get = function (element) {
        return getModifiedBusinessObject(element, 'name');
      };

      nameEntry.set = function (element, values) {
        return modifyBusinessObject(element, 'name', values);
      };
    }

    group.entries.push(nameEntry);


    // isExecutable
    var executableEntry = propertyEntryFactory.checkbox({
      id: 'isExecutable',
      description: 'Defines if a process is executable by a process engine',
      label: 'Executable',
      modelProperty: 'isExecutable'
    });

    // in participants we have to change the default behavior of set and get
    if(is(element, 'bpmn:Participant')) {
      executableEntry.get = function (element) {
        return getModifiedBusinessObject(element, 'isExecutable');
      };

      executableEntry.set = function (element, values) {
        return modifyBusinessObject(element, 'isExecutable', values);
      };
    }

    group.entries.push(executableEntry);
  }
};