/*
lith - v2.0.4

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to README.md to see what this is about.
*/

(function () {

   // We check for dale and teishi.
   if (typeof exports !== 'undefined') {
      var dale = require ('dale');
      var teishi = require ('teishi');
   }
   else {
      var dale = window.dale;
      var teishi = window.teishi;
   }

   if (dale === undefined || teishi === undefined) {
      console.log ('Both dale and teishi are required.');
      return false;
   }

   // This code allows us to export the lith in the browser and in the server.
   // Taken from http://backbonejs.org/docs/backbone.html
   var root = this;
   var lith;
   if (typeof exports !== 'undefined') {
      lith = exports;
   }
   else {
      lith = root.lith = {};
   }

   // Taken from http://javascript.crockford.com/remedial.html and modified to replace quotes.
   lith.entityify = function (string) {
      if (teishi.stop ({
         compare: string,
         to: 'string',
         test: teishi.test.type,
         label: 'Entityified string'
      })) return false;

      return string
         .replace (/&/g, '&amp;')
         .replace (/</g, '&lt;')
         .replace (/>/g, '&gt;')
         .replace (/"/g, '&quot;')
         .replace (/'/g, '&apos;');
   }

   lith.constants = {};

   lith.constants.lithbag_elements = ['string', 'number', 'array', 'undefined'];

   // Taken from http://www.w3.org/TR/html-markup/elements.html . Added a doctype tag.
   lith.constants.HTML_tags = ['!DOCTYPE HTML', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

   // Taken from http://www.w3.org/TR/html-markup/syntax.html#syntax-elements . Added a doctype tag.
   // Void tags are self-closing tags. The term "void" comes from the W3C specification.
   lith.constants.HTML_void_tags = ['!DOCTYPE HTML', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

   // The if block below ensures that all the void tags are contained in lith.constants.HTML_tags. Uncomment if you want to check it for yourself.
   /*
   if (teishi.stop ({
      compare: lith.constants.HTML_void_tags,
      to: lith.constants.HTML_tags,
      multi: 'each_of',
      label: 'lith void tag'
   })) return false;
   */

   lith.constants.attribute_value = ['string', 'number'];

   // This function is used both for validation and generation of liths. It takes a lith and returns an object with the tag, attributes and contents. It's sole purpose is to identify whether the second element of the lith is the contents instead of the attributes.
   lith.split_lith = function (lith) {
      var output = {tag: lith [0]};
      if (lith.length === 2 && teishi.type (lith [1]) !== 'object') {
         output.contents = lith [1];
      }
      else {
         output.attributes = lith [1];
         output.contents = lith [2];
      }
      return output;
   }

   /*
      The process of validation is done by the function lith.v.

      The process is as follows:
      1) We first check to see if the input is a lith. If it is a lith, lith.v returns 'lith'.
      2) If it's not a lith, we check if it is a lithbag. If it is, lith.v returns 'lithbag'.
      3) If it's neither a lith nor a lithbag, we return false.

      Why do we check them in this order? Because certain inputs can be both interpreted as liths AND lithbags. If that's the case, we want to interpret them as liths instead of lithbags.

      Take the following example: ['p', 'Hey there!']
      If interpreted as a lith, this will generate: <p>Hey there</p>
      If interpreted as a lithbag, this will generate: pHey there!
      We always favor the first interpretation.

      One more thing: the validity checks are not deep. This means that:
      1) When validating the contents of a lith, the array elements are not checked.
      2) When validating the elements of a lithbag, the array elements are not checked.

      This is because lith.g calls itself recursively and only checks the elements that it will transform to HTML in that particular function call.

      A fine point: when doing the validation of a lith (but not while validating a lithbag), we pass true as the second argument of every teishi.stop call, so that we get the error message as a return value from teishi, instead of reporting it immediately to the user. This is because this error message is only relevant if the input turns out to be neither a lith nor a lithbag. If we didn't catch the error message when validating a lith, every time the input was a lithbag, the user would ALWAYS get an error message because the lithbag didn't pass the lith test. However, this error message is useful when the input is neither a lithbag nor a lith, because then we can report the user both errors: both the (first) error that prevents the input from being considered a proper lith, and the (first) error that prevents the input from being considered a proper lithbag.

      lith.v relies on two helper functions: lith.validate_lith and lith.validate_lithbag. Both of them have most of the rules for validating a lith or lithbag; lith.v just does a couple of initial checks and invokes them in order.
   */

   lith.validate_lith = function (input) {
      // We initialize the variables: tag, attributes and contents. Notice that the next four lines are repeated in lith.g.
      var input_lith = lith.split_lith (input);
      var tag = input_lith.tag;
      var attributes = input_lith.attributes;
      var contents = input_lith.contents;

      return teishi.stop ([{
         compare: input.length,
         to: [1, 2, 3],
         multi: 'one_of',
         label: 'lith length',
      }, {
         compare: tag,
         to: lith.constants.HTML_tags,
         multi: 'one_of',
         label: 'lith tag',
      }, {
         compare: attributes,
         to: ['object', 'undefined'],
         multi: 'one_of',
         test: teishi.test.type,
         label: 'lith attributes',
      }, {
         compare: dale.do (attributes, function (v, k) {return k}),
         // Taken from http://razzed.com/2009/01/30/valid-characters-in-attribute-names-in-htmlxml/
         to: /^[a-zA-Z_:][-a-zA-Z\u0080-\uffff_:0-9.]*$/,
         test: teishi.test.match,
         multi: 'each',
         label: 'lith attribute keys',
         label_to: 'start with an ascii letter, underscore or colon, and be followed by ascii letters, underscores, colons, non-ascii characters, numbers or dots.',
      }, {
         compare: dale.do (attributes, function (v) {return v}),
         to: lith.constants.attribute_value,
         test: teishi.test.type,
         multi: 'each_of',
         label: 'lith attribute values'
      }, {
         compare: contents,
         to: lith.constants.lithbag_elements,
         multi: 'one_of',
         test: teishi.test.type,
         label: 'lith contents',
      }], true);
   }

   lith.validate_lithbag = function (input) {
      return teishi.stop ({
         compare: input,
         to: lith.constants.lithbag_elements,
         multi: 'each_of',
         test: teishi.test.type,
         label: 'lithbag element',
      }, true);
   }

   lith.v = function (input) {
      // The input must be an array, whether it is a lith or a lithbag.
      if (teishi.stop ({
         compare: input,
         to: 'array',
         test: teishi.test.type,
         label: 'input to lith'
      })) return false;

      var validate_lith = lith.validate_lith (input);
      // False means that no error was found.
      if (validate_lith [0] === false) {
         return 'lith';
      }
      else {
         var validate_lithbag = lith.validate_lithbag (input);
         if (validate_lithbag [0] === false) {
            return 'lithbag';
         }
         else {
            teishi.e ([
               'Input to lith.g must be either a lith or a lithbag, but it is neither.\n\n',
               'It is not a lith because', validate_lith [1], '\n\n',
               'It is not a lithbag because', validate_lithbag [1]
            ]);
            return false;
         }
      }
   }

   /*
      The process of HTML generation is done by the function lith.g.

      We first call lith.v on the input. These are the possible paths:
      1) If lith.v returns false, it means that the input is invalid. Hence, lith.g returns false.
      2) If lith.v returns 'lith', lith.g calls lith.generate_lith.
         2-1) If lith.generate_lith returns false, lith.g returns false.
         2-2) If lith.generate_lith returns an HTML string, lith.g returns it.
      3) If lith.v returns 'lithbag', lith.g calls lith.generate_lithbag.
         3-1) Same than 2-1) but with generate_lithbag's output.
         3-2) Same than 2-2) but with generate_lithbag's output.

      lith.generate_lith does the following:
      1) Creates a variable named "output" that will be a string containing the generated HTML string.
      2) Invokes lith.split_lith to divide the parts of the lith.
      3) Places the initial "<" and the tag.
      4) Places the attributes, if any.
      5) Places the closing ">" of the tag.
      6) Places the contents:
         6-1) If the contents are an array, they are either a lith or a lithbag. Hence, lith.generate_lith invokes lith.g.
            6-1-1) If lith.g returns a false value, the whole thing returns false.
            6-1-2) If not, we concatenate the returned HTML string to the output.
         6-2) If the contents are not an array, they must be a single lithbag element (either undefined, a string or a number). Hence, we call lith.generate_lithbag.
      7) If the function reaches the end without returning false, it means that the output was valid. We return the "output" variable.

      lith.generate_lithbag does the following:
      1) Creates a variable named "result" that will be a string containing the generated HTML string.
      1) For each element of its input (which always is an array):
         1-1) If it is a string or number, it concatenates it to a "result" string.
         1-2) Depending on the dont_entitify argument being present or not (it is the second argument passed to lith.generate_lithbag), the string/number is entityified or not. This is only useful when generating a <style> tag, because entityfying its contents break the CSS contained in it. This flag is only set to true in step 6-2) of lith.generate_lith.
      2) If it is an array, it calls recursively lith.g.
         2-1) If lith.g returns false, the whole thing returns false.
         2-2) If lith.g returns an HTML string, lith.generate_lithbag appends that result to "result".
      3) If the function reaches the end without returning false, it means that the output was valid. We return the "result" variable.
   */

   lith.generate_lith = function (input) {
      // We initialize the variables: tag, attributes and contents. Notice that the next four lines are repeated in lith.validate_lith
      var input_lith = lith.split_lith (input);
      var tag = input_lith.tag;
      var attributes = input_lith.attributes;
      var contents = input_lith.contents;

      var output;

      // We place the tag.
      output = '<' + tag;

      // We place the attributes.
      dale.do (attributes, function (v, k) {
         // Mind that we entityify both the attribute and the value. Also mind that we use double quotes for enclosing the value. Also also mind that if the value is a number (instead of a string), it will be converted into a string because we're concatenating it to an empty string.
         output += ' ' + lith.entityify (k + '') + '="' + lith.entityify (v + '') + '"';
      });

      // We close the opening tag, whether or not we added attributes.
      output += '>';

      // We create a variable for holding the contents.
      if (teishi.type (contents) === 'array') {
         var result = lith.g (contents);
         if (result === false) return false;
         output += result;
      }
      else {
         // We place the contents. Notice how we set the dont_entityify argument by checking whether the tag is 'style' or not.
         output += lith.generate_lithbag (contents, (tag === 'style' ? true : false));
      }

      // We place the closing tag, if the element is not a void one.
      if (teishi.stop ({
         compare: tag,
         to: lith.constants.HTML_void_tags,
         multi: 'one_of',
         // We turn off the error message, since we don't want to report non-void tags as an error.
      }, true) [0]) output += '</' + tag + '>';

      return output;
   }

   lith.generate_lithbag = function (lithbag, dont_entityify) {
      var result = '';
      if (dale.stop_on (lithbag, false, function (v) {
         // We ignore undefined values.
         if (teishi.type (v) === 'string' || teishi.type (v) === 'number') {
            // We append an empty string to v if we have to entityify it, because lith.entityify only accepts strings and v may be a number.
            result += (dont_entityify ? v : lith.entityify (v + ''));
         }
         if (teishi.type (v) === 'array') {
            var recursive_output = lith.g (v);
            if (recursive_output === false) return false;
            else result += recursive_output;
         }
      }) === false) return false;
      else return result;
   }

   lith.g = function (input) {
      var input_type = lith.v (input);

      // Error messages are provided by lith.v, so we just return false.
      if (input_type === false) return false;

      if (input_type === 'lith') return lith.generate_lith (input);
      else return lith.generate_lithbag (input);
   }

   lith.css = {};

   /*
      lith.css: like lith, but for CSS.

      An litc is an array with the first element as the selector, the second an object, with keys and values. No need to put semicolon in values. keys must be quoted if they have dashes or other characters that make it an invalid javascript identifier.

      Valid input for lith.css.v and lith.css.g is either a litc or an array of litcs.

      No checks are done on either the selectors or the keys and values, aside from their types.
   */

   lith.css.v = function (input) {
      // Input must always be an array, either because it's a litc or an array of litcs.
      if (teishi.stop ({
         compare: input,
         to: 'array',
         test: teishi.test.type,
         label: 'litc or array of litcs'
      })) return false;

      // If the first element of the input is not a string, we're dealing with an array of litcs. Hence, we check that all the elements of the input are arrays and delegate further validation for later.
      if (teishi.type (input [0]) === 'array') {
         if (teishi.stop ({
            compare: input,
            to: 'array',
            multi: 'each',
            test: teishi.test.type,
            label: 'litc or array of litcs'
         })) return false;
         return true;
      }

      // If we're here, we're dealing with a single litc. We check that the length is 2, that the selector is a string and that the attributes are an object, where each value is a string.
      if (teishi.stop ([{
         compare: input.length,
         to: 2,
         label: 'litc',
      }, {
         compare: input [0],
         to: 'string',
         test: teishi.test.type,
         label: 'litc selector',
      }, {
         compare: input [1],
         to: 'object',
         test: teishi.test.type,
         label: 'litc list of properties',
      }, {
         compare: input [1],
         to: 'string',
         multi: 'each',
         test: teishi.test.type,
         label: 'litc property'
      }])) return false;

      return true;
   }

   lith.css.g = function (input) {
      // Error messages are provided by lith.css.v, so we just return false.
      if (lith.css.v (input) === false) return false;

      var output = '';

      if (teishi.type (input [0]) === 'array') {
         // We're dealing with an array of litcs.
         if (dale.stop_on (input, false, function (v) {
            var recursive_output = lith.css.g (v);
            if (recursive_output === false) return false;
            else output += recursive_output;
         }) === false) return false;
      }

      else {
         // We're dealing with an litc itself.

         // First, we append the selector.
         output = input [0] + '{';

         // Then, the properties.
         dale.do (input [1], function (v, k) {
            output += k + ':' + v + ';';
         });

         // We close the brace.
         output += '}';
      }

      // We're done.
      return output;
   }

}).call (this);
