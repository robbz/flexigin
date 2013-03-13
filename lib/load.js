(function(fx, $) {
  var load = function(components, options, callback) {
    options = options || {};

    var query = fx.query();
    $.each(components, function(key, component) {
      query.add(component, options);
    });
    if (query.isEmpty()) {
      callback();
      return;
    }
    query.run(options, callback);
  };

  fx.loaded = [];
  var query = function() {
    var query = [];
    var loader = this;
    var deferreds = getDeferreds();
    return {
      add: function(component, options) {
        if (fx.loaded.indexOf(component) !== -1) {
          return;
        }
        query.push(deferreds[component.type](component.url, options));
        loader.loaded.push(component);
      },
      run: function(options, callback) {
        var onLoad = function(data) {
          if (typeof ko !== 'undefined' && typeof options.viewModel !== 'undefined') {
            var viewModel = options.viewModel();    
            if (viewModel.hasOwnProperty('init')) {
              viewModel.init();
            }
            ko.applyBindings(viewModel, $(options.container || 'body')[0]);
          }
          callback(null, data);
        };
        $.when.apply($, query)
          .done(onLoad)
          .fail(callback);
      },
      length: function() {
        return query.length;
      },
      isEmpty: function() {
        return query.length === 0;
      }
    }
  };

  var getDeferreds = function() {
    return {
      html: function(url, options) {
        var onLoad = function(html) {
          $(options.container || 'body').append(html);
        };
        return $.get(url).done(onLoad);
      },
      css: function(url) {
        var onLoad = function(css) {
          $('head').append('<style>' + css + '</style>');
        };
        return $.get(url).done(onLoad);
      },
      js: function(url) {
        return $.getScript(url);
      }
    };
  };

  fx.load = load;
  fx.query = query;
})(fx, jQuery);