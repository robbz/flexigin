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