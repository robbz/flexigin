suite('load', function(){
  beforeEach(function(){
    $('body').append('<div id="user"></div>');
    fx.user = null; // Reset the user loaded from the js file.
  });

  afterEach(function() {
    $('#user').remove();    
  });

  test('loads an exisiting url', function(done){
    fx.load([{ url: '/test/components/user/js', type: 'js' }], null, function(err) {
      expect(err).to.be(null);
      done();
    });
  });
  test('returns a 404 if the url does not exist', function(done){
    fx.load([{ url: '/idonotexist/js', type: 'js' }], null, function(err) {
      expect(err).not.to.be(null);
      expect(err.status).to.be(404);
      done();
    });
  });
  test('executes a js result', function(done){
    fx.user = undefined;
    fx.load([{ url: '/test/components/user/js', type: 'js' }], null, function() {
      expect(fx.user).not.to.be(undefined);
      done();
    });
  });
  test('applies a css result', function(done){
    fx.load([{ url: '/test/components/user/css', type: 'css' }], null, function() {
      expect($('#user').width()).to.be(100);
      done();
    });
  });  
  test('appends the loaded html to a given html-element', function(done){
    fx.load([{ url: '/test/components/user/html', type: 'html' }], { container: '#user' }, function() {
      expect($('#user').html()).not.to.be('');
      done();
    });
  });
  test('appends the loaded html to the body', function(done){
    fx.load([{ url: '/test/components/user/html', type: 'html' }], {}, function() {
      expect($('#user').html()).to.be('');
      expect($('.test-user').length).to.be.greaterThan(0);
      done();
    });
  });  
  test('loads the entire js if no path is given', function(done){
    fx.load([{ url: '/test/components/js', type: 'js' }], {}, function(err) {
      expect(err).to.be(null);
      done();
    });
  });
  test('fills the loaded-property', function(done){
    var component = { url: '/idonotexist1/js', type: 'css' };
    fx.load([component], null, function() {
      expect(fx.loaded).to.contain(component);
      done();
    });
  });

  suite('knockout bindings', function() {
    test('binds (one-way) the viewmodel with automode', function(done){
      fx.load(
      [
        { url: '/test/components/user/html', type: 'html' },
        { url: '/test/components/user/js', type: 'js' }
      ],
      {
        viewModel: function() { return fx.user }
      },
        function() {
        expect($('#test-user #user-name').text()).not.to.be('');
        done();
      });
    });
    test('binds (two-way) the viewmodel with automode', function(done){
      fx.load(
      [
        { url: '/test/components/user/html', type: 'html' },
        { url: '/test/components/user/js', type: 'js' }],
      {
        viewModel: function() { return fx.user }
      },
      function() {
        fx.user.email('test@domain.tld');
        expect($('#test-user #user-email').val()).to.be('test@domain.tld');
        // Change the value field and call change to update the observable.
        $('#test-user #user-email').val('changed@domain.tld').change();
        expect(fx.user.email()).to.be('changed@domain.tld');
        done();
      });
    });
  });
});

suite("query", function() {
  var query;

  beforeEach(function() {
    query = fx.query();
  });

  test("creates a query-object", function() {
    expect(query.hasOwnProperty('add')).to.be(true);
    expect(query.hasOwnProperty('run')).to.be(true);
  });

  suite("add", function() {
    test("fills the query", function() {        
      var component = { url: '/idonotexist1/js', type: 'css' };
      query.add(component);
      expect(query.isEmpty()).to.be(false);
    });
    test("prevents from adding the same item two times", function() {
      var component = { url: '/idonotexist1/js', type: 'css' };
      query.add(component);
      query.add(component);
      expect(query.length()).to.be(1);
    });
  });

  suite("run", function() {
    test("runs the query", function(done) {
      query.run(query, function() {
        done();
      });
    });
    test("returns an error if the url does not exist", function(done) {
      query.add({url: '/idonotexist2/js', type: 'js' });
      query.run(null, function(err) {
        expect(err).to.not.be(null);
        done();
      });
    });
  });
});