suite('flexigin', function() {

  suite('fx', function() {
    test('calls the main function', function(done) {
      fx('test/components/user/js', function(err) {
        expect(err).to.be(null);
        done();
      });
    });

    test('returns a 404 if the url does not exist', function(done) {
      fx('test/components/user1/js', function(err) {
        expect(err.status).to.be(404);
        done();
      });
    });
  });

  suite('get', function() {
    test('returns the value passed in set', function() {
      fx.set('route', '/basepath/');
      expect(fx.get('route')).to.be('/basepath/');
    });
  });
});