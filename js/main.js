(function() {
  'use strict';

  // SHOW SEARCH
  var searchIsOpen = true;

  $('#show-search').on('click', toggleSearch);
  $('#search input').on('keyup', function(e) {
    if (e.keyCode === 27) {
      searchIsOpen = false;
      toggleSearch();
    }
  });

  function toggleSearch() {
    searchIsOpen = !searchIsOpen;

    if (searchIsOpen) {
      $('#search').animate({ marginLeft: '1100px', width: '0' });
      $('#search input').blur();
    } else {
      $('#search').animate({ marginLeft: '0', width: '1100px' });
      $('#search input').focus();
    }
  }


  // SUBMIT SEARCH
  function onSearchSubmit(elementId) {
    return function (e) {
      e.preventDefault();
      window.location.href = '/search/?query=' + $(elementId + ' input').val();
    }
  }

  $('#search').on('submit', onSearchSubmit('#search'));
  $('#search-responsive').on('submit', onSearchSubmit('#search-responsive'));


  // CATCH SEARCH TERM
  if (window.location.pathname === '/search/') {
    var idx = lunr(function () {
      this.field('id');
      this.field('content');
      this.field('title', { boost: 10 });
    });

    $.getJSON('/search_data.json').then(function(loaded_data) {
      $.each(loaded_data, function(index, value) {
        idx.add($.extend({ id: index }, value));
      });

      var results = idx.search(window.location.search.replace('?query=', ''));
      var $search_results = $('#search-results');

      $search_results.html('');

      if(results.length) {
        results.forEach(function(result) {
          var item = loaded_data[result.ref];

          var appendString = [
            '<a href="' + item.url + '">',
              '<div class="row">',
                '<div class="col-xs-3">',
                    '<img src="' + item.image + '">',
                '</div>',
                '<div class"col-xs-9">',
                  '<h2>' + item.title + '</h2>',
                  '<h4>' + item.subtitle + '</h4>',
                  '<p>',
                    '<small>',
                      item.author + ' @ ' + item.date + ' | ' + item.categories,
                    '</small>',
                  '</p>',
                '</div>',
                '<div class="col-xs-12">',
                  '<p>' + item.description + '</p>',
                '</div>',
              '</div>',
            '</a>'
          ].join('');

          $search_results.append(appendString);
        });
      } else {
        $search_results.html('No results found');
      }
    });
  }


  // CONTACT FORM
  $('form.contact').on('submit', function(e) {
    e.preventDefault();

    var name = $('#name').val();
    var email = $('#email').val();
    var message = $('#message').val();

    if(formIsValid(email, message, name)) {
      $.ajax({
        url: '//formspree.io/contact@beautyinfull.com',
        method: 'POST',
        dataType: 'json',
        data: {
          from: name,
          email: email,
          message: message
        },
      }).done(function() {
        window.location.href = '/thanks/';
      });
    }
    else {
      $('form.contact button')
        .addClass('animated shake')
        .one(
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {
            $(this).removeClass('animated shake');
          }
        );
    }
  });

  function formIsValid(email, message, name) {
    return emailIsValid(email) > 0 && message.length > 5
      && message.length < 800 && name.length > 0 && name.length < 200;
  }

  function emailIsValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  // NEWSLETTER FORM
  $('form.subscribe').on('submit', function(e) {
    e.preventDefault();

    var name = $('#sub-name').val();
    var email = $('#sub-email').val();

    if(subFormIsValid(email, name)) {
      $.ajax({
        url: '//formspree.io/contact@beautyinfull.com',
        method: 'POST',
        dataType: 'json',
        data: {
          from: name,
          email: email,
          message: 'Please subscribe me to the newsletter'
        },
      }).done(function() {
        var newsletterHtml = [
          '<div class="text-center">',
            '<h1>Thanks</h1>',
            '<p>Your request has been submitted succesfully</p>',
            '<i class="fa fa-thumbs-up"></i>',
          '</div>'
        ].join('');

        $('#newsletter').html(newsletterHtml);
      });
    }
    else {
      $('form.subscribe button')
        .addClass('animated shake')
        .one(
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {
            $(this).removeClass('animated shake');
          }
        );
    }
  });

  function subFormIsValid(email, name) {
    return emailIsValid(email) > 0 && name.length > 0 && name.length < 200;
  }


  // INSTAGRAM
  var instaurl = [
    'https://api.instagram.com/v1/users/930342892/media/recent/?',
    'access_token=930342892.1677ed0.9f25bc22d2b64e5c834c7b24227affa0&count=10'
  ].join('');

  $.get(instaurl, function(res) {
    res.data.forEach(function(instaimg) {
      // add the image to the DOM
    });
  });


  // RESPONSIVE MENU
  $('.parent > a').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var isRemove = $(e.target).closest('.parent').hasClass('opened');

    $('.parent').removeClass('opened');

    if (isRemove) {
      $(e.target).closest('.parent').removeClass('opened');
    } else {
      $(e.target).closest('.parent').addClass('opened');
    }
  });

  $('.responsive-menu').on('click', function (e) {
    if (!$(e.target).closest('.menu-wrap').hasClass('menu-wrap')) {
      $('body').removeClass('menu-opened');
    }
  });

  $('.open-menu').on('click', function (e) {
    $('body').addClass('menu-opened');
  });

  $('.close-menu').on('click', function (e) {
    $('body').removeClass('menu-opened');
  });
})();
