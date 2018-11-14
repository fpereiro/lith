/*
lith - v4.5.3

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

To run the tests, run `node test.js` at the command prompt and then open `test.html` in your browser.
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
         }],
      ];

      var output = [
         ['!DOCTYPE HTML'],
         ['html', [
            ['head', [
               ['meta', {charset: 'utf-8'}],
               ['title', 'lith test'],
               ['style', [
                  cssReset,
                  ['body', {padding: 10}],
                  ['textarea', {
                     padding: 5,
                     width: .90,
                     height: 150,
                     'font-family': '"Lucida Console", Monaco, monospace',
                     'line-height': '2em'
                  }],
                  ['div.main', {
                     width: .50,
                     float: 'left'
                  }],
                  ['label', {
                     'font-weight': 'bold',
                     display: 'block',
                     'margin-top, margin-bottom': 10
                  }],
                  ['div#output', {
                     border: 'solid 1px',
                     padding: 10
                  }],
                  ['textarea#outputText', {
                     'background-color': '#DDDDDD'
                  }]
               ]],
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
                  ['LITERAL', '<div id="output"></div>']
               ]],
               dale.do ([
                  'node_modules/dale/dale.js',
                  'node_modules/teishi/teishi.js',
                  'lith.js',
                  'test.js'
               ], function (v) {
                  return ['script', {src: v}]
               })
            ]]
         ]]
      ];

      if (lith.g (output) !== lith.g (output, true)) throw new Error ('prod mode mismatch!');

      fs.writeFileSync ('test.html', lith.g (output), 'utf8');

      teishi.l ('Success', 'test.html generated successfully');
   }

   else {

      (function () {

         var dale   = window.dale;
         var teishi = window.teishi;
         var lith   = window.lith;

         var log    = teishi.l;

         // *** README EXAMPLES ***

         dale.do ([
            /a/,
            ['p', 222, 222],
            ['p', {}, 2, 3],
            ['p', {class: NaN}],
            ['p', NaN],
            [NaN],
            ['style', ['not', 'a', 'litc']],
            ['div', [
               ['style', [2]],
               ['p', 'something']
            ]]
         ], function (v) {
            if (lith.g (v) !== false) throw new Error ('Invalid input accepted.');
         });

         if (lith.g (['p'], 2) !== false) throw new Error ('Invalid prod parameter accepted.');

         lith.prod = 'yes';
         if (lith.g (['p']) !== false) throw new Error ('Invalid lith.prod parameter accepted.');
         lith.prod = undefined;

         dale.do ([
            /a/,
            ['p', {}, [], []],
            ['p', [], []],
            [/b/],
            ['p', {}, /a/],
            ['p', {}, [/a/]],
            ['p', {attribute: /boom/}]
         ], function (v) {
            if (lith.css.g (v) !== false) throw new Error ('Invalid input accepted.');
         });

         dale.do ([
            [['br'], '<br>'],
            [
               ['p', {id: 'p3', class: 'remark'}, 'This is a remark'],
               '<p id="p3" class="remark">This is a remark</p>'
            ],
            [
               ['div', {id: 'container'}, ['p', {class: 'remark'}, 'This is a remark']],
               '<div id="container"><p class="remark">This is a remark</p></div>'
            ],
            [
               ['table', [['A1', 'B1'], ['A2', 'B2']].map (function (v, k) {
                  return ['tr', {id: 'row' + (k + 1)}, v.map (function (v2) {
                     return ['td', v2];
                  })];
               })],
               '<table><tr id="row1"><td>A1</td><td>B1</td></tr><tr id="row2"><td>A2</td><td>B2</td></tr></table>'
            ],
            [
               ['div', [
                  ['p'], ['p']
               ]],
               '<div><p></p><p></p></div>'
            ],
            [
               ['p', [
                  'Hola!', ['br']
               ]],
               '<p>Hola!<br></p>'
            ],
            [
               [
                  ['p'], ['div']
               ],
               '<p></p><div></div>'
            ],
            [
               [
                  ['p'], [
                     ['div']
                  ]
               ],
               '<p></p><div></div>'
            ],
            [
               (function () {
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

                  return table;
               }) (),
               '<table><tr><th>Id</th><th>Name</th></tr><tr><td>1</td><td>a</td></tr><tr><td>2</td><td>b</td></tr></table>'
            ],
            [
               ['div', [
                  ['p', 'Hi'],
                  ['LITERAL', '<p>Hello!</p>']
               ]],
               '<div><p>Hi</p><p>Hello!</p></div>'
            ],
            [
               ['script', {src: 'scripts.js', charset: 'utf-8'}],
               '<script src="scripts.js" charset="utf-8"></script>'
            ],
            [
               ['style', ['span.action', {color: 'blue'}]],
               '<style>span.action{color:blue;}</style>'
            ],
            [
               ['style', lith.css.g (['span.action', {color: 'blue'}])],
               '<style>span.action{color:blue;}</style>'
            ]
         ], function (v) {
            if (lith.g (v [0]) !== v [1]) throw new Error ('A test failed! ' + v [1]);
         });

         dale.do ([
            [
               ['div.links', {width: .50, height: .50}],
               'div.links{width:50%;height:50%;}'
            ],
            [
               ['a, p', {'font-size': 1.20}],
               'a, p{font-size:120%;}'
            ],
            [
               ['p', {'padding-top, padding-bottom': 10, 'padding-left, padding-right': 5}],
               'p{padding-top:10px;padding-bottom:10px;padding-left:5px;padding-right:5px;}'
            ],
            [
               ['div.links', {width: .50}, ['p', {'font-size': 1.20}]],
               'div.links{width:50%;}div.links p{font-size:120%;}'
            ],
            [
               ['a', {'font-size': 1.20}, ['&:hover', {color: 'lime'}]],
               'a{font-size:120%;}a:hover{color:lime;}'
            ],
            [
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
               ],
               'html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline;}article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section{display:block;}body{line-height:1;}ol, ul{list-style:none;}blockquote, q{quotes:none;}blockquote:before, blockquote:after, q:before, q:after{content:\'\';}blockquote:before, blockquote:after, q:before, q:after{content:none;}table{border-collapse:collapse;border-spacing:0;}'
            ],
            [
               ['a', {
                  color: 'lime',
                  'font-weight': 'bold'
               }],
               'a{color:lime;font-weight:bold;}'
            ],
            [
               ['a'],
               'a{}'
            ],
            [
               ['a', {'font-weight': true ? 'bold' : undefined}],
               'a{font-weight:bold;}'
            ],
            [
               ['a', {'font-weight': false ? 'bold' : undefined}],
               'a{}'
            ],
            [
               ['a', {height: 20}],
               'a{height:20px;}'
            ],
            [
               ['a', {opacity: '1'}],
               'a{opacity:1;}'
            ],
            [
               ['div', {width: 1}],
               'div{width:100%;}'
            ],
            [
               ['a', {width: .50}],
               'a{width:50%;}'
            ],
            [
               ['a', {width: '200%', height: 2.0}],
               'a{width:200%;height:2px;}'
            ],
            [
               ['a', {width: '50%', 'font-size': '22px'}],
               'a{width:50%;font-size:22px;}'
            ],
            [
               (function () {
                  var fontProperties = {
                     'font-weight': 'bold',
                     'font-family': 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif'
                  }
                  return [
                     ['a', {
                        color: 'lime',
                        fontProperties: fontProperties,
                     }],
                     ['p', {
                        color: 'gray',
                        fontProperties: fontProperties
                     }]
                  ];
               }) (),
               'a{color:lime;font-weight:bold;font-family:Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;}p{color:gray;font-weight:bold;font-family:Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;}'
            ],
            [
               (function () {
                  var mixin1 = {
                     'font-family': 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif'
                  }
                  var mixin2 = {
                     mixin1: mixin1,
                    'font-weight': 'bold'
                  }
                  return ['a', {mixin2: mixin2, color: 'lime'}];
               }) (),
               'a{font-family:Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;font-weight:bold;color:lime;}'
            ],
            [
               ['a', {
                  width: (960 * 0.40 / 2)
               }],
               'a{width:192px;}'
            ],
            [
               ['div.links', {width: 100}, ['a', {'font-size': 14}]],
               'div.links{width:100px;}div.links a{font-size:14px;}'
            ],
            [
               ['div.links', {width: 100}, [
                  ['a', {'font-size': 14}],
                  ['p', {color: 'red'}]
               ]],
               'div.links{width:100px;}div.links a{font-size:14px;}div.links p{color:red;}'
            ],
            [
               ['div.links', {width: 100}, [
                  ['a', {'font-size': 14, 'margin-top': -2}, ['&:hover', {color: 'red'}]]
               ]],
               'div.links{width:100px;}div.links a{font-size:14px;margin-top:-2px;}div.links a:hover{color:red;}'
            ],
            [
               ['h2, h3', ['span', {color: 'green'}]],
               'h2, h3{}h2 span, h3 span{color:green;}'
            ],
            [
               ['div', ['h2, h3', {color: 'green'}]],
               'div{}div h2, div h3{color:green;}'
            ],
            [
               [['LITERAL', '@media {'], ['div', ['h2, h3', ['&:hover', {color: 'green'}]]], ['LITERAL', '}']],
               '@media {div{}div h2, div h3{}div h2:hover, div h3:hover{color:green;}}'
            ],
            [
               lith.css.media ('(max-width: 600px)', ['div', ['h2, h3', ['&:hover', {color: 'green'}]]]),
               '@media (max-width: 600px) {div{}div h2, div h3{}div h2:hover, div h3:hover{color:green;}}'
            ]
         ], function (v) {
            if (lith.css.g (v [0]) !== v [1]) throw new Error ('A test failed! ' + v [1]);
         });

         teishi.l ('Finished', 'All tests ran successfully!');

         // *** INTERACTIVE EXAMPLE ***

         window.recalc = function () {

            var result = false;
            try {
               var html = eval (document.getElementById ('inputLith').value);
               var css  = eval (document.getElementById ('inputLitc').value);
               var result = lith.g ([['style', lith.css.g (css)], html], true);
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

         try {
            document.getElementById ('inputLith').value = JSON.stringify ([['h2', ['span', 'The word:']], ['a', {id: 'bird', class: null}, 'Surrrrrrrrrrrrfin\' bird']]);
            document.getElementById ('inputLitc').value = JSON.stringify ([['a', {'font-size': 22, 'font-family': false, mixin: {'border-top, border-bottom': 'solid 1px black'}}, ['&:hover', {cursor: 'pointer', color: 'orange', 'margin-left': .05}]], ['h2, h3', ['span, strong', {display: 'block', margin: 20, 'font-weight': 'bold'}]]]);
            document.getElementById ('inputLith').dispatchEvent (new Event ('change', {'bubbles': true}));

         }
         catch (error) {}

         // *** BENCHMARKING LIGHT METAL ***

         var lightmetal = {prod: [], dev: []};

         dale.do (dale.times (5), function () {

            dale.do (['prod', 'dev'], function (v) {
               var time = Date.now ();

               lith.g (dale.do (dale.times (150), function () {
                  return ['input', {value: 'a'}];
               }), v === 'prod');

               lightmetal [v].push (Date.now () - time);
            });
         });

         dale.do (lightmetal, function (v, k) {
            var sum = 0;
            dale.do (v, function (v2) {sum += v2});
            log ('light metal benchmark', sum / 5 + ' ms', k);
         });

         // *** BENCHMARK HEAVY METAL ***

         var heavymetal = {prod: [], dev: []};

         var i = 0, max = 5000, table = [];

         while (i++ < max) {
            table.push (['td', {class: i}, i]);
         }

         if (lith.g (table, true) !== lith.g (table)) throw new Error ('dev & prod modes mismatch!');

         log ('Starting heavy metal benchmark');

         dale.do (dale.times (5), function () {

            dale.do (['prod', 'dev'], function (v) {

               var time = Date.now ();
               lith.g (table, v === 'prod');

               heavymetal [v].push (Date.now () - time);
            });
         });

         dale.do (heavymetal, function (v, k) {
            var sum = 0;
            dale.do (v, function (v2) {sum += v2});
            log ('heavy metal benchmark', sum / 5 + ' ms', k, '(' + Math.round (max / (sum / 5)) + ' tags per ms)');
         });

         lith.perf = {light: lightmetal, heavy: heavymetal};

      }) ();
   }

}) ();
