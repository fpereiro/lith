/*
lith - v1

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to README.md to see what this is about.

*/

(function () {

   // Useful shorthands.
   JSON.s = JSON.stringify;
   JSON.p = JSON.parse;

   // Taken from http://javascript.crockford.com/remedial.html and modified to add detection of regexes.
   function type (value) {
      var s = typeof value;
      if (s === 'object') {
         if (value) {
            if (Object.prototype.toString.call (value) == '[object Array]') {
               s = 'array';
            }
            if (value instanceof RegExp) {
               s = 'regex';
            }
         } else {
            s = 'null';
         }
      }
      return s;
   }

   /*

   e is the error function.

   It takes zero or more arguments. If the argument is an object or an array, it stringifies it. All arguments are concatenated (with spaces between them) and then printed through console.log (should the console exist).

   e always returns false.

   */

   function e () {
      var output = '';
      for (var argument in arguments) {
         if (type (arguments [argument]) !== 'object' && type (arguments [argument]) !== 'array') {
            output += arguments [argument] + ' ';
         }
         else {
            output += JSON.s (arguments [argument]) + ' ';
         }
      }
      if (output !== '' && console !== undefined) {
         console.log (output);
      }
      return false;
   }

   // http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
   function isInteger (n) {
      return typeof n === 'number' && n % 1 == 0;
   }

   function valueInArray (value, array) {
      for (var iterator = 0; iterator < array.length; iterator++) {
         if (value === array [iterator]) {
            return true;
         }
      }
      return false;
   }

   // Also taken from http://javascript.crockford.com/remedial.html and modified to add single and double quotes, from http://www.w3schools.com/tags/ref_entities.asp
   if (!String.prototype.entityify) {
      String.prototype.entityify = function () {
         return this
            .replace (/&/g, '&amp;')
            .replace (/</g, '&lt;')
            .replace (/>/g, '&gt;')
            .replace (/"/g, '&quot;')
            .replace (/'/g, '&apos;');
      };
   }

   // This piece of code allows us to export the lith in the browser and in the server.
   // Taken from http://backbonejs.org/docs/backbone.html
   var root = this;
   var lith;
   if (typeof exports !== 'undefined') {
      lith = exports;
   }
   else {
      lith = root.lith = {};
   }

   lith.tags = {};

   // Taken from http://www.w3.org/TR/html-markup/elements.html . Added a doctype tag.
   lith.tags.all = ['!DOCTYPE HTML', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

   // Taken from http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
   lith.tags.void = ['!DOCTYPE HTML', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

   lith.v = function (input) {

      // The input must be an array, whether it is a lith, or an array made of liths. If it's not an array, we're sure that the input is invalid.
      if (type (input) !== 'array') {
         return (e ('lith error! Input must be array, either because it is an array of liths or a lith itself. However, it is:', input));
      }

      if (type (input [0]) === 'array') {
         // The first element of the input is an array, so we assume it is an array of liths. Let's check that the rest of the elements of the array are arrays too.
         for (var array in input) {
            if (type (input [array]) !== 'array') {
               return (e ('lith error! First element of input is array, hence the input is an array of liths. However, the element', array, 'is not an array:', input [array]));
            }
         }
         // All elements within the input are arrays, hence we assume this is a valid input. We leave the task of checking each element for when each of them is validated.
         return true;
      }

      // If we're here, it means we're dealing with a lith. We check if the tag is a valid HTML tag.
      if (valueInArray (input [0], lith.tags.all) === false) {
         return (e ('lith error! First element of lith must be a valid HTML tag, but instead is', input [0]));
      }

      // We go on to check the second element of the lith.
      var typeSecond = type (input [1]);
      if (typeSecond !== 'null' && typeSecond !== 'undefined' && typeSecond !== 'object' && input [1] !== '') {
         return (e ('lith error! Second element of input must be either null, undefined, an empty string or an object, but instead is:', input [1]));
      }

      if (typeSecond === 'object') {
         for (var attribute in input [1]) {

            // Taken from http://razzed.com/2009/01/30/valid-characters-in-attribute-names-in-htmlxml/
            if (attribute.match (/^[a-zA-Z_:][-a-zA-Z\u0080-\uffff_:0-9.]*$/) === null) {
               return (e ('lith error! The attribute of a lith must start with an ascii letter, underscore or colon, and be followed by ascii letters, underscores, colons, non-ascii characters, numbers or dots.'));
            }

            if (type (input [1] [attribute]) !== 'string' && type (input [1] [attribute]) !== 'number') {
               return (e ('lith error! All lith attribute values must be strings or numbers but attribute', attribute, 'has value', input [1] [attribute]));
            }
         }
      }

      // We go on to check the third element of the lith.
      var typeThird = type (input [2]);
      if (typeThird !== 'string' && typeThird !== 'array' && typeThird !== 'null' && typeThird !== 'undefined' && typeThird !== 'number') {
         return (e ('lith error! The content of a lith has to be either null, undefined, a string, a number or an array, but is instead', input [2]));
      }
      // All three elements of the lith have been succesfully validated.
      return true;
   }

   lith.g = function (input) {

      if (lith.v (input) === false) {
         // Error messages are provided by lith.v, so we just return false.
         return false;
      }

      var output = '';

      if (type (input [0]) === 'array') {
         // This is an array of liths. Hence, we recursively call lith.g on each of the elements.
         for (var element in input) {
            var recursiveOutput = lith.g (input [element]);
            if (recursiveOutput === false) {
               return false;
            }
            else {
               output += recursiveOutput;
            }
         }
      }

      else {
         // We're dealing with a lith itself.

         // First, the tag.
         output = '<' + input [0];

         // Then, the attributes.
         if (type (input [1]) === 'object') {
            for (var attribute in input [1]) {
               // Mind that we entityify both the attribute and the value. Also mind that we use double quotes for enclosing the value. Also also mind that if the value is a number (instead of a string), it will be converted into a string because we're concatenating it to an empty string.
               output += ' ' + attribute.entityify () + '="' + (input [1] [attribute] + '').entityify () + '"';
            }
         }

         // We close the opening tag, whether or not we added attributes.
         output += '>';

         // Then the contents.

         if (type (input [2]) === 'string' || type (input [2]) === 'number') {
            // We just add the string or number, using the entityify function to escape special characters. As in the attribute value above, we concatenate it with an empty string in case it is a number.
            output += (input [2] + '').entityify ();
         }

         if (type (input [2]) === 'array') {
            for (var element in input [2]) {
               if (type (input [2] [element]) === 'array') {
                  // We're dealing with a lith or an array of liths. We call recursively lith.g on the last element. Notice how the following lines are all copied from above (except for the immediately below this one).
                  var recursiveOutput = lith.g (input [2] [element]);
                  if (recursiveOutput === false) {
                     return false;
                  }
                  else {
                     output += recursiveOutput;
                  }
               }
               else {
                  // We're dealing with a literal value.
                  output += (input [2] [element] + '').entityify ();
               }
            }
         }

         // We place the closing tag, if the element is not a void one.
         if (valueInArray (input [0], lith.tags.void) === false) {
            output += '</' + input [0] + '>';
         }
      }

      // We're done.
      return output;
   }

}).call (this);
