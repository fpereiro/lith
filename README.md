# lith

> "You don't want to write HTML and you not don't want to write HTML. This is the right understanding." --Suzuki Roshi

lith is a tool for generating HTML from Javascript object literals. It is meant as an alternative to:

- Writing HTML by hand.
- Using a template system.

## Why lith instead of a template system?

I find two problems with existing template systems:

1. The current logic-less approach of popular templating systems is more an obstacle than an advantage. Most often, I find that I need actual logic to generate proper views for my data.
2. The template is a layer that's separate from my javascript code.

lith intends to skirt both of this problems because it consists of javascript object literals. This means that you can incorporate lith straight into your code, having the full power of the language while being able to operate on lith structures (called **liths**).

liths have the following nice properties:
- They can be nested.
- They can be easily generated and manipulated by javascript code.
- They can be stored and transmitted in JSON format.
- Tags are closed and strings are entityified automatically.

## Installation

The dependencies of lith are two:

- [teishi](https://github.com/fpereiro/teishi)
- [dale](https://github.com/fpereiro/dale)

lith is written in Javascript. You can use it in the browser by sourcing the dependencies and the main file:

```html
<script src="teishi.js"></script>
<script src="dale.js"></script>
<script src="lith.js"></script>
```

And you also can use it in node.js. To install: `npm install lith`

## Examples

Before explaining the lith format, I'd like to show you some examples of HTML elements and their corresponding liths.

```html
<br>
```
```javascript
['br']
```

```html
<p id="p3" class="remark">This is a remark</p>
```

```javascript
['p', {id: 'p3', class: 'remark'}, 'This is a remark']
```
```html
<div id="container"><p class="remark">This is a remark</p></div>
```
```javascript
['div', {id: 'container'}, ['p', {class: 'remark'}, 'This is a remark']]
```

## Structure of a lith

An HTML element has three parts:

1. Tag
2. Attributes
3. Contents

Correspondingly, each lith is an array made of three elements:

1. Tag: a string, containing a valid HTML tag. For example, `'br'`.
2. Attributes:
  - Case 1: An object, where each key in the object matches a string or a number. The keys are already strings (since that's how javascript represents object literal keys) and are expected to be so. There is an abstruse rule for validating attribute names (keys), explained in the source code, but you don't need to know it. And attribute values must be either strings or numbers.
  - Case 2: an undefined value.
3. Contents:
  - Case 1: a lith.
  - Case 2: a lithbag.
  - Case 3: a lithbag element.

A lithbag is an array containing zero or more of the following elements:
- A string.
- A number.
- An undefined.
- An array which is either a lithbag or a lith.

This recursive definition of lithbag has the following desirable properties:

1. The most obvious one: you can place an array of liths as the content of a given lith. This is necessary when an element has many children at the same level. For example:

   ```html
   <div><p></p><p></p></div>
   ```
   ```javascript
   ['div', , [['p'], ['p']]]
   ```

2. You can mix liths and literals (strings/numbers) at the same level:

   ```html
   <p>Hola!<br></p>
   ```
   ```javascript
   ['p', ['Hola!', ['br']]]
   ```

3. When generating liths with your code (instead of writing them by hand), you don't have to worry about the level of nestedness of liths. This means that you can push liths into an existing lith, instead of having to concatenate them. For example, the following two liths generate the same code:

   ```javascript
   [['p'], ['div']]
   [['p'], [['div']]]
   ```
   ```html
   <p></p><div></div>
   ```

I know this sounds abstruse, but once you're using lith, you'll notice this all the time.

## Non-ASCII characters

2. If you have non-ascii characters in a lith, and you're generating code in the browser, as long as the source file is invoked with the proper encoding, you will have no problem. For example, if scripts.js is saved and transmitted using utf-8, you should include it as:

```html
<script src="scripts.js" charset="UTF-8"></script>
```

By the way, if you're generating the HTML with lith, you could do the same with:

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

lith will inform if it encountered a validation error through teishi.

## Source code

The complete source code is contained in `lith.js`. It is about 400 lines long.

## lith.css

If you got this far, you may also be interested in using lith to generate CSS.

If liths generate HTML, what generates CSS? Well, a **litc**! It's unpronounceable, but I ran out of names.

A litc is an array, containing two elements: a string, which is the CSS selector, and an object, which is a set of CSS attributes and their corresponding values.

lith can generate css through the function `lith.css.g`. The input to this function is either a litc or a litcbag. A litcbag is an array which contains zero or more arrays - these arrays have to be either litcs or litcbags.

## License

lith is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
