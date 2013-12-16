$ (function () {
   $ ('#input').bind ('input propertychange', function () {
      var html;
      try {
         var html = lith.g (eval (this.value));
         console.log (html);
      }
      catch (error) {
         console.log (error);
      }
      if (html !== false && html !== undefined) {
         $ ('#output_html').removeAttr ('readonly');
         $ ('#output_html').val (html);
         $ ('#output_html').attr ('readonly', 'readonly');
         $ ('#output').html (html);
      }
   });

   $ ('#input').val (JSON.stringify (['h3', {class: 'word'}, 'Surrrrrrfin\' birrrd.']));

   // The five lines above repeat part of the function above. This hack is because I couldn't make jQuery to fire the event when I set the value of #input in the line above.
   var html = lith.g (eval ($ ('#input').val ()));
   $ ('#output_html').removeAttr ('readonly');
   $ ('#output_html').val (html);
   $ ('#output_html').attr ('readonly', 'readonly');
   $ ('#output').html (html);
});
