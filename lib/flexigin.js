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