/*
lith - v4.5.3

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   var dale   = isNode ? require ('dale')   : window.dale;
   var teishi = isNode ? require ('teishi') : window.teishi;

   if (isNode) var lith = exports;
   else        var lith = window.lith = {};

   var type = teishi.t, log = teishi.l;

   // *** CONSTANTS ***

   lith.k = {
      lithbagElements: ['string', 'integer', 'float', 'array', 'undefined'],
      tags: ['!DOCTYPE HTML', 'LITERAL', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
      voidTags: ['!DOCTYPE HTML', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
   }

   /*
   if (teishi.stop ([['HTML void tags', 'HTML tags'], lith.k.voidTags, lith.k.tags, 'eachOf', teishi.test.equal])) {
      return false;
   }
   */

   // *** HELPER FUNCTIONS ***

   lith.entityify = function (string, prod) {
      if (! prod && teishi.stop ('lith.entityify', ['Entityified string', string, 'string'])) return false;

      return string
         .replace (/&/g, '&amp;')
         .replace (/</g, '&lt;')
         .replace (/>/g, '&gt;')
         .replace (/"/g, '&quot;')
         .replace (/'/g, '&#39;')
         .replace (/`/g, '&#96;');
   }

   // *** LITH VALIDATION ***

   lith.v = function (input) {

      var inputType = type (input);

      if (inputType === 'array' && type (input [0]) === 'string' && lith.k.tags.indexOf (input [0]) !== -1) {

         var attributes = type (input [1]) === 'object' ? input [1] : undefined;
         var contents   = input [attributes ? 2 : 1];

         return teishi.v ([
            ['lith length', input.length, {min: 1, max: 3}, teishi.test.range],
            [attributes === undefined, ['length of lith without attributes', input.length, {max: 2}, teishi.test.range]],
            [
               ['lith attribute keys', 'start with an ASCII letter, underscore or colon, and be followed by letters, digits, underscores, colons, periods, dashes, extended ASCII characters, or any non-ASCII characters.'],
               dale.keys (attributes),
               /^[a-zA-Z_:][a-zA-Z_:0-9.\-\u0080-\uffff]*$/,
               'each', teishi.test.match
            ],
            ['lith attribute values', attributes, ['string', 'integer', 'float', 'undefined', 'null', 'boolean'], 'eachOf'],
            ['lith contents', contents, lith.k.lithbagElements, 'oneOf']
         ], function (error) {
            log ('lith.v - Invalid lith', {error: error, 'original input': input});
         }) ? 'Lith' : false;
      }

      return teishi.v ([
         ['lithbag', inputType, lith.k.lithbagElements, 'oneOf', teishi.test.equal],
         [inputType === 'array', ['lithbag elements', input, lith.k.lithbagElements, 'eachOf']]
      ], function (error) {
         log ('lith.v - Invalid lithbag', {error: error, 'original input': input});
      }) ? 'Lithbag' : false;
   }

   // *** LITH GENERATION ***

   lith.g = function (input, prod) {

      if (prod || lith.prod) {
         if ((prod || lith.prod) !== true) return log ('lith.g', 'prod or lith.prod must be true or undefined.');
         if (type (input) === 'array' && lith.k.tags.indexOf (input [0]) !== -1) {
            return lith.generateLith (input, true);
         }
         return lith.generateLithbag (input, false, true);
      }

      var inputType = lith.v (input);

      return inputType ? lith ['generate' + inputType] (input) : false;
   }

   lith.generateLithbag = function (lithbag, dontEntityify, prod) {

      var output = '';

      if (dale.stop (lithbag, false, function (v) {

         if (v === undefined) return;

         var typeV = type (v);

         if (type (v) !== 'array') return output += (dontEntityify ? v : lith.entityify (v + '', prod));

         if (prod) output += lith.g (v, prod);
         else {
            var recursiveOutput = lith.g (v, prod);
            if (recursiveOutput === false) return false;
            else output += recursiveOutput;
         }

      }) === false) return false;

      return output;
   }

   lith.generateLith = function (input, prod) {

      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];

      if (input [0] === 'LITERAL') return contents;

      var output = '<' + input [0];

      dale.do (attributes, function (v, k) {
         if (v || v === 0) output += ' ' + lith.entityify (k + '', prod) + '="' + lith.entityify (v + '', prod) + '"';
      });

      output += '>';

      if (type (contents) === 'array') {
         if (prod) output += input [0] === 'style' ? lith.css.g (contents) : lith.g (contents, prod);
         else {
            var recursiveOutput = input [0] === 'style' ? lith.css.g (contents) : lith.g (contents);
            if (recursiveOutput === false) return false;
            output += recursiveOutput;
         }
      }
      else output += lith.generateLithbag (contents, ((input [0] === 'style' || input [0] === 'script') ? true : false), prod);

      if (lith.k.voidTags.indexOf (input [0]) === -1) output += '</' + input [0] + '>';

      return output;
   }

   // *** CSS ***

   lith.css = {};

   // *** LITC VALIDATION ***

   lith.css.v = function (input) {

      if (teishi.stop (['litc or litcbag', input, 'array'], function (error) {
         log ('lith.css.v - Invalid litc or litcbag', {error: error, 'original input': input});
      })) return false;

      if (input.length === 0 || type (input [0]) === 'array') return true;

      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];

      return teishi.v ([
         ['litc length', input.length, {min: 1, max: 3}, teishi.test.range],
         [attributes === undefined, ['length of litc without attributes', input.length, {max: 2}, teishi.test.range]],
         ['litc selector', input [0], 'string'],
         lith.css.vAttributes (attributes),
         [input [0] !== 'LITERAL', ['litc contents', contents, ['undefined', 'array'], 'oneOf']]
      ], function (error) {
         log ('lith.css.v - Invalid litc', {error: error, 'original input': input});
      });
   }

   lith.css.vAttributes = function (attributes) {
      return teishi.v ([
         ['litc attribute values', attributes, ['string', 'integer', 'float', 'object', 'undefined', 'null', 'boolean'], 'eachOf'],
      ]);
   }

   // *** LITC GENERATION ***

   lith.css.g = function (input, selector) {

      if (lith.css.v (input) === false) return false;

      if (input.length === 0) return '';

      var output = '';

      if (input [0] === 'LITERAL') return input [1];

      if (type (input [0]) === 'array') {
         if (dale.stop (input, false, function (v, k) {
            var recursiveOutput = lith.css.g (v, selector);
            if (recursiveOutput === false) return false;
            output += recursiveOutput;
         }) === false) return false;
         else return output;
      }

      if (selector === undefined) selector = '';

      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];

      selector = dale.do (selector.split (/,\s*/), function (v) {
         return dale.do (input [0].split (/,\s*/), function (v2) {
            if (v2.match (/&/)) return v2.replace ('&', v);
            else                return v + (v.length === 0 ? '' : ' ') + v2;
         }).join (', ');
      }).join (', ');

      output += selector + '{';

      var addAttributes = function (attributes) {
         if (lith.css.vAttributes (attributes) === false) return false;
         return dale.stop (attributes, false, function (v, k) {
            if (! v && v !== 0) return;
            var typeV = type (v);
            if (typeV === 'object') return addAttributes (v);
            if (typeV === 'integer' && (v < 0 || v > 1)) v += 'px';
            if (typeV === 'float' || v === 1) v = (v * 100) + '%';
            dale.do (k.split (/,\s*/), function (v2) {
               output += v2 + ':' + v + ';';
            });
         });
      }

      if (addAttributes (attributes) === false) return false;

      output += '}';

      if (contents) {
         var recursiveOutput = lith.css.g (contents, selector);
         if (recursiveOutput === false) return false;
         else output += recursiveOutput;
      }

      return output;
   }

   // *** MEDIA QUERIES ***

   lith.css.media = function (selector, litc) {
      if (teishi.stop (['selector', selector, 'string'])) return false;
      return [['LITERAL', '@media ' + selector + ' {'], litc, ['LITERAL', '}']];
   }

}) ();
