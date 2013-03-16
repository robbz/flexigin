/*!
 * flexigin - v0.0.1
 * (c) Roberto Bez (http://www.devangelist.de)
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * 2013-03-16 
 */
(function(window) {
  var fx = function(components, options, callback) {
    if (typeof components === 'function') {
      components = '/';
      callback = components;
    }
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};    
    components = fx.resolve(components);
    fx.load(components, options, callback);
  };

  fx.set = function(key, value) {
    fx[key] = value;
  };
  fx.get = function(key) {
    return fx[key];
  }

  window.fx = fx;

  if (typeof define !== 'undefined') {
    define(function () {
      return fx;
    });
  } 
})(window);
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
(function(fx, $) {
  var url = function() {
    return {
      build: function(component, type) {
        component = trimSlash(component);
        return (fx.get('route') || '/{component}/{type}/')
          .replace('{component}', component)
          .replace('{type}', type);
      },
      getExtension: function(url) {
        var parts = url.split('/');
        return parts[parts.length - 1];
      }
    }
  };

  var resolve = function(components) {
    var url = fx.url();
    var extensions = ['js', 'css', 'html'];
    var createComponent = function(component, extension) {
      return {
        url: url.build(component, extension), 
        type: extension
      };
    }

    var resolved = [];
    if (typeof components === 'string') {
      components = [components];
    }
    $.each(components, function(key, component) {
      if (typeof component === 'string') {
        var extension = url.getExtension(component);

        // If we got an extensionless url, create a component for each extension.
        if (extensions.indexOf(extension) === -1) {
          $.each(extensions, function(key, extension) {
            resolved.push(createComponent(component, extension));
          });
        } else {
          component = component.substr(0, component.lastIndexOf('/'));
          resolved.push(createComponent(component, extension));
        }
      } else {
        resolved.push(component);
      }
    });
    return resolved;
  };

  var trimSlash = function(text) {
    return text.replace(/^\/+|\/+$/g, '');
  };

  fx.resolve = resolve;
  fx.url = url;
})(fx, jQuery);