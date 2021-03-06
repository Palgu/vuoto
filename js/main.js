/*
 ****** MARKDOWN-IT CONFIGURATOIN ******
 */

var md = window.markdownit({
  html: true,
})
  .use(window.markdownitMark)
  .use(window.markdownitIns)
  .use(window.markdownitContainer, 'box', {

    validate: function(params) {
      return params.trim().match(/^box$/);
      return true;
    },

    render: function(tokens, idx) {
      var m = tokens[idx].info.trim().match(/^box$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<div class="box">';

      } else {
        // closing tag
        return '</div>\n';
      }
    }
  })
  .use(window.markdownitContainer, 'big', {

    validate: function(params) {
      return params.trim().match(/^big$/);
      return true;
    },

    render: function(tokens, idx) {
      var m = tokens[idx].info.trim().match(/^big$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<div class="big">';

      } else {
        // closing tag
        return '</div>\n';
      }
    }
  })





/*
 ****** FUNCTIONS ******
 */

// loads slider
// not more than one slider per chapter
var loadslider = function (selector) {

  var mySwiper = new Swiper (selector, {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })
}


var popola = function(chapters) {

  chapters.forEach(function(el) {

    console.log("--- popola " + el.filename + " ---");
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {

      // create DOM element fot TOC
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = "#"+el.slug;
      a.innerHTML = el.title;
      li.appendChild(a);
      document.querySelector('#toc').appendChild(li);

      // creates DOM element for container in the right position
      let div = document.createElement('div');
      div.classList.add("chapter");
      div.setAttribute("id", el.slug);
      document.querySelector("#content").appendChild(div);

      // returns function with closure on DOM element
      return function() {
        if (this.readyState == 4 && this.status == 200) {
          var html = md.render(this.responseText);
          div.innerHTML = html;

          let selector =  '#' + el.slug+ ' .swiper-container';
          loadslider(selector);

        }
      }
    }());

    oReq.open("GET", "/chapters/" + el.slug + ".md");
    oReq.send();

  })

}




/*
 ****** LOAD CHAPTERS AND STARTUP ******
 */


var chaptersReq = new XMLHttpRequest();
chaptersReq.addEventListener("load", function() {
  if (this.readyState == 4 && this.status == 200) {
    popola(JSON.parse(this.responseText));
  }
});
chaptersReq.open("GET", "/chapters/chapters.json");
chaptersReq.send();
