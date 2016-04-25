/*
lith - v3.4.2

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   var dale   = isNode ? require ('dale')     : window.dale;
   var teishi = isNode ? require ('teishi')   : window.teishi;

   if (isNode) var lith = exports;
   else        var lith = window.lith = {};

   var type = teishi.t;

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

   lith.entityify = function (string) {
      if (teishi.stop ('lith.entityify', ['Entityified string', string, 'string'])) return false;

      return string
         .replace (/&/g, '&amp;')
         .replace (/</g, '&lt;')
         .replace (/>/g, '&gt;')
         .replace (/"/g, '&quot;')
         .replace (/'/g, '&#39;')
         .replace (/`/g, '&#96;');
   }

   lith.split = function (input) {
      var attr = type (input [1]) === 'object';
      return [input [0], attr ? input [1] : undefined, attr ? input [2] : input [1]];
   }

   // *** LITH VALIDATION ***

   lith.v = function (input) {

      var validateLith = lith.validateLith (input);
      if (validateLith === true)    return 'lith';

      var validateLithbag = lith.validateLithbag (input);
      if (validateLithbag === true) return 'lithbag';

      return teishi.l ('lith.v', 'Input to lith.g must be either a lith or a lithbag, but it is neither.', 'It is not a lith because', validateLith + '.', 'It is not a lithbag because', validateLithbag + '.');
   }

   lith.validateLithbag = function (input) {
      return teishi.v ([
         ['lithbag', input, lith.k.lithbagElements, 'oneOf'],
         [type (input) === 'array', ['lithbag element', input, lith.k.lithbagElements, 'eachOf']]
      ], true);
   }

   lith.validateLith = function (input) {

      var result = teishi.v ([
         ['lith', input, 'array'],
         function () {
            return ['lith length', input.length, {min: 1, max: 3}, teishi.test.range]
         }
      ], true);

      if (result !== true) return result;

      input = lith.split (input);

      return teishi.v (function () {return [
         ['lith tag', input [0], lith.k.tags, 'oneOf', teishi.test.equal],
         ['lith attributes', input [1], ['object', 'undefined'], 'oneOf'],
         [
            ['lith attribute keys', 'start with an ASCII letter, underscore or colon, and be followed by letters, digits, underscores, colons, periods, dashes, extended ASCII characters, or any non-ASCII characters.'],
            dale.keys (input [1]),
            /^[a-zA-Z_:][a-zA-Z_:0-9.\-\u0080-\uffff]*$/,
            'each', teishi.test.match
         ],
         ['lith attribute values', input [1], ['string', 'integer', 'float', 'undefined'], 'eachOf'],
         ['lith contents', input [2], lith.k.lithbagElements, 'oneOf']
      ]}, true);
   }

   // *** LITH GENERATION ***

   lith.g = function (input) {

      var inputType = lith.v (input);

      if (inputType === false) return false;

      return lith [inputType === 'lith' ? 'generateLith' : 'generateLithbag'] (input);
   }

   lith.generateLithbag = function (lithbag, dontEntityify) {

      var output = '';

      if (dale.stop (lithbag, false, function (v) {

         var typeV = type (v);
         if (typeV === 'string' || typeV === 'integer' || typeV === 'float') {
            output += (dontEntityify ? v : lith.entityify (v + ''));
         }

         if (typeV === 'array') {
            var recursiveOutput = lith.g (v);
            if (recursiveOutput === false) return false;
            else output += recursiveOutput;
         }

      }) === false) return false;

      else return output;
   }

   lith.generateLith = function (input) {

      input = lith.split (input);

      if (input [0] === 'LITERAL') return input [2];

      var output = '<' + input [0];

      dale.do (input [1], function (v, k) {
         if (v !== undefined) output += ' ' + lith.entityify (k + '') + '="' + lith.entityify (v + '') + '"';
      });

      output += '>';

      if (type (input [2]) === 'array') {
         var result = lith.g (input [2]);
         if (result === false) return false;
         output += result;
      }
      else output += lith.generateLithbag (input [2], ((input [0] === 'style' || input [0] === 'script') ? true : false));

      if (lith.k.voidTags.indexOf (input [0]) === -1) output += '</' + input [0] + '>';

      return output;
   }

   // *** CSS ***

   lith.css = {};

   // *** LITC VALIDATION ***

   lith.css.v = function (input) {

      if (type (input) === 'array') {
         if (input.length === 0 || type (input [0] === 'array')) return true;
      }

      if (teishi.stop ([
         ['litc', input, 'array'],
         function () {
            return ['litc length', input.length, {min: 1, max: 3}, teishi.test.range]
         }
      ])) return false;

      input = lith.split (input);

      return teishi.v ([
         ['litc selector', input [0], 'string'],
         lith.css.vAttributes (input [1]),
         ['litc contents', input [2], ['undefined', 'array'], 'oneOf']
      ]);
   }

   lith.css.vAttributes = function (attributes) {
      return teishi.v ([
         ['litc attributes', attributes, ['object', 'undefined'], 'oneOf'],
         ['litc attribute values', attributes, ['string', 'integer', 'float', 'object', 'undefined'], 'eachOf'],
      ]);
   }

   // *** LITC GENERATION ***

   lith.css.g = function (input, selector) {

      if (lith.css.v (input) === false) return false;

      if (input.length === 0) return '';

      var output = '';

      if (type (input [0]) === 'array') {
         if (dale.stop (input, false, function (v, k) {
            var result = lith.css.g (v, selector);
            if (result === false) return false;
            output += result;
         }) === false) return false;
         else return output;
      }

      if (selector === undefined) selector = '';

      input = lith.split (input);

      if (input [0].match (/&/)) selector = input [0].replace ('&', selector);
      else                       selector += (selector.length === 0 ? '' : ' ') + input [0];

      output += selector + '{';

      var addAttributes = function (attributes) {
         if (lith.css.vAttributes (attributes) === false) return false;
         return dale.stop (attributes, false, function (v, k) {
            if (v === undefined) return;
            var typeV = type (v);
            if (typeV === 'object') return addAttributes (v);
            if (typeV === 'integer' && v > 1) v += 'px';
            if (typeV === 'float' || v === 1) v = (v * 100) + '%';
            dale.do (k.split (/,\s*/), function (v2) {
               output += v2 + ':' + v + ';';
            });
         });
      }

      if (addAttributes (input [1]) === false) return false;

      output += '}';

      if (input [2]) {
         var recursiveOutput = lith.css.g (input [2], selector);
         if (recursiveOutput === false) return false;
         else output += recursiveOutput;
      }

      return output;
   }

}) ();
