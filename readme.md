# lith

> "You don't want to write HTML and you not don't want to write HTML. This is the right understanding." --Suzuki Roshi

lith is a tool for generating HTML and CSS using javascript object literals. It is meant as an alternative to:

- Writing HTML by hand.
- Using a template system.

## Why lith instead of a template system?

I find two problems with existing template systems:

1. The current logic-less approach of popular templating systems is more an obstacle than an advantage. Most often than not, I find that I need actual logic to generate proper views for my data.
2. The template is a layer that's separate from my javascript code.

lith intends to skirt both of this problems because it consists of javascript object literals. This means that you can incorporate lith straight into your code, having the full power of the language while being able to operate on lith structures (called **liths**).

liths have the following properties:
- They can be nested.
- They can be easily generated and manipulated by javascript code.
- They can be stored and transmitted in JSON format.
- Tags are closed and strings are entityified automatically.

## Usage Examples

```javascript
lith.g (['br']) -> <br>
```

```javascript
lith.g (['p', {id: 'p3', class: 'remark'}, 'This is a remark']) -> <p id="p3" class="remark">This is a remark</p>
```

```javascript
['div', {id: 'container'}, ['p', {class: 'remark'}, 'This is a remark']] -> <div id="container"><p class="remark">This is a remark</p></div>
```

## Installation

The dependencies of lith are two:

- [dale](https://github.com/fpereiro/dale)
- [teishi](https://github.com/fpereiro/teishi)

lith is written in Javascript. You can use it in the browser by sourcing the dependencies and the main file:

```html
<script src="dale.js"></script>
<script src="teishi.js"></script>
<script src="lith.js"></script>
```

And you also can use it in node.js. To install: `npm install lith`

## Structure of a lith

An HTML element has three parts:

1. Tag
2. Attributes
3. Contents

Correspondingly, each lith is an array made of three elements:

1. Tag: a string, containing a valid HTML tag. For example, `'br'`.
2. Attributes:
  - Case 1: An object, where each key in the object matches a string or a number. The keys are already strings (since that's how javascript represents object literal keys) and are expected to be so. There is an abstruse rule for validating attribute names (keys), explained in the source code, but you don't need to know it. And attribute values must be either strings or numbers.
  - Case 2: `undefined`.
3. Contents:
  - Case 1: a lith.
  - Case 2: a lithbag.
  - Case 3: a lithbag element.

A lithbag is an array containing zero or more of the following elements:
- A string.
- A number.
- `undefined`.
- An array which is either a lithbag or a lith.

Notice that since the contents of a lith can be any lithbag element, they can be `undefined`. This means that the only required element in a lith is the tag.

This recursive definition of a lithbag has the following properties:

1. The most obvious one: you can place an array of liths as the content of a given lith. This is necessary when an element has many children at the same level. For example:

   ```html
   <div><p></p><p></p></div>
   ```
   ```javascript
   ['div', [
      ['p'], ['p']
   ]]
   ```

2. You can mix liths and literals (strings/numbers) at the same level:

   ```html
   <p>Hola!<br></p>
   ```
   ```javascript
   ['p', [
      'Hola!', ['br']
   ]]
   ```

3. When generating liths with your code (instead of writing them by hand), you don't have to worry about the level of nestedness of liths. For example, the following two liths generate the same code:

   ```javascript
   [['p'], ['div']]
   [['p'], [['div']]]
   ```
   ```html
   <p></p><div></div>
   ```

   This allows you to create functions that return liths and place them within other liths. For example:

   ```javascript
   var dataset = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];

   function createRows (data) {
      var output = [];
      for (var datum in data) {
         output.push (['tr', [
            ['td', data [datum].id],
            ['td', data [datum].name],
         ]]);
      }
      return output;
   }

   var table = ['table', [
      ['tr', [
         ['th', 'Id'],
         ['th', 'Name']
      ]],
      createRows (dataset)
   ]];

   lith.g (table);
   ```

   This will generate the following HTML:

   ```html
   <table>
      <tr>
        <th>Id</th>
        <th>Name</th>
      </tr>
      <tr>
         <td>1</td>
         <td>a</td>
      </tr>
      <tr>
         <td>2</td>
         <td>b</td>
      </tr>
   </table>
   ```

## Non-ASCII characters

If you have non-ascii characters in a lith, and you're generating code in the browser, as long as the source file is invoked with the proper encoding, you will have no problem. For example, if scripts.js is saved and transmitted using utf-8, you should include it as:

```html
<script src="scripts.js" charset="UTF-8"></script>
```

By the way, if you're generating the HTML with lith, you can do the same with:

```javascript
['script', {src: 'scripts.js', charset: 'UTF-8'}]
```

## Usage

lith is made of two core functions:

1. `lith.g`: this function generates HTML from a lith.
2. `lith.v`: a helper function that validates a lith.

The input to both functions is either a lith or a lithbag. In either case, the input can only be a single array.

You don't need to invoke `lith.v`, since `lith.g` validates its own input.

If the input to lith is invalid, `false` is returned. Otherwise, you get a string with HTML.

If the input is invalid, lith will print an error through teishi.

## litc

If liths generate HTML, what generates CSS? Well, a **litc**! It's unpronounceable, but I ran out of names.

Let's see a few examples:

```css
div.links {
   width: 50%;
}
```

```javascript
['div.links', {width: '50%'}]
```

```css
a, p {
   font-size: 120%;
}
```

```javascript
['a, p', {'font-size': '120%'}]
```

```css
div.links {
   width: 50%;
}

div.links p {
   font-size: 120%;
}
```

```javascript
['div.links', {width: '50%'}, ['p', {'font-size': '120%'}]]
```

```css
a {
   font-size: 120%;
}

a:hover {
   color: lime; /* Please don't question my aesthethic choices. */
}
```

```javascript
['a', {'font-size': '120%'}, ['&:hover', {color: 'lime'}]]
```

A litc is an array containing three elements:

1. Selector
2. Attributes
3. Contents

The selector is merely a string and it is required. The other two elements are optional.

The attributes element is either `undefined` or an object where every key is a CSS attribute and its values are either a number or a string. For example:

```javascript
['a', {
   color: 'lime',
   'font-weight': 'bold'
}]
```

will generate the following CSS:

```css
a {
   color: lime;
   font-weight: bold;
}
```

Actually, the generated CSS would be the above but eliminating all non-semantic whitespace: `a{color:lime;font-weight:bold;}`.

Notice that in the litc above, we surrounded the `font-weight` key with quotes. This is because it contains a dash, and hence you need to explicitly surround it by simple quotes, otherwise you would get a syntax error from the javascript parser. Every CSS property that contains dashes, colons, or other non-alphanumeric characters must be surrounded by quotes.

If the attributes object is `undefined`, we consider the litc to have zero properties.

```javascript
['a']
```

```css
a {}
```

You can use nested attribute objects to reuse CSS properties - this pattern is usually named *mixin*. Let's see an example:

```javascript
var fontProperties = {
   'font-weight': 'bold',
   'font-family': 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif'
}

var litc1 = ['a', {
   color: 'lime',
   fontProperties: fontProperties,
}];

var litc2 = ['p', {
   color: 'gray',
   fontProperties: fontProperties
}];
```

The comprehensive `font-family` property above was taken from [this great resource](http://www.cssfontstack.com).

When we convert `litc1` and `litc2` to CSS, the result will be:

```css
a {
   color: lime;
   font-weight: bold;
   font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;
}

p {
   color: gray;
   font-weight: bold;
   font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;
}
```

The purpose of mixins is to avoid repetition of common groups of CSS properties.

Notice that in the litc mixins, we ignore the *keys* of objects that have another object as its value. The element `fontProperties: fontProperties` could have been written as `foobar: fontProperties` and the output would have been just the same. However, it's probably a good idea to give a descriptive name to this key, for code reading purposes.

Nested mixins are also possible:

```javascript
var mixin1 = {
   'font-family': 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif'
}

var mixin2 = {
   mixin1: mixin1,
   'font-weight': 'bold'
}

var litc1 = ['a', {mixin2: mixin2, color: 'lime'}];
```

When converted to CSS, `litc1` will yield the following CSS:

```css
a {
   font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;
   font-weight: bold;
   color: lime;
}
```

The last thing we have to say about litc attributes is that, since litcs are javascript, you can do math within the attribute values:

```javascript
['a', {
   width: (960 * 0.40 / 2) + 'px'
}]
```

```css
a {
   width: 192px;
}
```

The contents of a litc can be either a litc or a litcbag. A litcbag is an array that contains litcs or litcbags. Notice that a litcbag is almost like a lithbag, only simpler, because it cannot contain simple elements (such as strings or numbers).

Unlike HTML, CSS has no nested elements. However, litcs can be nested. The reason for this is to provide a shorthand for nesting CSS selectors. Let's see an example:

```css
div.links {
   width: 100px;
}

div.links a {
   font-size: 14px;
}
```

Notice that the css above contains two selectors. The first is `'div.links'` and the second is `'div.links a'`. The second selector will only affect `<a>` tags that are within `<div class="links">`.

To express more succintly this pattern of nested selectors (the actual name is [descendant combinators](http://www.w3.org/TR/css3-selectors/#descendant-combinators)), we can write a litc as the contents of another litc.

```javascript
['div.links', {width: '100px'}, ['a', {'font-size': '14px'}]];
```

This litc will generate the CSS above.

Notice that you can place multiple litcs within the contents of another litc. For example:

```javascript
['div.links', {width: '100px'}, [
   ['a', {'font-size': '14px'}],
   ['p', {color: 'red'}]
]];
```

which will generate:

```css
div.links {
   width: 100px;
}

div.links a {
   font-size: 14px;
}

div.links p {
   color: red;
}
```

Nested liths also allow to reference the parent selector by using the ampersand (`&`). Like nested selectors, this feature was taken from [SASS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector). Let's see an example:

```css
div.links {
   width: 100px;
}

div.links a {
   font-size: 14px;
}

div.links a:hover {
   color: red;
}
```

We can generate the same CSS with the following litc:

```javascript
['div.links', {width: '100px'}, [
   ['a', {'font-size': '14px'}, ['&:hover', {color: 'red'}]]
]];
```

Notice how `&` is replaced by `div.links a`, which is the combined selector of the parent elements of the innermost litc.

The ampersand can be a prefix, a suffix or even be in the middle of a selector. In every case, it will be replaced by the selector of its ancestors.

### Litc usage

litcs are generated using two core functions:

1. `lith.css.g`: this function generates CSS from a litc.
2. `lith.css.v`: a helper function that validates a litc.

The input to both functions is either a litc or a litcbag. In either case, the input can only be a single array.

You don't need to invoke `lith.css.v`, since `lith.css.g` validates its own input.

If the input to lith is invalid, `false` is returned. Otherwise, you get a string with CSS.

If the input is invalid, lith will print an error through teishi.

## Source code

The complete source code is contained in `lith.js`. It is about 260 lines long.

Below is the annotated source.

```javascript
/*
lith - v3.0.11

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/
```

### Setup

We wrap the entire file in a self-executing lambda function. This practice is usually named *the javascript module pattern*. The purpose of it is to wrap our code in a closure and hence avoid making our local variables exceed their scope, as well as avoiding unwanted references to local variables from other scripts.

```javascript
(function () {
```

Since this file must run both in the browser and in node.js, we define a variable `isNode` to check where we are. The `exports` object only exists in node.js.

```javascript
   var isNode = typeof exports === 'object';
```

We require [dale](http://github.com/fpereiro/dale) and [teishi](http://github.com/fpereiro/teishi).

```javascript
   var dale   = isNode ? require ('dale')     : window.dale;
   var teishi = isNode ? require ('teishi')   : window.teishi;
```

This is the most succinct form I found to export an object containing all the public members (functions and constants) of a javascript module.

```javascript
   if (isNode) var lith = exports;
   else        var lith = window.lith = {};
```

### Constants

We define an object `lith.k` to hold some constants.

```javascript
   lith.k = {
```

`lith.k.lithbagElements` will hold the possible types of a lithbag element.

```javascript
      lithbagElements: ['string', 'integer', 'float', 'array', 'undefined'],
```

`lith.k.tags` contains [every valid HTML5 tag](http://www.w3.org/TR/html-markup/elements.html). Interestingly enough, there are 108 tags.

Although `'!DOCTYPE HTML'` is a declaration and not a tag, we add it to the list of tags anyway, so that we can also generate the doctype with lith.

```javascript
      tags: ['!DOCTYPE HTML', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
```

`lith.k.voidTags` contains the list of [tags that do not need to be closed](http://www.w3.org/TR/html-markup/syntax.html#syntax-elements), also known as *self-closing tags*. The term "void" comes from the W3C specification.

Notice we also add `'!DOCTYPE HTML'` to this list.

```javascript
      voidTags: ['!DOCTYPE HTML', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
   }
```

Below there's an `if` block that ensures that all the void tags are contained in `lith.k.tags`. If the check is not passed, the rest of lith will not be defined.

Every time I modify the tag constants, I run this code to ensure that there are no tag inconsistencies. However, in production this code is commented out, to save you a few milliseconds. To check that the `voidTags` and the `tags` are consistent, please uncomment the code and run it for yourself.

```javascript
   /*
   if (teishi.stop ([['HTML void tags', 'HTML tags'], lith.k.voidTags, lith.k.tags, 'eachOf', teishi.test.equal])) {
      return false;
   }
   */
```

### Helper functions

`lith.entityify` is a function that takes a string and escapes some characters with their corresponding [HTML entities](http://www.w3.org/TR/2008/WD-html5-20080122/#character).

This function was originally taken from [Douglas Crockford's `entityify`](http://javascript.crockford.com/remedial.html) and modified to replace quotes and backticks, using the approach in [John-David Dalton's lodash](https://github.com/lodash/lodash/blob/93b1e1f5ac72fad0507fc551704b88082a49fa48/lodash.js#L224).

```javascript
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
```

`lith.split` is a helper function that takes a possible lith or litc and splits it into a `tag`, `attributes` and `contents`. We need a special function to do this because both `attributes` and `contents` are optional, and we want to remove this kind of conditional logic from the validation and generation functions.

The function takes an `input` that will be an array of length between 1 and 3 (`input`). All calls to these function will be done with an `input` that has been confirmed to be valid, so this function will not have any validation. As such, if you every use this function directly, be sure to validate its input first.

```javascript
   lith.split = function (input) {
```

If the second element of `input` is an object, we consider that `input` has `attributes`.

```javascript
      var attr = teishi.t (input [1]) === 'object';
```

We return an array with three elements. The second element will be the `attributes`, and the third one will be the `contents`.

```javascript
      return [input [0], attr ? input [1] : undefined, attr ? input [2] : input [1]];
   }
```

### Lith validation

We will now proceed to handle the validation of liths.

`lith.v` is the main validation function for liths. It takes an `input`, presumably a lith.

```javascript
   lith.v = function (input) {
```

First, we try to validate the input as a lith. We store the result of this validation (which can be either `true` or an error message) in the local variable `validateLith`.

Notice that we perform this validation with another function, `lith.validateLith`, which we'll define below.

```javascript
      var validateLith = lith.validateLith (input);
```

If `validateLith` is `true`, we return the string `'lith'`.

```javascript
      if (validateLith === true)    return 'lith';
```

If we're here, `input` can be either a lithbag or invalid. We invoke `lith.validateLithbag` (another function, defined below) and store the result.

If the result is `true`, we return `'lithbag'`.

```javascript
      var validateLithbag = lith.validateLithbag (input);
      if (validateLithbag === true) return 'lithbag';
```

The reason for the order in which we validated `input` as a lith and then a lithbag is because *we want to give priority to considering `input` as a lith in ambiguous cases.*

For example, `['p']` can be considered as either `'<p></p>'` (lith) or as `'p'` (lithbag). By checking if something can be a lith first, and then a lithbag, we favor the first interpretation.

If we reach this point of the function, it's because `input` is neither a lith nor a lithbag. We construct an error message and print it.

Notice that we use `validateLith` and `validateLithbag` to construct the error, since these variables hold each individual error message. This is the reason for which we stored these results in variables.

```javascript
      var error = [
         'lith.v',
         'Input to lith.g must be either a lith or a lithbag, but it is neither.',
         'It is not a lith because'
      ];
      error = error.concat (validateLith);
      error [error.length - 1] += '.'
      error.push ('It is not a lithbag because');
      error = error.concat (validateLithbag);
```

We report the error through `teishi.l` and then return `false` to indicate to the calling function that `input` was invalid. We then close the function.

```javascript
      teishi.l.apply (teishi.l, error);
      return false;
   }
```

`lith.validateLithbag` takes an `input`. It returns `true` if the `input` is a lithbag and `false` otherwise.

```javascript
   lith.validateLithbag = function (input) {
```

The function consists of a single call to [`teishi.v`](https://github.com/fpereiro/teishi#teishiv). We return the value of this call.

```javascript
      return teishi.v ([
```

A lithbag fulfills two conditions:
- It must have a type that's one of the lithbag types: `string`, `integer`, `float`, `array` and `undefined`.
- If it has containing elements (because it is a non-empty array), each of its elements should also have a valid lithbag type.

```javascript
         ['lithbag', input, lith.k.lithbagElements, 'oneOf'],
         [teishi.t (input) === 'array', ['lithbag element', input, lith.k.lithbagElements, 'eachOf']]
```

We will pass `true` as the last argument to `teishi.v`. This enables the teishi `mute` flag, which makes `teishi.v` return an error, instead of printing it, in case the input is invalid.

The reason for which we do this is we don't want the error to be printed automatically, but rather be included in a more comprehensive error message. By setting `mute` to `true`, we allow the calling function to report the error.

There's nothing else to do, so we close the function.

```javascript
      ], true);
   }
```

`lith.validateLithbag` takes an `input`. It returns `true` if the `input` is a lith and `false` otherwise.

```javascript
   lith.validateLith = function (input) {
```

We now check that `input` is an array with length between 1 and 3. We store the result of this check in a local variable `result`.

```javascript
      var result = teishi.v ([
         ['lith', input, 'array'],
         function () {
            return ['lith length', input.length, {min: 1, max: 3}, teishi.test.range]
         }
```

Again, we set the `mute` flag to `true`, to receive an error message instead of printing it directly.

```javascript
      ], true);
```

If `input` is not an array with the proper length, we return `result`, which will hold the corresponding error.

```javascript
      if (result !== true) return result;
```

We pass `input` to `lith.split` and we replace the old value of `input` with the result of this call. Notice that `input` has had enough validation at this point, so we can safely pass it to `lith.split`.

After this, input will always be an array with three elements, a tag, attributes and contents.

```javascript
      input = lith.split (input);
```

We validate the remaining conditions of `input`, to determine whether it is a lith. For this, we invoke `teishi.l` and we return its result.

```javascript
      return teishi.v ([
         function () {return [
```

The tag must be a valid tag.

```javascript
            ['lith tag', input [0], lith.k.tags, 'oneOf', teishi.test.equal],
```

The attributes element must be an object or `undefined`.

```javascript
            ['lith attributes', input [1], ['object', 'undefined'], 'oneOf'],
```

Every attribute key must start with a ASCII letter, underscore or colon, and must follow with zero or more of the following:
- A letter.
- An underscore.
- A colon.
- A digit.
- A period.
- A dash.
- Any Unicode character with a code point of 129 (`0080` in hexadecimal) or above - these include all extended ASCII characters (the top half of the set) and every non-ASCII character.

This is the *abstruse rule* I talked about earlier in the readme. This arcana was kindly provided [by this article](http://razzed.com/2009/01/30/valid-characters-in-attribute-names-in-htmlxml/). The regex below was taken from the article and modified to add the permitted Unicode characters.

```javascript
            [
               ['lith attribute keys', 'start with an ASCII letter, underscore or colon, and be followed by letters, digits, underscores, colons, periods, dashes, extended ASCII characters, or any non-ASCII characters.'],
               dale.keys (input [1]),
               /^[a-zA-Z_:][a-zA-Z_:0-9.\-\u0080-\uffff]*$/,
               'each', teishi.test.match
            ]
```

Attribute values can be strings or numbers (integers and floats).

```javascript
            ['lith attribute values', dale.do (input [1], function (v) {return v}), ['string', 'integer', 'float'], 'eachOf'],
```

Contents can be any lithbag element: string, integer, float, array and undefined.

```javascript
            ['lith contents', input [2], lith.k.lithbagElements, 'oneOf']
         ]}
```

We set the `mute` flag, to return the error message instead of printing it directly.

```javascript
      ], true);
   }
```

### Lith generation

We now define `lith.g`, the main function of the library. This library takes an `input` (a lith or lithbag) and returns a string with the corresponding HTML.

```javascript
   lith.g = function (input) {
```

We call `lith.v` to determine whether `input` is a lith, lithbag or invalid, and store that result in a local variable `inputType`.

```javascript
      var inputType = lith.v (input);
```

If `input` is invalid, `lith.v` already printed the corresponding error, so we just return `false`.

```javascript
      if (inputType === false) return false;
```

In the same way as `lith.v`, `lith.g` relies on two functions (`lith.generateLith` and `lith.generateLithbag`) to deal with liths and lithbags.

We return the results of the corresponding function.

```javascript
      if (inputType === 'lith') return lith.generateLith (input);
      else                      return lith.generateLithbag (input);
   }
```

`lith.generateLithbag` takes two arguments: `lithbag` and `dontEntityify`. We will explain the second argument below.

```javascript
   lith.generateLithbag = function (lithbag, dontEntityify) {
```

We initialize a local variable `output` to an empty string, on which we will concatenate the output of the function.

```javascript
      var output = '';
```

We will now iterate through the elements of `lithbag`.

Notice that if `lithbag` is `undefined`, the entire function below will not be executed and `output` will remain being equal to an empty string.

We use `dale.stopOn` and pass `false` as the second argument because we want to detect invalid lithbag elements and stop if one is found. If an invalid element is found, the inner function passed as third argument to `dale.stopOn` will return `false`. Other return values will be ignored, because the valid output will be concatenated into the `output` string.

```javascript
      if (dale.stopOn (lithbag, false, function (v) {
```

We now deal with simple values (string, integer and float). Notice we deliberately ignore `undefined`, since we don't want it to produce any output.

```javascript
         if (teishi.t (v) === 'string' || teishi.t (v) === 'integer' || teishi.t (v) === 'float') {
```

Depending on whether `dontEntityify` is deactivated or not, we entityify the element. We do this because the contents of `<style>` and `<script>` tags should not be entityified, otherwise the inline CSS or javascript would be broken.

Notice that we coerce `v` into a string before entityifying it, because it may be a number and `lith.entityify` only accepts strings.

```javascript
            output += (dontEntityify ? v : lith.entityify (v + ''));
         }
```

If the lithbag element is an array, we will do a recursive call to `lith.g`, because this element could be either a lith, a lithbag, or invalid.

We will store the value of this recursive call into a local variable `recursiveOutput`.

```javascript
         if (teishi.t (v) === 'array') {
            var recursiveOutput = lith.g (v);
```

If `recursiveOutput` is `false`, we will return `false` from this inner function, which will in turn also make `lith.generateLithbag` and `lith.g` return `false`. The relevant error message will already have been printed by the recursive call to `lith.g`.

```javascript
            if (recursiveOutput === false) return false;
```

If the `recursiveOutput` is valid, it will be a string. We will concatenate it to the `output`.

```javascript
            else output += recursiveOutput;
         }
```

If the call to `dale.stopOn` returned `false`, we found an invalid (array) lithbag, so we return `false`.

```javascript
      }) === false) return false;
```

If we are here, no errors were found. We return `output` and close the function.

```javascript
      else return output;
   }
```

`lith.generateLith` takes an `input`, a valid lith. The reason I didn't name it `lith` is that I don't want the function to lose the reference to the `lith` object.

```javascript
   lith.generateLith = function (input) {
```

We invoke `lith.split` on `input` so that the lith will now have three elements.

```javascript
      input = lith.split (input);
```

We create a local variable `output` and place in it an opening angle bracket `<`, plus the tag.

```javascript
      var output = '<' + input [0];
```

We iterate the attributes of the lith.

```javascript
      dale.do (input [1], function (v, k) {
```

We concatenate the attribute key and the attribute value into `output`, putting a `=` in the middle.

Mind that we entityify both the key and the value. Also mind that we use double quotes for enclosing the value. Finally, notice that we coerce `k` and `v` into strings before passing them to `lith.entityify`.

```javascript
         output += ' ' + lith.entityify (k + '') + '="' + lith.entityify (v + '') + '"';
      });
```

We close the opening tag, whether or not we added attributes.

```javascript
      output += '>';
```

If the contents of the lith are an array (which means that it must be either a lith or a lithbag), we pass it to a recursive call of `lith.g`.

```javascript
      if (teishi.t (input [2]) === 'array') {
         var result = lith.g (input [2]);
```

If the call returns `false`, we return `false` as well - the output generated so far will be ignored, because the lith is invalid.

Otherwise, we concatenate the result of the call into output.

```javascript
         if (result === false) return false;
         output += result;
      }
```

If the contents are a string, integer, float or `undefined` (the remaining possibilities), we invoke `lith.generateLithbag`. This function already has the logic for processing the elements of a lithbag.

Notice that if the tag of the lith we are processing is `<style>` or `<script>`, we set the `dontEntityify` argument to `true`, since we don't want to escape HTML entities if we're generating inline CSS or javascript.

Also, there's no error checking here, since if any of these possible elements is passed to the function, no error is possible.

```javascript
      else {
         output += lith.generateLithbag (input [2], ((input [0] === 'style' || input [0] === 'script') ? true : false));
      }
```

We place the closing tag if the element is not a void one. We use teishi.stop to detect this, and pass a 'true' second argument, so that teishi won't report an error if the tag is not found to be void.

```javascript
      if (teishi.stop (['', input [0], lith.k.voidTags, 'oneOf', teishi.test.equal], true)) {
         output += '</' + input [0] + '>';
      }
```

There's nothing else to do but to return `output` and close the function.

```javascript
      return output;
   }
```

### CSS

We create a `lith.css` object to hold the logic for CSS generation.

```javascript
   lith.css = {};
```

### Litc validation

`lith.css.v` is analogue to `lith.v`: it takes an `input`, and determines whether it is a valid litc or litcbag.

Unlike `lith.v`, `lith.css.v` will hold all the validation logic in itself, instead of relying on helper functions. We do this because of litcs are considerably simpler than liths.

```javascript
   lith.css.v = function (input) {
```

We first try to detect if `input` is a litcbag. A litcbag is an array that contains zero or more litcs or litcbags - in essence, a container of litcs.

```javascript
      if (teishi.t (input) === 'array') {
```

If the array has length zero, we consider it an empty litcbag, so we return `true`.

```javascript
         if (input.length === 0) return true;
```

If the first element of the `input` is also an array, `input` can only be a litcbag, not a litc, since the first element of a litc is a string.

Actually, this could be an invalid element, but we'll leave that check to further recursive calls, instead of doing a deep validation on the spot. In any case, we now return `true`.

```javascript
         if (teishi.t (input [0]) === 'array') return true;
      }
```

We now check that `input` should fulfill the requirements for being a valid litc:
- It should be an array.
- It should have length between 1 and 3.

```javascript
      if (teishi.stop ([
         ['litc', input, 'array'],
         function () {
            return ['litc length', input.length, {min: 1, max: 3}, teishi.test.range]
         }
```

If an error is found, `teishi.stop` will print an error and this function will return `false`.

```javascript
      ])) return false;
```

We now want to make the litc, which can have only two elements (a selector plus attributes, or a selector plus contents) into an array with three elements (selector, attributes, contents).

Because of the similarity between a lith and a litc, we can reuse `lith.split` to do this. Notice also that the last block of validation above is virtually identical to the initial part of `lith.validateLith`.

```javascript
      input = lith.split (input);
```

We will now make the final check on the candidate litc. We will directly return the result of this validation.

```javascript
      return teishi.v ([
```

We ensure that the selector is a string, we validate the attributes with a helper function `lith.css.vAttributes`, and we check that the contents are either `undefined` or an array.

```javascript
         ['litc selector', input [0], 'string'],
         lith.css.vAttributes (input [1]),
         ['litc contents', input [2], ['undefined', 'array'], 'oneOf']
```

We close the call and the function.

```javascript
      ]);
   }
```

`lith.css.vAttributes` (short for `validateAttributes`) consists of a simple call to `teishi.v`, which value we will return. We separate this function from the one above because we will reuse it.

```javascript
   lith.css.vAttributes = function (attributes) {
      return teishi.v ([
```

We ensure that:
- `attributes` is either `undefined` or an object.
- The elements within `attributes` are strings, integers, floats or objects.

We then close the call and the function.

```javascript
         ['litc attributes', attributes, ['object', 'undefined'], 'oneOf'],
         ['litc attribute values', attributes, ['string', 'integer', 'float', 'object'], 'eachOf'],
      ]);
   }
```

### Litc generation

`lith.css.g` is analogue to `lith.g`: it takes an `input`, presumably a litc or litcbag, and returns either `false` or a string with CSS.

This function also takes a "private" argument `selector`, used in recursive calls.

```javascript
   lith.css.g = function (input, selector) {
```

We invoke `lith.css.v`. If it returns `false`, the `input` is invalid, so we just return `false`.

```javascript
      if (lith.css.v (input) === false) return false;
```

If `input` is an empty array, we consider it to be an empty litcbag. We return an empty string.

```javascript
      if (input.length === 0) return '';
```

We define a local variable `output` where we will concatenate the output of the function.

```javascript
      var output = '';
```

If the first element of `input` is also an array, it can only be a litcbag, because the first element of a litc is a selector, which is a string.

```javascript
      if (teishi.t (input [0]) === 'array') {
```

We iterate through the elements of the litcbag. If any of the results of the inner function is `false`, the iteration will be stopped.

```javascript
         if (dale.stopOn (input, false, function (v, k) {
```

We invoke `lith.css.g` recursively, passing the element (`v`) and `selector`.

If the result is `false` (because `v` was neither a valid litc or litcbag), we return `false`.

If the result is not `false`, we concatenate it to `output`.

```javascript
            var result = lith.css.g (v, selector);
            if (result === false) return false;
            output += result;
```

If the iteration returned `false`, it's because we found an error, so we return `false`.

```javascript
         }) === false) return false;
```

If the iteration did not return `false`, we return the `output`.

```javascript
         else return output;
      }
```

`selector` is a string that holds the selectors of litcs that contain the previous litc. For example, if you have a litc `a` and its contents are a litc `b`, when `lith.css.g` receives `b`, `selector` will be equal to the selector of `a`.

As we saw above, the purpose of `selector` is to allow us to express [CSS descendant combinators](http://www.w3.org/TR/css3-selectors/#descendant-combinators).

On any call to `lith.css.g`, `selector` will contain a string with all the selectors of the ancestors, separated by a space.

If the litc currently being processed is not contained in any other litc, the selector will be `undefined`. In this case, we initialize it to an empty string.

```javascript
      if (selector === undefined) selector = '';
```

We apply `lith.split` to `input` so that it will have three elements.

```javascript
      input = lith.split (input);
```

If there is an ampersand in the selector of the current litc, we make `selector` equal to the current litc, and replacing the ampersand with the original selector. For example:

`original selector: 'a'`

`selector of current litc: '&:hover'`

`new value of selector: 'a:hover'`

```javascript
      if (input [0].match (/&/)) selector = input [0].replace ('&', selector)
```

If there's no ampersand in the selector of the current litc, we make `selector` equal to a string that concatenates the old selector and the new one, separated by a space.

`original selector: 'a'`

`selector of current litc: 'span'`

`new value of selector: 'a span'`.

If `selector` is an empty string, the new selector will be concatenated without a space.

`original selector: ''`

`selector of current litc: 'a'`

`new value of selector: 'a'`.

```javascript
      else                       selector += (selector.length === 0 ? '' : ' ') + input [0];
```

We concatenate to `output` the new selector plus an opening curly brace (inside which we'll place the attributes).

```javascript
      output += selector + '{';
```

The attributes of the litc can be either `undefined` or an object. If the attributes are an object, it can have attributes of three kinds:
- Literal attributes, such as `color: 'lime'` or `'font-size': '14px'`. What makes a key literal is that its value is a string or a number.
- Nested attributes, such as `{color: 'lime', 'font-size': '14px'}`. What makes a key nested is that its value is an object which contains further attributes.
- Invalid attributes, such as `color: /lime/`. What makes a key invalid is that its value is neither a string, number or object.

Since attributes can be arbitrarily nested, we need a function (instead of a loop) to process nested attributes recursively. For that purpose, we will define an inner function `addAttributes`.

`addAttributes` takes a single argument `attributes`.

```javascript
      function addAttributes (attributes) {
```

We first validate the attributes using `lith.css.vAttributes`. This invocation is the reason for splitting `lith.css.vAttributes` into its own function.

If `attributes` is invalid, we return `false`.

```javascript
         if (lith.css.vAttributes (attributes) === false) return false;
```

We are going to iterate `attributes`. If the inner function returns `false`, we will stop the iteration and return `false`.

```javascript
         if (dale.stopOn (attributes, false, function (v, k) {
```

If the (valid) attribute being iterated is not an object, it must be either a string or a number. We add its key and its value to `output`, placing a colon between the key and the value and a trailing semicolon.

```javascript
            if (teishi.t (v) !== 'object') {
               output += k + ':' + v + ';';
            }
```

If the attribute being iterated is an object, we invoke `addAttributes` recursively. If this invocation returns `false`, we return `false`. The recursive invocation will handle adding the nested attributes to `output`.

```javascript
            else {
               if (addAttributes (v) === false) return false;
            }
```

If the function returned `false`, we return `false`. If it's not the case, `output` already has all the attributes, since we've been concatenating them to it from inside this function.

```javascript
         }) === false) return false;
      }
```

We invoke `addAttributes` passing to it the attributes of the litc. If it returns `false`, we return `false`.

```javascript
      if (addAttributes (input [1]) === false) return false;
```

We place the closing brace since we're finished placing attributes.

```javascript
      output += '}';
```

If the litc has contents, we process them.

```javascript
      if (input [2]) {
```

We make a recursive call to `lith.css.g`, passing the contents of the litc and the selector. We store that value in a local variable `recursiveOutput`.

```javascript
         var recursiveOutput = lith.css.g (input [2], selector);
```

If the recursive call returned `false`, the contents of the litc are invalid, so the whole litc is invalid. We return `false`.

```javascript
         if (recursiveOutput === false) return false;
```

If the recursive call returned valid output, we concatenate it to the `output`.

```javascript
         else output += recursiveOutput;
      }
```

We return `output` and close the function.

```javascript
      return output;
   }
```

We close the module.

```javascript
}) ();
```

## License

lith is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
