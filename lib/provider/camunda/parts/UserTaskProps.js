'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  cmdHelper = require('../../../helper/CmdHelper'),
  elementHelper = require('../../../helper/ElementHelper'),
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  formHelper = require('../../../helper/FormHelper'),
  entryFactory = require('../../../factory/EntryFactory');

var find = require('lodash/find'),
    forEach = require('lodash/forEach');

function isExtensionElements(element) {
  return is(element, 'bpmn:ExtensionElements');
}

function isPropertyElements(element) {
  return element.values && is(element.values[0], 'camunda:Properties')
}

function getSelectedFormField(element, node) {
  var selected = formFieldsEntry.getSelected(element, node.parentNode);

  if (selected.idx === -1) {
  return;
  }

  return formHelper.getFormField(element, selected.idx);
}

function getPropertiesElement(element) {
  if (!isExtensionElements(element)) {
    return element.properties;
  } else {
    return getPropertiesElementInsideExtensionElements(element);
  }
}

function getPropertiesElementInsideExtensionElements(extensionElements) {
  return find(extensionElements.values, function(elem) {
    return is(elem, 'camunda:Properties');
  });
}

function getPropertyElement(element) {
  if (!isPropertyElements(element)) {
    return element.values && element.values[0];
  }
    return ''
}

function getPropertyValues(parent) {
  var properties = parent && getPropertiesElement(parent);
  if (properties && properties.values) {
    return properties.values;
  }
  return [];
}

function getElements(element, node) {
  var bo = getBusinessObject(element)
  var parent = getParent(bo);
  return getPropertyValues(parent);
}

function getParent(bo) {
  return bo.extensionElements;
}

module.exports = function(group, element, translate, bpmnFactory) {
  if (is(element, 'camunda:Assignable')) {

    // group.entries.push(entryFactory.dialogField({
    //   id : 'assigneeName',
    //   label : translate('Assignee'),
    //   modelProperty : 'assigneeName',
    //   refAttr: 'assignee',
    //   hidden: true,
    //   disabled: function () { return true },
    //   set: function(element, values, node) {
    //     return cmdHelper.updateProperties(element, JSON.parse(Object.values(values)[0]))
    //   }
    // }));

    // Assignee
    // group.entries.push(entryFactory.textField({
    //   id : 'assignee',
    //   label : translate('Assignee'),
    //   modelProperty : 'assignee',
    //   hide: true
    // }));

    group.entries.push(entryFactory.dialogField({
      id : 'candidateUsersName',
      label : translate('Candidate Users'),
      modelProperty : 'candidateUsersName',
      refAttr: 'candidateUsers',
      hidden: true,
      disabled: function () { return true },
      set: function(element, values, node) {
        return cmdHelper.updateProperties(element, JSON.parse(Object.values(values)[0]))
      }
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id : 'candidateUsers',
      label : translate('Candidate Users'),
      modelProperty : 'candidateUsers',
      hide: true
    }));

    group.entries.push(entryFactory.dialogField({
      id : 'candidateGroupsName',
      label : translate('Candidate Groups'),
      modelProperty : 'candidateGroupsName',
      refAttr: 'candidateGroups',
      disabled: function () { return true },
      set: function(element, values, node) {
        return cmdHelper.updateProperties(element, JSON.parse(Object.values(values)[0]))
      }
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id : 'candidateGroups',
      label : translate('Candidate Groups'),
      modelProperty : 'candidateGroups',
      hide: true
    }));

    var propSelectOptions = {
      id : 'btnType',
      label : translate('Operation Type Select'),
      modelProperty : 'btnType',
      selectOptions: function(element, inputNode) {
        var selectOptions = [
          { name: '请选择', value: '' },
          { name: '审核', value: 'audit' },
          { name: '评估', value: 'access' },
          { name: '资源开通', value: 'openRes' }
        ]
        return selectOptions;
      },
      createParent: function(element, bo) {
        var parent = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
        var cmd = cmdHelper.updateBusinessObject(element, bo, { extensionElements: parent });
        return {
          cmd: cmd,
          parent: parent
        };
      },
      updateProperties: function (parent, values) {
        var properties = getPropertiesElement(parent);
        if (!properties) {
          properties = elementHelper.createElement('camunda:Properties', {}, parent, bpmnFactory);
        }
        var cmd = cmdHelper.updateBusinessObject(element, parent, { 'properties': properties });
        return {
          properties: properties,
          cmd: cmd
        }
      },
      get: function(element, node) {
        var boElements = getElements(element, node);
        var properties = {}
        if (boElements.length > 0) {
          properties = boElements[0].$attrs
        }
        return properties;
      },
      set: function(element, values, node) {
        var commands = [],
          bo = getBusinessObject(element)
          parent = getParent(bo);

        if (!isExtensionElements(parent)) {
          var result = propSelectOptions.createParent(element, bo)
          parent = result.parent;
          commands.push(result.cmd)
        }

        var properties = getPropertiesElement(parent);
        if (!properties) {
          properties = elementHelper.createElement('camunda:Properties', {}, parent, bpmnFactory);

          if (!isExtensionElements(parent)) {
            commands.push(cmdHelper.updateBusinessObject(element, parent, { 'properties': properties }));
          } else {
            commands.push(cmdHelper.addAndRemoveElementsFromList(
              element,
              parent,
              'values',
              'extensionElements',
              [ properties ],
              []
            ));
          }
        }
        var property = getPropertyElement(properties);
        var data = Object.assign({}, values, {name: propSelectOptions.id, value: values[propSelectOptions.id]})
        if (!property) {
          property = elementHelper.createElement('camunda:Property', data, properties, bpmnFactory);
          commands.push(cmdHelper.addElementsTolist(element, properties, 'values', [ property ]));
        } else {
          commands.push(cmdHelper.updateBusinessObject(element, property, data))
        }

        return commands;
      }
    }
    group.entries.push(entryFactory.propSelect(propSelectOptions));

    // Due Date
    // group.entries.push(entryFactory.dateField({
    //   id : 'dueDate',
    //   description : translate('The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)'),
    //   label : translate('Due Date'),
    //   modelProperty : 'dueDate'
    // }));

    // // FollowUp Date
    // group.entries.push(entryFactory.dateField({
    //   id : 'followUpDate',
    //   description : translate('The follow up date as an EL expression (e.g. ${someDate} or an ' +
    //                 'ISO date (e.g. 2015-06-26T09:54:00)'),
    //   label : translate('Follow Up Date'),
    //   modelProperty : 'followUpDate'
    // }));

    // // priority
    // group.entries.push(entryFactory.textField({
    //   id : 'priority',
    //   label : translate('Priority'),
    //   modelProperty : 'priority'
    // }));
  }
};
