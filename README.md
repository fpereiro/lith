#lith

> "You don't want to write HTML and you not don't want to write HTML. This is the right understanding." --Suzuki Roshi

lith is a tool for generating HTML from Javascript object literals. It is meant as an alternative to:

- Writing HTML by hand.
- Using a template system.

## Rationale

liths map one-to-one to HTML elements, but since they are javascript object literals, they have the following advantages:

- Can be easily generated and manipulated by javascript code.
- Can be stored and transmitted in JSON format.
- Don't require to quote HTML entities (such as `<` and `>`).
- Syntax highlighting allows you to see the extent of the element - plus you don't need to close tags.

## Installation

lith is written in Javascript. You can use it in the browser by sourcing the file.

`<script src="lith.js"></script>`

And you also can use it in node.js. To install: `npm install lith`

## Examples

Before explaining the lith format, I'd like to show you some examples of HTML elements and their corresponding liths.

---

`<br>`

`['br']`

---

`<p id="p3" class="remark">This is a remark</p>`

`['p', {id: 'p3', class: 'remark'}, 'This is a remark']`

---

`<div id="container"><p class="remark">This is a remark</p></div>`

`['div', {id: 'container'}, ['p', {class: 'remark'}, 'This is a remark']]`

---

## Structure of a lith

An HTML element has three parts:

1. Tag
2. Attributes
3. Contents

Correspondingly, each lith is an array made of three elements:

1. Tag: a string, containing a valid HTML tag. For example, 'br'.
2. Attributes:
  - Case 1: An object, where each key in the object matches a string or a number. The keys are already strings (since that's how javascript represents object literal keys) and are expected to be so. There is an abstruse rule for validating attribute names (keys), but you don't need to know it.
  - Case 2: a null value, an undefined value, an empty string, or an empty object. All four are considered to represent the absence of attributes.
3. Contents:
  - Case 1: either a lith or an array of liths.
  - Case 2: a string or a number, which is literally inserted.
  - Case 3: an array where each element is either a) a lith or an array of liths; b) a string or number.
  - Case 4: a null or undefined value.

**Some things worthy of note:**

1. You can place an array of liths as the content of a given lith. This is necessary when an element has many children at the same level. For example:

   `<div><p></p><p></p></div>`
   `['div', , [['p'], ['p']]]`

2. If, for a given element, you want to omit the attributes but put contents, you still have to write an array with three elements, like in the example above. Otherwise, the contents will be taken for the attributes.

3. If you have non-ascii characters in a lith, and you're generating code in the browser, as long as the source file is invoked with the proper encoding, you will have no problem. For example, if scripts.js is saved and transmitted using utf-8, you should include it as:

   `<script src="scripts.js" charset="UTF-8"></script>`

   (By the way, if you're generating the HTML with lith, you could do the same with: `['script', {src: 'scripts.js', charset: 'UTF-8'}]`)

## Usage

lith is made of two functions:

1. **lith.g**: this function generates HTML from a lith.
2. **lith.v**: a helper function that validates a lith.

The input to both functions is either a lith or an array of liths. In both cases, the input can only be a single array.

You don't need to invoke lith.v, since lith.g validates its own input.

If the input to lith is invalid, false is returned. Otherwise, you get a string with HTML.

As a side effect, lith will inform if it encountered a validation error through console.log (available in Chrome, Firebug and node.js).

## Source code

The complete source code is contained in `lith.js`. It is short (< 250 lines) and profusely commented.

## License

lith is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
