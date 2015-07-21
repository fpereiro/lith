/*
lith - v3.1.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

To try this example, run `node example.js` and then open `example.html` in your browser.
*/

(function () {

   var isNode = typeof exports === 'object';

   if (isNode) {

      var fs     = require ('fs');
      var dale   = require ('dale');
      var teishi = require ('teishi');
      var lith   = require ('./lith.js');

      fs.writeFileSync ('example.html', lith.g ([
         ['!DOCTYPE HTML'],
         ['html', [
            ['head', [
               ['meta', {charset: 'utf-8'}],
               ['link', {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'}],
               ['style', lith.css.g ([
                  ['textarea', {
                     padding: '5px',
                     width: '90%',
                     height: '200px',
                     'font-family': '"Lucida Console", Monaco, monospace',
                  }],
                  ['#output', {
                     border: 'solid 1px'
                  }]
               ])],
            ]],
            ['body', [
               ['noscript', 'Javascript is deactivated in your browser. Please activate it in order to use this page!'],
               ['div', {class: 'container-fluid'}, [
                  ['div', {class: 'col-xs-6'}, [
                     ['label', 'lith input - insert a valid lith below'], ['br'],
                     ['textarea', {id: 'inputLith'}], ['br'],
                     ['label', 'litc input - insert a valid litc below'], ['br'],
                     ['textarea', {id: 'inputLitc'}], ['br'],
                     ['label', 'Output (will only change if you wrote a valid lith + litc above)'], ['br'],
                     ['textarea', {readonly: 'readonly', id: 'outputText'}], ['br'],
                  ]],
                  ['div', {class: 'col-xs-6'}, [
                     ['label', 'Div containing HTML output (will only change if you wrote a valid lith above)'], ['br'],
                     ['div', {id: 'output'}]
                  ]]
               ]],
               ['script', {src: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'}],
               ['script', {src: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'}],
               ['script', {src: 'node_modules/dale/dale.js'}],
               ['script', {src: 'node_modules/teishi/teishi.js'}],
               ['script', {src: 'lith.js'}],
               ['script', {src: 'example.js'}]
            ]]
         ]]
      ]), {encoding: 'utf8'});

      teishi.l ('Success', 'example.html generated successfully');
   }

   else {

      $ (function () {

         var lith = window.lith;

         $ ('#inputLith, #inputLitc').bind ('input propertychange', function () {
            var result = false;
            try {
               var html = eval ($ ('#inputLith').val ());
               var css  = eval ($ ('#inputLitc').val ());
               var result = lith.g ([['style', lith.css.g (css)], html]);
            }
            catch (error) {
               $ ('#inputLith, #inputLitc').css ({'background-color': 'rgb(201, 48, 44)'});
            }

            if (result !== false) {
               $ ('#outputText').val (result);
               $ ('#output').html (result);
               $ ('#inputLith, #inputLitc').css ({'background-color': 'white'});
            }
         });

         $ ('#inputLith').val (JSON.stringify (['a', 'Surrrrrrrrrrrrfin\' bird']));
         $ ('#inputLitc').val (JSON.stringify (['a', {'font-size': '22px', mixin: {'border-top, border-bottom': 'solid 1px black'}}, ['&:hover', {cursor: 'pointer', color: 'orange'}]]));

         $ ('#inputLith').trigger ('propertychange');
      });
   }

}) ();
