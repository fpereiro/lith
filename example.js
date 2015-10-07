/*
lith - v3.3.0

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

      // Taken from http://meyerweb.com/eric/tools/css/reset/ v2.0 | 20110126
      var cssReset = [
         ['html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video', {
            'margin, padding, border': 0,
            'font-size': '100%',
            font: 'inherit',
            'vertical-align': 'baseline'
         }],
         ['article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section', {display: 'block'}],
         ['body', {'line-height': 1}],
         ['ol, ul', {'list-style': 'none'}],
         ['blockquote, q', {quotes: 'none'}],
         ['blockquote:before, blockquote:after, q:before, q:after', {content: "''"}],
         ['blockquote:before, blockquote:after, q:before, q:after', {content: 'none'}],
         ['table', {
            'border-collapse': 'collapse',
            'border-spacing': 0
         }],
      ];

      fs.writeFileSync ('example.html', lith.g ([
         ['!DOCTYPE HTML'],
         ['html', [
            ['head', [
               ['meta', {charset: 'utf-8'}],
               ['title', 'lith example'],
               ['style', lith.css.g ([
                  cssReset,
                  ['body', {padding: '10px'}],
                  ['textarea', {
                     padding: '5px',
                     width: '90%',
                     height: '150px',
                     'font-family': '"Lucida Console", Monaco, monospace',
                     'line-height': '2em'
                  }],
                  ['div.main', {
                     width: '50%',
                     float: 'left'
                  }],
                  ['label', {
                     'font-weight': 'bold',
                     display: 'block',
                     'margin-top, margin-bottom': '10px'
                  }],
                  ['div#output', {
                     border: 'solid 1px',
                     padding: '10px'
                  }],
                  ['textarea#outputText', {
                     'background-color': '#DDDDDD'
                  }]
               ])],
            ]],
            ['body', [
               ['div', {class: 'main'}, [
                  ['label', 'lith input - insert a valid lith below'],
                  ['textarea', {id: 'inputLith', onchange: 'recalc ()', onkeydown: 'recalc ()', onkeyup: 'recalc ()'}],
                  ['label', 'litc input - insert a valid litc below'],
                  ['textarea', {id: 'inputLitc', onchange: 'recalc ()', onkeydown: 'recalc ()', onkeyup: 'recalc ()'}],
                  ['label', 'Output (will only change if you wrote a valid lith + litc above)'],
                  ['textarea', {readonly: 'readonly', id: 'outputText'}],
               ]],
               ['div', {class: 'main'}, [
                  ['label', 'Div containing HTML output (will only change if you wrote a valid lith + litc)'],
                  ['LITERAL', '<div id="output">']
               ]],
               dale.do (['node_modules/dale/dale.js', 'node_modules/teishi/teishi.js', 'lith.js', 'example.js'], function (v) {
                  return ['script', {src: v}]
               })
            ]]
         ]]
      ]), {encoding: 'utf8'});

      teishi.l ('Success', 'example.html generated successfully');
   }

   else {

      (function () {

         var lith = window.lith;

         window.recalc = function () {

            var result = false;
            try {
               var html = eval (document.getElementById ('inputLith').value);
               var css  = eval (document.getElementById ('inputLitc').value);
               var result = lith.g ([['style', lith.css.g (css)], html]);
            }
            catch (error) {
               console.log (error);
               document.getElementById ('inputLith').style ['background-color'] = 'rgb(201, 48, 44)';
               document.getElementById ('inputLitc').style ['background-color'] = 'rgb(201, 48, 44)';
            }

            if (result === false) return;

            document.getElementById ('outputText').value = result;
            document.getElementById ('output').innerHTML = result;
            document.getElementById ('inputLith').style ['background-color'] = 'white';
            document.getElementById ('inputLitc').style ['background-color'] = 'white';
         }

         document.getElementById ('inputLith').value = JSON.stringify (['a', 'Surrrrrrrrrrrrfin\' bird']);
         document.getElementById ('inputLitc').value = JSON.stringify (['a', {'font-size': '22px', mixin: {'border-top, border-bottom': 'solid 1px black'}}, ['&:hover', {cursor: 'pointer', color: 'orange'}]]);

         document.getElementById ('inputLith').dispatchEvent (new Event ('change', {'bubbles': true}));

      }) ();
   }

}) ();
