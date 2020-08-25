var escapeHTML = require('../../../../Utils').escapeHTML;

var getTemplate = require('../Helper').getTemplate;

module.exports = function(element, elementTemplates) {
  var entries = [];

  var elementTemplate = getTemplate(element, elementTemplates);

  var description = elementTemplate.description;

  if (description) {
    entries.push({
      id: 'custom-description',
      html: '<p>' +
              escapeHTML(description) +
            '</p>'
    });
  }

  return {
    id: 'elementTemplateDescription',
    label: elementTemplate.name,
    entries: entries
  };
};