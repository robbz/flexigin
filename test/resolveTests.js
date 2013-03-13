suite('resolve', function() {

	afterEach(function() {
		fx.set('route', '');
	});

	test('does not change a valid component', function() {
		var component = { url: '/one/component/js', type: 'js' };
		var resolved = fx.resolve([component]);
		expect(resolved[0]).to.be(component);
	});

	test('converts a string parameter to a component', function() {
		var resolved = fx.resolve('/one/component/js');
		expect(resolved[0].url).to.be('/one/component/js/');
		expect(resolved[0].type).to.be('js');
	});

	test('converts a string array to components', function() {
		var resolved = fx.resolve(['/one/component/js', '/two/component/js']);
		expect(resolved.length).to.be(2);
		expect(resolved[0].url).to.be('/one/component/js/');
		expect(resolved[1].url).to.be('/two/component/js/');
	});

	test('generates 3 (js,css,html) components from an extensionless parameter', function() {
		var resolved = fx.resolve(['/one/component/']);
		expect(resolved.length).to.be(3);
		expect(resolved[0].url).to.be('/one/component/js/');
		expect(resolved[0].type).to.be('js');
		expect(resolved[1].url).to.be('/one/component/css/');
		expect(resolved[1].type).to.be('css');
		expect(resolved[2].url).to.be('/one/component/html/');
		expect(resolved[2].type).to.be('html');
	});

	test('adds missing slashes', function() {
		var resolved = fx.resolve(['one/component/js']);
		expect(resolved[0].url).to.be('/one/component/js/');
	});

	test('resolves a changed route correctly', function() {
		fx.set('route', '/?component={component}&type={type}');
		var resolved = fx.resolve(['one/component/js']);
		expect(resolved[0].url).to.be('/?component=one/component&type=js');
	});
});