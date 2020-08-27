var DetailsEntry = require('lib/factory/DetailsEntryFactory');


describe('factory/DetailsEntry', function() {

  describe('rendering', function() {

    it('should render', function() {

      // when
      var html = DetailsEntry({ title: 'title', description: 'description' }).html;

      // then
      expect(html).to.eql('<details class="bpp-card">' +
      '<summary><span class="bpp-card__title">title</span>' +
        '<span class="bpp-card__description">description</span>' +
      '</summary></details>');
    });


    it('should render content entries', function() {

      // when
      var html = DetailsEntry({ entries: [ { html: 'content' } ] }).html;

      // then
      expect(html).to.eql('<details class="bpp-card">' +
      '<summary><span class="bpp-card__title"></span>' +
        '<span class="bpp-card__description"></span>' +
      '</summary>content</details>');
    });


    it('should render remove button if callback is provided', function() {

      // when
      var html = DetailsEntry({ onRemove: function() {} }).html;

      // then
      expect(html).to.eql('<details class="bpp-card">' +
      '<summary><span class="bpp-card__title"></span>' +
        '<span class="bpp-card__description"></span>' +
        '<button class="bpp-card__remove" />' +
      '</summary></details>');
    });
  });


  describe('escaping', function() {

    it('should escape HTML', function() {

      // when
      var html = DetailsEntry({ title: '<html />', description: '<html />' }).html;

      // then
      expect(html).to.eql('<details class="bpp-card">' +
      '<summary><span class="bpp-card__title">&lt;html /&gt;</span>' +
        '<span class="bpp-card__description">&lt;html /&gt;</span>' +
      '</summary></details>');
    });
  });
});
