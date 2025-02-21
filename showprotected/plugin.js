/*
 *  "showprotected" CKEditor plugin
 *
 *  Created by Matthew Lieder (https://github.com/IGx89)
 *
 *  Licensed under the MIT, GPL, LGPL and MPL licenses
 *
 *  Icon courtesy of famfamfam: http://www.famfamfam.com/lab/icons/mini/
 */

// TODO: configuration settings
// TODO: show the actual text inline, not just an icon?
// TODO: improve copy/paste behavior (tooltip is wrong after paste)
CKEDITOR.plugins.add('showprotected', {
  requires: 'dialog',
  onLoad: function () {
    // Add the CSS styles for protected source placeholders.
    const iconPath = CKEDITOR.getUrl(this.path + 'images' + '/code.gif');
    const baseStyle = 'background:url(' + iconPath + ') no-repeat %1 center;border:1px dotted #00f;background-size:16px;';
    const template = '.%2 showprotected-img.cke_protected' +
      '{' +
      baseStyle +
      'display:inline-block;' +
      'min-height:15px;' +
      'height:1.15em;' +
      'cursor:pointer;' +
      'padding:3px 3px 3px 16px;' +
      '}';

    // Styles with contents direction awareness.
    function cssWithDir(dir) {
      return template.replace(/%1/g, dir === 'rtl' ? 'right' : 'left').replace(/%2/g, 'cke_contents_' + dir);
    }

    CKEDITOR.addCss(cssWithDir('ltr') + cssWithDir('rtl'));
  },

  init: function (editor) {
    CKEDITOR.dialog.add('showProtectedDialog', this.path + 'dialogs/protected.js');
    editor.on('doubleclick', function (evt) {
      const element = evt.data.element;
      if (element.is('showprotected-img')) {
        CKEDITOR.plugins.showprotected.selectedElement = element;
        evt.data.dialog = 'showProtectedDialog';
      }
    });
    editor.on('key', function (evt) {
      const selection = editor.getSelection();
      const element = selection.getSelectedElement() || selection.getStartElement();
      if (element && element.getName() === 'showprotected-img') {
        return false;
      }
    });
  },

  afterInit: function (editor) {
    // add a rule to put a placeholder image next to every protected source region
    editor.dataProcessor.dataFilter.addRules({
      comment: function (commentText, commentElement, abc) {
        if (commentText.indexOf(CKEDITOR.plugins.showprotected.protectedSourceMarker) === 0) {
          commentElement.attributes = [];
          const cleanedCommentText = CKEDITOR.plugins.showprotected.decodeProtectedSource(commentText);
          // skip for meta tags
          if (/^<meta\s/i.test(cleanedCommentText)) {
            return commentText;
          }

          // create a fake element
          const commentId = Math.random().toString(36);
          const fakeElement = new CKEDITOR.htmlParser.element('showprotected-img', {
            'class': 'cke_protected',
            'data-cke-showprotected-temp': true,
            'data-cleaned-comment-text': cleanedCommentText,
            'data-encoded-comment-text': commentText,
            'data-comment-id': commentId,
            alt: cleanedCommentText,
            title: cleanedCommentText
          });
          fakeElement.setHtml(cleanedCommentText);
          fakeElement.insertAfter(commentElement);

          // output
          return commentText;
        }
        return null;
      }
    });

    // add a rule to remove the placeholder image from the raw HTML
    editor.dataProcessor.htmlFilter.addRules({
      elements: {
        'showprotected-img': function (element) {
          return false;
        },
      }
    }, -10);

    // check comment block

  }
});

/**
 * Set of showprotected plugin's helpers.
 *
 * @class
 * @singleton
 */
CKEDITOR.plugins.showprotected = {
  protectedSourceMarker: '{cke_protected}',
  decodeProtectedSource: function (protectedSource) {
    if (protectedSource.indexOf('%3C!--') === 0) {
      return decodeURIComponent(protectedSource).replace(/<!--\{cke_protected\}([\s\S]+?)-->/g, function (match, data) {
        return decodeURIComponent(data);
      });
    } else {
      return decodeURIComponent(protectedSource.substr(CKEDITOR.plugins.showprotected.protectedSourceMarker.length));
    }
  },

  encodeProtectedSource: function (protectedSource) {
    return CKEDITOR.plugins.showprotected.protectedSourceMarker +
      encodeURIComponent(protectedSource).replace(/--/g, '%2D%2D');
  }

};