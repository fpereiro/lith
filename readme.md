# lith

> "You don't want to write HTML and you not don't want to write HTML. This is the right understanding." --Suzuki Roshi

lith is a tool for generating HTML and CSS using javascript object literals. It is meant as an alternative to:

- Writing HTML by hand.
- Using a template system.

## Current status of the project

The current version of lith, v4.5.3, is considered to be *stable* and *complete*. [Suggestions](https://github.com/fpereiro/lith/issues) and [patches](https://github.com/fpereiro/lith/pulls) are welcome. Besides bug fixes, there are no future changes planned.

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

## Usage examples

### Simple tag

```html
<br>
```

```javascript
lith.g (['br'])
```

### Tag with properties and contents

```html
<p id="p3" class="remark">This is a remark</p>
```

```javascript
lith.g (['p', {id: 'p3', class: 'remark'}, 'This is a remark']);
```

### Nested tags

```html
<div id="container"><p class="remark">This is a remark</p></div>
```

```javascript
lith.g (['div', {id: 'container'}, ['p', {class: 'remark'}, 'This is a remark']]);
```

### Table

```html
<table>
   <tr id="row1">
      <td>A1</td>
      <td>B1</td>
   </tr>
   <tr id="row2">
      <td>A2</td>
      <td>B2</td>
   </tr>
</table>
```

```javascript
lith.g (['table', [['A1', 'B1'], ['A2', 'B2']].map (function (v, k) {
   return ['tr', {id: 'row' + (k + 1)}, v.map (function (v2) {
      return ['td', v2];
   })];
})]);
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

Or you can use these links to the latest version - courtesy of [jsDelivr](https://jsdelivr.com).

```html
<script src="https://cdn.jsdelivr.net/gh/fpereiro/dale@ac36810de20ee18d5d5077bd2ccb94628d621e58/dale.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fpereiro/teishi@e1d6313b4269c54d163ac2097d6713d9e9e3f213/teishi.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fpereiro/lith@d1b5b3f9e7207383c335108541cf6942db84adaa/lith.js"></script>
```

And you also can use it in node.js. To install: `npm install lith`

lith is pure ES5 javascript and it should work in any version of node.js (tested in v0.8.0 and above). Browser compatibility is as follows:

- Chrome 15 (released 2011/10/25) and above.
- Firefox 22 (released 2013/02/23) and above.
- Safari 5.1 (released 2011/07/20) and above.
- Internet Explorer 9 (released 2011/03/14) and above.
- Microsoft Edge 14 (released 2016/02/19) and above.
- Opera 11.6 (released 2011/12/07) and above.
- Yandex 14.12 (released 2014/12/11) and above.

The author wishes to thank [Browserstack](https://browserstack.com) for providing tools to test cross-browser compatibility.

<a href="https://www.browserstack.com"><img src="https://bstacksupport.zendesk.com/attachments/token/kkjj6piHDCXiWrYlNXjKbFveo/?name=Logo-01.svg" width="150px" height="33px"></a>

## Liths

An HTML element has three parts:

1. Tag
2. Attributes
3. Contents

The only required part is the tag, since both attributes and contents are optional.

Correspondingly, each lith is an array made of one to three elements:

1. Tag: a string, containing a valid HTML tag. For example, `'br'`.
2. Attributes:
  - Case 1: An object, where each key in the object matches a string, a number or `undefined`. The keys are already strings (since that's how javascript represents object literal keys) and are expected to be so. There is an abstruse rule for validating attribute names (keys), explained in the source code, but you don't need to know it. And attribute values must be either strings, numbers or a falsy value (`undefined`, `null` and `false`). If an attribute value is `undefined`, `null`, `false` or an empty string, the entire attribute will be ignored.
  - Case 2: `undefined`.
3. Contents:
  - Case 1: a lith.
  - Case 2: a lithbag.
  - Case 3: a lithbag element.

A lithbag is an array containing zero or more of the following elements:
- A string.
- A number.
- `undefined`.
- An array containing zero or more of 1) the above elements; 2) liths, 3) lithbags.

However, and in contrast to previous (< 4.0.0) versions of lith, a lithbag can never be an array with its first element being a valid HTML tag. The reason for this is that 1) this allows very fast distinction of liths vs lithbags when running in `prod mode`; and 2) this limitation is seldom a real one and can be easily bypassed.

The recursive definition of a lithbag has the following properties:

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
   [
      ['p'], ['div']
   ]
   ```
   ```javascript
   [
      ['p'], [
         ['div']
      ]
   ]
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

### HTML escapes

lith will escape all special characters (`'&'`, `<`, `>`, `"`, `'` and `` ` ``) when generating HTML. However, the contents of `style` and `script` tags will not be escaped, since those special characters are expected to remain unescaped in both CSS and JS.

If you need to insert a chunk of literal HTML into a lith, you can do it by using the `LITERAL` pseudo-tag:

```javascript
lith.g (['div', [
   ['p', 'Hi'],
   ['LITERAL', '<p>Hello!</p>']
]]);
```

This will generate the following HTML:

```html
<div>
   <p>Hi</p>
   <p>Hello!</p>
</div>
```

### Non-ASCII characters

If you have non-ascii characters in a lith, and you're generating code in the browser, as long as the source file is invoked with the proper encoding, you will have no problem. For example, if scripts.js is saved and transmitted using utf-8, you should include it as:

```html
<script src="scripts.js" charset="utf-8"></script>
```

By the way, if you're generating the HTML with lith, you can do the same with:

```javascript
['script', {src: 'scripts.js', charset: 'utf-8'}]
```

### Usage

lith is made of two core functions:

1. `lith.g`: this function generates HTML from a lith.
2. `lith.v`: a helper function that validates a lith.

The input to both functions is either a lith or a lithbag. In either case, the input can only be a single array.

You don't need to invoke `lith.v`, since `lith.g` validates its own input.

If the input to lith is invalid, `false` is returned. Otherwise, you get a string with HTML.

If the input is invalid, lith will print an error through teishi.

### `prod mode`

Performance wise, `lith.g` spends about 60-80% of its processing time in validating its input. While validation is essential to shorten the debug cycle when developing, in certain cases you might want to turn it off to improve performance.

The cost of turning off validation is that if there's an invalid lith somewhere, an error will be thrown.

The performance gains of `prod mode` will be only noticeable if you're generating thousands of tags.

You can use `prod mode` in two ways:

- Locally, by passing a `true` second parameter to an invocation of `lith.g`.
- Globally, by setting `lith.prod` to `true`. This will affect every subsequent invocation of `lith.g`.

Notice that `prod mode` only affects `lith.g` and not `lith.css.g`. The reasons are two: 1) validation of litcs is less expensive than validation of liths; and 2) it is unlikely that the amount of CSS that you need to generate will be enough to create a performance issue. If, however, you have an use case for this, please [open an issue](https://github.com/fpereiro/lith/issues) and I will consider it.

## litcs

If liths generate HTML, what generates CSS? Well, a **litc**! It's unpronounceable, but I ran out of names.

Let's see a few examples:

### Simple selector

```css
div.links {
   width: 50%;
   height: 50%;
}
```

```javascript
['div.links', {width: .50, height: .50}]
```

```css
a, p {
   font-size: 120%;
}
```

```javascript
['a, p', {'font-size': 1.20}]
```

### Multiple properties for a single value

```css
p {
   padding-top: 10px;
   padding-bottom: 10px;
   padding-left: 5px;
   padding-right: 5px;
}
```

```javascript
['p', {'padding-top, padding-bottom': 10, 'padding-left, padding-right': 5}]
```

### Nested selector

```css
div.links {
   width: 50%;
}

div.links p {
   font-size: 120%;
}
```

```javascript
['div.links', {width: .50}, ['p', {'font-size': 1.20}]]
```

### Nested selector with parent referencing

```css
a {
   font-size: 120%;
}

a:hover {
   color: lime; /* Please don't question my aesthethic choices. */
}
```

```javascript
['a', {'font-size': 1.20}, ['&:hover', {color: 'lime'}]]
```

### CSS Reset

Taken from [Eric Meyer's CSS reset] (http://meyerweb.com/eric/tools/css/reset/).

```javascript
[
   ['html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video', {
      'margin, padding, border': 0,
      'font-size': 1,
      font: 'inherit',
      'vertical-align': 'baseline'
   }],
   ['article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section', {display: 'block'}],
   ['body', {'line-height': '1'}],
   ['ol, ul', {'list-style': 'none'}],
   ['blockquote, q', {quotes: 'none'}],
   ['blockquote:before, blockquote:after, q:before, q:after', {content: "''"}],
   ['blockquote:before, blockquote:after, q:before, q:after', {content: 'none'}],
   ['table', {
      'border-collapse': 'collapse',
      'border-spacing': 0
   }]
];
```

## litc structure

A litc is an array containing three elements:

1. Selector
2. Attributes
3. Contents

The selector is merely a string and it is required. The other two elements are optional.

### litc attributes

The attributes element is either `undefined` or an object where every key is a CSS attribute and its values are either a number, a string or undefined. For example:

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

If an attribute value is set to `undefined`, `null`, `false` or an empty string, the attribute will be ignored. For example:

```javascript
['a', {'font-weight': isHeader ? 'bold' : undefined}]
```

will yield these two CSS rules, depending on whether `isHeader` is truthy or not:

```css
a {font-weight: bold}
```

```css
a {}
```

If an attribute value is set to an integer, it will be considered as a pixel unit, hence the suffix `px` will be added to it. This feature is added because I found out that most of the time where I used integer units, they were pixels.

```javascript
['a', {height: 20}]
```

```css
a {
   height: 20px;
}
```

In the case where you actually want an actual number, without `px` as the attribute value, you need to stringify it.

```javascript
['a', {opacity: '1'}]
```

```css
a {
   opacity: 1;
}
```

There's a very important exception: if you use the number `1`, it will be interpreted as `100%` instead of as `1px` - because the former is much more prevalent than the latter.

```javascript
['div', {width: 1}]
```

```css
div {
   width: 100%;
}
```

If you use a number that's not an integer, it will be multiplied by 100 and a `%` will be appended.

```javascript
['a', {width: .50}]
```

```css
a {
   width: 50%;
}
```

Because Javascript has no true distinction of floats vs integers, if you want to specify a percentage which is a multiple of 100 and larger than `100%`, like `200%` or `300%`, you will need to write it as a string, otherwise it will be interpreted as a pixel unit.

```javascript
['a', {width: '200%', height: 2.0}]
```

```css
a {
   width: 200%;
   height: 2px;
}
```

Of course, if you think that it is better making a percentage or pixel measure explicit, you can also do:

```javascript
['a', {width: '50%', 'font-size': '22px'}]
```

```css
a {
   width: 50%;
   font-size: 22px;
}
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
   width: (960 * 0.40 / 2)
}]
```

```css
a {
   width: 192px;
}
```

### litc contents

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
['div.links', {width: 100}, ['a', {'font-size': 14}]];
```

This litc will generate the CSS above.

Notice that you can place multiple litcs within the contents of another litc. For example:

```javascript
['div.links', {width: 100}, [
   ['a', {'font-size': 14}],
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
['div.links', {width: 100}, [
   ['a', {'font-size': 14}, ['&:hover', {color: 'red'}]]
]];
```

Notice how `&` is replaced by `div.links a`, which is the combined selector of the parent elements of the innermost litc.

The ampersand can be a prefix, a suffix or even be in the middle of a selector. In every case, it will be replaced by the selector of its ancestors.

Multiple CSS selectors will be properly nested. For example, if you want to write:

```css
h2 span, h3 span {
   color: green;
}
```

You can do write it with the following litc:

```javascript
['h2, h3', ['span', {color: 'green'}]]
```

This also works if you use commas in the nested selector:

```css
div h2, div h3 {
   color: green;
}
```

```javascript
['div', ['h2, h3', {color: 'green'}]]
```

You can also use the ampersand and nest multiple selectors as deeply as you want.

```css
div h2:hover, div h3:hover {
   color: green;
}
```

```javascript
['div', ['h2, h3', ['&:hover', {color: 'green'}]]]
```

Writing media queries with litcs is tricky. To sidestep this problem, you can use `lith.css.media`, which will transform your media query into a valid litc.

For example, if you want to write the following media query in the context of a litc:

```css
@media (max-width: 600px) {
   .sidebar {
      display: none;
   }
}
```

You can create it with:

```javascript
var litc = [
   lith.css.media ('(max-width: 600px)', ['.sidebar', {display: 'none'}]),
   // rest of your litc goes here
]
```

`lith.css.media` takes two arguments: a `selector`, which is the media query selector. Notice that you should omit the `@media` part, since the function automatically adds it for you. The second argument is a litc (simple or nested), which will be inserted inside the media query. If you don't pass a valid `selector`, the function will return `false`. The litc is not validated here since it will be validated by `lith.css.g` later.

If you passed valid arguments to `lith.css.media`, the output will always be a litc, which you can use standalone or nest within another one.

### Litc usage

litcs are generated using two core functions:

1. `lith.css.g`: this function generates CSS from a litc.
2. `lith.css.v`: a helper function that validates a litc.

The input to both functions is either a litc or a litcbag. In either case, the input can only be a single array.

You don't need to invoke `lith.css.v`, since `lith.css.g` validates its own input.

If the input to lith is invalid, `false` is returned. Otherwise, you get a string with CSS.

If the input is invalid, lith will print an error through teishi.

If the input to `lith.g` contains anywhere a lith of the following form: `['style', ['div.canvas', {color: 'blue'}]]` (where the second element is an array and presumably a litc), `lith.g` will automatically invoke `lith.css.g` on the litc. The example above, when passed to `lith.g`, will generate `'<style>div.canvas{color:blue;}</style>`. If the contents are an array that is not a valid litc, the entire input will be considered invalid.

## Source code

The complete source code is contained in `lith.js`. It is about 260 lines long.

Below is the annotated source.

```javascript
/*
lith - v4.5.3

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/
```

### Setup

We wrap the entire file in a self-executing anonymous function. This practice is commonly named [the javascript module pattern](http://yuiblog.com/blog/2007/06/12/module-pattern/). The purpose of it is to wrap our code in a closure and hence avoid making the local variables we define here to be available outside of this module. A cursory test indicates that local variables exceed the scope of a file in the browser, but not in node.js. Globals exceed their scope despite this pattern - but we won't be using them.

```javascript
(function () {
```

Since this file must run both in the browser and in node.js, we define a variable `isNode` to check where we are. The `exports` object only exists in node.js.

```javascript
   var isNode = typeof exports === 'object';
```

We require [dale](http://github.com/fpereiro/dale) and [teishi](http://github.com/fpereiro/teishi).

```javascript
   var dale   = isNode ? require ('dale')   : window.dale;
   var teishi = isNode ? require ('teishi') : window.teishi;
```

This is the most succinct form I found to export an object containing all the public members (functions and constants) of a javascript module.

```javascript
   if (isNode) var lith = exports;
   else        var lith = window.lith = {};
```

We create an alias to `teishi.t`, the function for finding out the type of an element. We do the same for `teishi.l`, a function for printing logs that also returns `false`.

```javascript
   var type = teishi.t, log = teishi.l;
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

Although `'!DOCTYPE HTML'` is a declaration and not a tag, we add it to the list of tags anyway, so that we can also generate the doctype with lith. We will also add `'LITERAL'`, which is a pseudo-tag useful for inserting chunks of raw HTML into a lith.

```javascript
      tags: ['!DOCTYPE HTML', 'LITERAL', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
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

Notice we validate the input but only if the second argument is falsy. When `prod mode` is on, we avoid the validation to improve performance.

```javascript
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
```

### Lith validation

We will now proceed to handle the validation of liths.

`lith.v` is the main validation function for liths. It takes an `input`, presumably a lith. This function will return `Lith` if it found a lith, `Lithbag` if it found a lithbag, and `false` if the input is neither.

```javascript
   lith.v = function (input) {
```

We first note the type of the input and store it at `inputType`.

```javascript
      var inputType = type (input);
```

If `input` is an array and its first element is a string which also happens to be a valid HTML tag, we will consider `input` to be a lith! In previous versions of lith, you could write lithbags that started with a valid HTML tag, but it was seldom useful. By explicitly prohibiting it, we can very quickly determine whether `input` is a lith or a lithbag. This also will help to implement a fast `prod mode` when we define `lith.g` later.

```javascript
      if (inputType === 'array' && type (input [0]) === 'string' && lith.k.tags.indexOf (input [0]) !== -1) {
```

We define `attributes` and `contents`. `attributes` must either be an object or invalid. `contents` will be the second or third element of the `lith`, depending on whether we found `attributes` or not.

```javascript
         var attributes = type (input [1]) === 'object' ? input [1] : undefined;
         var contents   = input [attributes ? 2 : 1];
```

We start validating the lith in earnest.

```javascript
         return teishi.v ([
```

A lith has a length of 1 to 3 elements.

```javascript
            ['lith length', input.length, {min: 1, max: 3}, teishi.test.range],
```

If, however, the lith has no attributes, its length can be at most 2, since it will only have a tag and contents.

```javascript
            [attributes === undefined, ['length of lith without attributes', input.length, {max: 2}, teishi.test.range]],
```

We already know that `attributes` is either undefined or an object, because we ensured that when we defined the variable a few lines above. We now proceed to validate its keys.

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
               dale.keys (attributes),
               /^[a-zA-Z_:][a-zA-Z_:0-9.\-\u0080-\uffff]*$/,
               'each', teishi.test.match
            ],
```

Attribute values can be strings, numbers (integers and floats). We also accept `undefined`, `null` and `false` as falsy values that invalidate the property, so we will also accept `undefined`, `null` or `boolean`.

```javascript
            ['lith attribute values', attributes, ['string', 'integer', 'float', 'undefined', 'null', 'boolean'], 'eachOf'],
```

Contents can be any lithbag element: string, integer, float, array and undefined.

```javascript
            ['lith contents', contents, lith.k.lithbagElements, 'oneOf']
```

In case a validation error was found, we will print an informative error. Note we print both the error and the original input, which provides more context.

```javascript
         ], function (error) {
            log ('lith.v - Invalid lith', {error: error, 'original input': input});
```

Those are all the requirements for a valid lith. If it turns out to be valid, we will return the string `'Lith'`, otherwise we will return `false`. After we do that, we also close the conditional.

```javascript
         }) ? 'Lith' : false;
      }
```

If we're here, we can only be dealing with a lithbag (or an invalid input). We proceed to check whether `input` is a valid lithbag.

```javascript
      return teishi.v ([
```

We check that `input` has a type matching those of a valid lithbag element.

```javascript
         ['lithbag', inputType, lith.k.lithbagElements, 'oneOf', teishi.test.equal],
         [inputType === 'array', ['lithbag elements', input, lith.k.lithbagElements, 'eachOf']]
```

In case a validation error was found, we will print an informative error. Note we print both the error and the original input, which provides more context.

```javascript
      ], function (error) {
         log ('lith.v - Invalid lithbag', {error: error, 'original input': input});
```

Depending on whether the validation was successful or not, we return either `'Lithbag'` or `false`. After this, there's nothing else to do, so we close the function.

```javascript
      }) ? 'Lithbag' : false;
   }
```

### Lith generation

We now define `lith.g`, the main function of the library. This library takes an `input` (a lith or lithbag) and returns a string with the corresponding HTML. As a second optional argument, it takes an optional boolean flag, `prod`, to enable `prod mode`.

```javascript
   lith.g = function (input, prod) {
```

`prod mode` is an option that makes `lith.g` to not validate its input. If either `lith.prod` is set to a truthy value (or a truthy value is passed as the second argument to `lith.g`, we will consider that `prod mode` is enabled.

```javascript
      if (prod || lith.prod) {
```

We check that if either of `prod` or `lith.prod` are truthy, they are indeed `true`. We want to avoid a common usage error where multiple parameters are passed to `lith.g` in the hope of generating all of them - `lith.g` only accepts one `input`, and multiple parameters must be wrapped in an array. With this check, we prevent this error, which is compounded by the fact that validation is unwittingly turned off if a truthy second argument is passed.

```javascript
         if ((prod || lith.prod) !== true) return log ('lith.g', 'prod or lith.prod must be true or undefined.');
```

If we're here, bring on the `prod mode`. This means that *we will assume that `input` is either a valid lith or a valid lithbag*. We quickly determine whether `input` is a lith or not. For this we check that `input` is indeed an array with a valid HTML tag as its first element.

```javascript
         if (type (input) === 'array' && lith.k.tags.indexOf (input [0]) !== -1) {
```

If we're here, `input` is a lith. We return an invocation to `lith.generateLith`, passing it both `input` and `true`. The reason we pass a second argument is that because `lith.generateLith` can invoke `lith.g`, we need to preserve the `prod mode` flag in recursive calls.

```javascript
            return lith.generateLith (input, true);
         }
```

If we're here, `input` is a lithbag. We invoke `lith.generateLithbag`. The second argument of the invocation is `false`; we'll explain why below.

```javascript
         return lith.generateLithbag (input, false, true);
      }
```

If we're here, we need to validate our input. We do so and store the result in a variable `inputType`.

```javascript
      var inputType = lith.v (input);
```

Now, because of how we defined `lith.v`, `inputType` can only be `false`, `'Lith'` or `'Lithbag'`. If it is `false`, we will want to return `false`, otherwise we will want to invoke the appropriate function (`lith.generateLith` or `lith.generateLithbag`).

```javascript
      return inputType ? lith ['generate' + inputType] (input) : false;
```

At this point we're done, so we close the function.

```javascript
   }
```

`lith.generateLithbag` takes three arguments: `lithbag`, `dontEntityify` and `prod` (the `prod mode` flag). We will explain the second argument below.

```javascript
   lith.generateLithbag = function (lithbag, dontEntityify, prod) {
```

We initialize a local variable `output` to an empty string, on which we will concatenate the output of the function.

```javascript
      var output = '';
```

We will now iterate through the elements of `lithbag`.

Notice that if `lithbag` is `undefined`, the entire function below will not be executed and `output` will remain being equal to an empty string.

We use `dale.stop` and pass `false` as the second argument because we want to detect invalid lithbag elements and stop if one is found. If an invalid element is found, the inner function passed as third argument to `dale.stop` will return `false`. Other return values will be ignored, because the valid outputs will be concatenated onto the `output` string.

```javascript
      if (dale.stop (lithbag, false, function (v) {
```

If `v` is `undefined`, we return `undefined`.

```javascript
         if (v === undefined) return;
```

We now deal with simple values that are not `undefined` (string, integer and float).

Depending on whether `dontEntityify` is truthy or not, we entityify the element. The reason for the existence of this option is that the contents of `<style>` and `<script>` tags should not be entityified, otherwise the inline CSS or javascript would be broken. So, the only case where `dontEntityify` is truthy is when `lith.generateLith` detects a `script` or `style` tag, and hence invokes `lith.generateLithbag` with a truthy second argument. In every other case where `lith.generateLithbag` is invoked, this argument should remain `false` (which also explains why we set it as `false` in `lith.g` above.


Notice that we coerce `v` into a string before entityifying it, because it may be a number and `lith.entityify` only accepts strings.

```javascript
         if (type (v) !== 'array') return output += (dontEntityify ? v : lith.entityify (v + '', prod));
```

If we're here, the lithbag is an array. we will do a recursive call to `lith.g`. If we're in `prod mode`, we will simply call `lith.g` and concatenate its result to `output`.

```javascript
         if (prod) output += lith.g (v, prod);
```

If `prod` is not enabled, we need to consider the possibility that `lithbag` ins invalid. We will call `lith.g` and store the value of this recursive call into a local variable `recursiveOutput`.

If `recursiveOutput` is `false`, we will return `false` from this inner function, which will in turn also make `lith.generateLithbag` and `lith.g` return `false`. The relevant error message will already have been printed by the recursive call to `lith.g`.

```javascript
         else {
            var recursiveOutput = lith.g (v, prod);
            if (recursiveOutput === false) return false;
```

If the `recursiveOutput` is valid, it will be a string. We will concatenate it to the `output`.

```javascript
            else output += recursiveOutput;
         }
```

If the call to `dale.stop` returned `false`, we found an invalid (array) lithbag, so we return `false`.

```javascript
      }) === false) return false;
```

If we are here, no errors were found, which means that `lithbag` was valid. We return `output` and close the function.

```javascript
      else return output;
   }
```

`lith.generateLith` takes an `input`, a valid lith. The reason I didn't name it `lith` is that I don't want the function to lose the reference to the `lith` object.

```javascript
   lith.generateLith = function (input, prod) {
```

Let's remember that if this function is called, `input` is has to be a valid `lith` (either because it was validated by `lith.g` or because we're in `prod mode` and assume that all inputs are valid).

We now initialize two variables, `attributes` and `contents`. `attributes` will be the second element of `input` if and only if it is of type `object`. Since `contents` can never be an object, there's no source of ambiguity here. And `contents` will be the argument immediately after `atttributes`, which means either the second (where no `attributes` are present) or the third one (when `attributes` are present).

```javascript
      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];
```

If the tag is `'LITERAL'`, we will just return the contents of the lith without any further modifications. Notice that we discard the `attributes` in this case since `'LITERAL'` is merely a pseudo-tag.

```javascript
      if (input [0] === 'LITERAL') return contents;
```

We create a local variable `output` and place in it an opening angle bracket `<`, plus the tag.

```javascript
      var output = '<' + input [0];
```

We iterate the attributes of the lith. If `attributes` is `undefined`, the inner function passed to `dale.do` will not be executed.

```javascript
      dale.do (attributes, function (v, k) {
```

We will discard all attributes that have a falsy value (empty string, `null`, `undefined` and `false`), with the exception of `0`, which can be a perfectly valid attribute value.

For every attribute which has a proper value, we will concatenate it onto `output`.

Mind that we entityify both the key and the value. Also mind that we use double quotes for enclosing the value. Finally, notice that we coerce `k` and `v` into strings before passing them to `lith.entityify`.

```javascript
         if (v || v === 0) output += ' ' + lith.entityify (k + '', prod) + '="' + lith.entityify (v + '', prod) + '"';
      });
```

We close the opening tag, whether or not we added attributes.

```javascript
      output += '>';
```

If the contents of the lith are an array (which means that it must be either a lith or a lithbag):

```javascript
      if (type (contents) === 'array') {
```

If we're in `prod mode`, we will apply either `lith.g` or `lith.css.g` to `contents` and concatenate the result to `output`. We'll invoke `lith.css.g` only if the tag is `style` (otherwise we will consider `contents` to be either a lith or lithbag).

```javascript
         if (prod) output += input [0] === 'style' ? lith.css.g (contents) : lith.g (contents, prod);
```

Otherwise, we will call `lith.g` (or `lith.css.g` if we're dealing with a litc) and store its result in a variable `recursiveOutput`.

```
         else {
            var recursiveOutput = input [0] === 'style' ? lith.css.g (contents) : lith.g (contents);
```

If the call returns `false`, we return `false` as well - the output generated so far will be ignored, because the lith is invalid.

Otherwise, we concatenate the result of the call onto `output`.

```javascript
            if (recursiveOutput === false) return false;
            output += recursiveOutput;
         }
      }
```

If the contents are a string, integer, float or `undefined` (the remaining possibilities), we invoke `lith.generateLithbag`. This function already has the logic for processing the elements of a lithbag.

Notice that if the tag of the lith we are processing is `<style>` or `<script>`, we set the `dontEntityify` argument to `true`, since we don't want to escape HTML entities if we're generating inline CSS or javascript.

Also, there's no error checking here, since if any of these possible elements is passed to the function, no error is possible.

```javascript
      else output += lith.generateLithbag (contents, ((input [0] === 'style' || input [0] === 'script') ? true : false), prod);
```

We place the closing tag if the element is not a void one.

```javascript
      if (lith.k.voidTags.indexOf (input [0]) === -1) output += '</' + input [0] + '>';
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

Either `litcs` or `litcbags` have to be arrays. We validate this and return `false` if it's not the case. Note we print an error message in case of error.

```javascript
      if (teishi.stop (['litc or litcbag', input, 'array'], function (error) {
         log ('lith.css.v - Invalid litc or litcbag', {error: error, 'original input': input});
      })) return false;
```

If the array has length zero, we consider it an empty litcbag, so we return `true`.

If the first element of the `input` is also an array, `input` can only be a litcbag, not a litc, since the first element of a litc is a string. Actually, this could be an invalid element, but we'll leave that check to further recursive calls, instead of doing a deep validation on the spot. In any case, we now return `true`.

```javascript
      if (input.length === 0 || type (input [0]) === 'array') return true;
```

If we're here, we are then dealing with a purported `litc`.

We define `attributes` and `contents`. `attributes` must either be an object or invalid. `contents` will be the second or third element of the `litc`, depending on whether we found `attributes` or not.

```javascript
      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];
```

We now check that `input` should fulfill the requirements for being a valid litc. First of all, it should have length between 1 and 3.

```javascript
      return teishi.v ([
         ['litc length', input.length, {min: 1, max: 3}, teishi.test.range],
```

If, however, the `litc` has no attributes, its length can be at most 2, since it will only have a selector and contents.

```javascript
         [attributes === undefined, ['length of litc without attributes', input.length, {max: 2}, teishi.test.range]],
```

We ensure that the selector is a string, we validate the attributes with a helper function `lith.css.vAttributes`, and we check that the contents are either `undefined` or an array (with the exception of the `LITERAL` pseudo-selector).

```javascript
         ['litc selector', input [0], 'string'],
         lith.css.vAttributes (attributes),
         [input [0] !== 'LITERAL', ['litc contents', contents, ['undefined', 'array'], 'oneOf']]
```

In case of error, we print a message. We close the `teishi.v` call and the function, since there's nothing else to do.

```javascript
      ], function (error) {
         log ('lith.css.v - Invalid litc', {error: error, 'original input': input});
      });
   }
```

`lith.css.vAttributes` (short for `validateAttributes`) consists of a simple call to `teishi.v`, which value we will return. We separate this function from the one above because we will reuse it later.

```javascript
   lith.css.vAttributes = function (attributes) {
      return teishi.v ([
```

We ensure that each of the elements within `attributes` are strings, integers, floats, objects or falsy values (`undefined`, `null` and `false`). If `attributes` is `undefined`, this will be true because an `undefined` value in the context of `eachOf` is equivalent to an empty array.

We then close the call and the function.

```javascript
         ['litc attribute values', attributes, ['string', 'integer', 'float', 'object', 'undefined', 'null', 'boolean'], 'eachOf'],
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

If the first element of `input` is `LITERAL`, we consider the second element of the input to be a string, so we return it.

```javascript
      if (input [0] === 'LITERAL') return input [1];
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
         if (dale.stop (input, false, function (v, k) {
```

We invoke `lith.css.g` recursively, passing the element (`v`) and `selector`.

If `recursiveOutput` is `false` (because `v` was neither a valid litc or litcbag), we return `false`.

If `recursiveOutput` is not `false`, we concatenate it to `output`.

```javascript
            var recursiveOutput = lith.css.g (v, selector);
            if (recursiveOutput === false) return false;
            output += recursiveOutput;
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

We define `attributes` and `contents`. `attributes` must either be an object or invalid. `contents` will be the second or third element of the `litc`, depending on whether we found `attributes` or not.

```javascript
      var attributes = type (input [1]) === 'object' ? input [1] : undefined;
      var contents   = input [attributes ? 2 : 1];
```

We now will generate the proper selector. To do this, we first split the selector by a comma plus whitespace. If there's no commas in the selector, this will be irrelevant, but if they are, doing this will allow us to write the following CSS:

```css
h2 span, h3 span {
   color: green;
}
```

With the following litc:

```javascript
['h2, h3', ['span', {color: 'green'}]]
```

We will set the `selector` to the result of this iteration on the parts of the selector.

```javascript
      selector = dale.do (selector.split (/,\s*/), function (v) {
```

We will also split `input [0]` by a comma plus whitespace, the selector of the current litc and iterate them.

```javascript
         return dale.do (input [0].split (/,\s*/), function (v2) {
```

If there is an ampersand in the selector of the current litc, we make `selector` equal to the current litc, and replacing the ampersand with the original selector. For example:

`original selector: 'a'`

`selector of current litc: '&:hover'`

`new value of selector: 'a:hover'`

```javascript
            if (v2.match (/&/)) return v2.replace ('&', v);
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
            else                return v + (v.length === 0 ? '' : ' ') + v2;
```

We join the results of the inner loop and those of the outer loop to obtain the final selector.

```javascript
         }).join (', ');
      }).join (', ');
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

`addAttributes` takes a single argument `attributes`. It will return either `false` (if it finds an error) or `undefined` (if the input is valid). All output is done by side-effect, because we concatenate it to the outer variable `output`.

```javascript
      var addAttributes = function (attributes) {
```

We first validate the attributes using `lith.css.vAttributes`. This invocation is the reason for splitting `lith.css.vAttributes` into its own function.

If `attributes` is invalid, we return `false`.

```javascript
         if (lith.css.vAttributes (attributes) === false) return false;
```

We are going to iterate `attributes`. If the inner function returns `false`, we will stop the iteration and return `false`. Otherwise, we'll proceed to the last `attributes` and return `undefined`.

```javascript
         return dale.stop (attributes, false, function (v, k) {
```

If the attribute value is falsy, we ignore it (with the exception of `0`, which is falsy but a proper value for an attribute).

```javascript
            if (! v && v !== 0) return;
```

We note the type of `v`.

```javascript
            var typeV = type (v);
```

If the attribute being iterated is an object, we invoke `addAttributes` recursively and return whatever this function call returns. The recursive invocation will handle adding the nested attributes to `output`.

```javascript
            if (type (v) === 'object') return addAttributes (v);
```

If the attribute is an integer, by convention we consider it to be a measure in pixels. Hence, we append `px` to the number.

However, we don't do this for a `0` value since [this is optional](https://www.w3.org/TR/CSS2/syndata.html#length-units) - plus, I prefer to omit it, since it looks cleaner. And we don't do it for `1`, since we consider that to represent `100%`.

```javascript
            if (typeV === 'integer' && (v < 0 || v > 1)) v += 'px';
```

If the attribute is a float (using the very lax definition that a float is something that leaves a remainder after dividing it by one), we consider it to be a percentage measure. Hence, we multiply it by 100 and add a `%` after it.

```javascript
            if (type (v) === 'float')   v = (v * 100) + '%';
```

If the (valid) attribute being iterated is not an object, it must be either a string or a number. This means that this is a terminal value, so we want to add its key and its value to `output`, placing a colon between the key and the value and a trailing semicolon.

However, multiple properties may be contained in the same key. For example, if the key is `padding-top, padding-bottom`, and the value is `0`, we want to generate two css properties, one for each type of padding, both set to the same value. The idea behind this is to take the comma notation of selectors and extrapolate it to properties.

Hence, we'll take the key, split it by a comma (plus optional trailing spaces), and then iterate those properties and add them to `output`. When no commas are present, this will work anyway.

```javascript
            dale.do (k.split (/,\s*/), function (v2) {
               output += v2 + ':' + v + ';';
            });
         });
      }
```

We invoke `addAttributes` passing to it the attributes of the litc. If it returns `false`, we return `false`.

```javascript
      if (addAttributes (attributes) === false) return false;
```

We place the closing brace since we're finished placing attributes.

```javascript
      output += '}';
```

If the litc has contents, we process them.

```javascript
      if (contents) {
```

We make a recursive call to `lith.css.g`, passing the contents of the litc and the selector. We store that value in a local variable `recursiveOutput`.

```javascript
         var recursiveOutput = lith.css.g (contents, selector);
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

Here we define `lith.css.media`, which is a helper function for creating media queries. The reason we need a special function is because media queries, unlike normal CSS, rely on nested blocks.

This function takes a selector and a litc. We validate the selector, which will comprise the core of the media query (namely, the rest of the selector after `'@media'`. We will not validate the litc, since we assume that `lith.css.g` will validate it later in the context of the entire litc being generated. Note that the function will return `false` if `selector` is not a string.

```javascript
   lith.css.media = function (selector, litc) {
      if (teishi.stop (['selector', selector, 'string'])) return false;
```

The trick to generate the nested block is to use the `LITERAL` pseudo-selector to generate the opening and the closing parts of the media query. The closing part is merely a closing curly brace. Surrounded by these two literals, we pass the litc unchanged. This will have the desired effect without modifying the logic of lith.css.g.

Note that we add `'@media' ` at the beginning of the selector. Note also that the output of this function will be a litc.

```javascript
      return [['LITERAL', '@media ' + selector + ' {'], litc, ['LITERAL', '}']];
   }
```

We close the module.

```javascript
}) ();
```

## License

lith is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
