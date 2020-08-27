'use strict';

var escapeHTML = require('../Utils').escapeHTML;


/**
 * @param  {object} options
 * @param  {string} id
 * @param  {string} [options.title]
 * @param  {string} [options.description]
 * @param  {Function} [options.onRemove]
 * @param  {Array<object>} [options.entries] - entries to display inside
 *
 * @return {object}
 */
function Details(options) {

  var id = options.id,
      title = options.title || '',
      description = options.description || '',
      onRemove = options.onRemove,
      entries = options.entries || [];


  var detailsEntry = { id: id };

  detailsEntry.html = '<details class="bpp-card">' +
    '<summary><span class="bpp-card__title">' + escapeHTML(title) + '</span>' +
      '<span class="bpp-card__description">' + escapeHTML(description) + '</span>' +
      (onRemove ? '<button class="bpp-card__remove" />' : '') +
    '</summary>' +
    entriesToHtml(entries) +
  '</details>';

  return detailsEntry;
}

function entriesToHtml(entries) {
  return entries.map(function(entry) {
    return entry.html;
  }).join('');
}

module.exports = Details;
