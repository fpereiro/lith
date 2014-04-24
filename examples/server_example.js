// This file, when run with node.js, creates the file client_example.html. This is to give the impression that lith can actually be used for something useful and is production ready.

var dale = require ('dale');
var teishi = require ('teishi');
var lith = require ('../lith.js');
var fs = require ('fs');

fs.writeFileSync ('client_example.html', lith.g ([
   ['!DOCTYPE HTML'],
   ['html', [
      ['head', [
         ['meta', {charset: 'utf-8'}]
      ]],
      ['body', [
         ['noscript', 'Javascript is deactivated in your browser. Please activate it in order to use this page!'],
         ['label', 'lith input - insert a valid lith below'], ['br'],
         ['textarea', {rows: 10, cols: 80, id: 'input'}], ['br'],
         ['label', 'HTML output (will only change if you wrote a valid lith above)'], ['br'],
         ['textarea', {rows: 10, cols: 80, readonly: 'readonly', id: 'output_html'}], ['br'],
         ['label', 'Div containing HTML output (will only change if you wrote a valid lith above)'], ['br'],
         ['div', {id: 'output', style: 'border: solid 1px;'}],
         ['script', {src: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'}],
         ['script', {src: 'https://rawgit.com/fpereiro/dale/master/dale.js'}],
         ['script', {src: 'https://rawgit.com/fpereiro/teishi/master/teishi.js'}],
         ['script', {src: 'https://rawgit.com/fpereiro/lith/master/lith.js'}],
         ['script', {src: 'client_example.js'}]
      ]]
   ]]]), {encoding: 'utf8'});
