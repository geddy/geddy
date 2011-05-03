// Alias context and describe
foounit.addKeyword('context', foounit.keywords.describe);

foounit.load(':src/model');
foounit.load(':util/date');
foounit.load(':util/meta');
foounit.load(':util/string');

foounit.add(function (kw) { with (kw) {
  context('model', function () {

    var ByTor;

    geddy.model.reg = {};
    geddy.model.reg.ByTor = function () {
      this.property('numberProp', 'number');
      this.property('intProp', 'int');
      this.property('objectProp', 'object');
      this.property('arrayProp', 'array');
      this.property('dateProp', 'date');
      this.property('datetimeProp', 'datetime');
      this.property('timeProp', 'time');
    };

    geddy.model.registerModel('ByTor');

    ByTor = geddy.model.reg.ByTor;

    describe(".allOptional", function () {
      it('creates a model instance', function () {
        var params = {};
        var byTor = ByTor.create(params);
        expect(byTor.valid()).to(beTrue);
      });
    });

    describe(".number", function () {
      it('tests number properties', function () {
        var byTor;
        // Actual number, valid
        byTor = ByTor.create({numberProp: 2112});
        expect(byTor.valid()).to(beTrue);

        // Numeric string, valid
        byTor = ByTor.create({numberProp: '2112'});
        expect(byTor.valid()).to(beTrue);

        // Non-numeric string, error
        byTor = ByTor.create({numberProp: 'Snow Dog'});
        expect(byTor.errors.numberProp).toNot(beUndefined);
      });
    });

    describe(".int", function () {
      it('tests int properties', function () {
        var byTor;
        // Actual int, valid
        byTor = ByTor.create({intProp: 2112});
        expect(byTor.valid()).to(beTrue);

        // Actual int, valid
        byTor = ByTor.create({intProp: '2112'});
        expect(byTor.valid()).to(beTrue);

        // Float with zero decimal, valid
        byTor = ByTor.create({intProp: 2112.0});
        expect(byTor.valid()).to(beTrue);

        // Float with greater-than-zero decimal, error
        byTor = ByTor.create({intProp: 2112.2112});
        expect(byTor.errors.intProp).toNot(beUndefined);

        // Non-numeric string, error
        byTor = ByTor.create({intProp: 'away from here'});
        expect(byTor.errors.intProp).toNot(beUndefined);
      });
    });

    describe(".object", function () {
      it('tests object properties', function () {
        var byTor;
        // Actual Object, valid
        byTor = ByTor.create({objectProp: {}});
        expect(byTor.valid()).to(beTrue);

        // Sure, technically Arrays are Objects, but this still isn't right
        byTor = ByTor.create({objectProp: []});
        expect(byTor.errors.objectProp).toNot(beUndefined);

        // string, should fail
        byTor = ByTor.create({objectProp: 'As gray traces of dawn ...'});
        expect(byTor.errors.objectProp).toNot(beUndefined);
      });
    });

    describe(".array", function () {
      it('tests array properties', function () {
        var byTor;
        // Actual Array, valid
        byTor = ByTor.create({arrayProp: []});
        expect(byTor.valid()).to(beTrue);

        // Sure, technically Arrays are Objects, but this still isn't right
        byTor = ByTor.create({arrayProp: {}});
        expect(byTor.errors.arrayProp).toNot(beUndefined);

        // string, should fail
        byTor = ByTor.create({arrayProp: 'As gray traces of dawn ...'});
        expect(byTor.errors.arrayProp).toNot(beUndefined);
      });
    });

    describe(".date", function () {
      it('tests date properties', function () {
        var byTor;
        var dates = [
            '12/27/1968'
          , '12-27-1968'
          , '12.27.1968'
          , '1968/12/27'
          , '1968-12-27'
          , '1968.12.27'
          , [1968, 12, 27]
          , new Date(1968, 11, 27)
          , new Date('12/27/1968')
          , 'Fri, 27 Dec 1968'
        ];
        var dt;
        for (var i = 0, ii = dates.length; i < ii; i++) {
          dt = dates[i];
          byTor = ByTor.create({dateProp: dt});
          expect(byTor.valid()).to(beTrue);
          expect(byTor.dateProp.getFullYear()).to(equal, 1968);
          expect(byTor.dateProp.getMonth()).to(equal, 11);
          expect(byTor.dateProp.getDate()).to(equal, 27);
        }
      });
    });

    describe(".datetime", function () {
      it('tests datetime properties', function () {
        var byTor;
        var dates, dt;
        // Dates with no set time -- time should be set to 12 midnight
        dates = [
          '1968/12/27'
          , '1968-12-27'
          , '1968.12.27'
          , [1968, 12, 27]
          , new Date(1968, 11, 27)
          , new Date('12/27/1968')
          , 'Fri, 27 Dec 1968'
          //, '1968/12/27 00:00:00 -0800' // Your local offset must be the same for this test to pass
        ];
        for (var i = 0, ii = dates.length; i < ii; i++) {
          dt = dates[i];
          byTor = ByTor.create({datetimeProp: dt});
          expect(byTor.valid()).to(beTrue);
          expect(byTor.datetimeProp.getFullYear()).to(equal, 1968);
          expect(byTor.datetimeProp.getMonth()).to(equal, 11);
          expect(byTor.datetimeProp.getDate()).to(equal, 27);
          expect(byTor.datetimeProp.getHours()).to(equal, 0);
          expect(byTor.datetimeProp.getMinutes()).to(equal, 0);
          expect(byTor.datetimeProp.getSeconds()).to(equal, 0);
        }
        // Dates with times
        dates = [
          '1968-12-27 16:10:03'
          , [1968, 12, 27, 16, 10, 3]
          , new Date(1968, 11, 27, 16, 10, 3)
          , 'Fri, 27 Dec 1968 16:10:03'
          //, '1968/12/27 16:10:03 -0800' // Your local offset must be the same for this test to pass
        ];
        for (var i = 0, ii = dates.length; i < ii; i++) {
          dt = dates[i];
          byTor = ByTor.create({datetimeProp: dt});
          expect(byTor.valid()).to(beTrue);
          expect(byTor.datetimeProp.getFullYear()).to(equal, 1968);
          expect(byTor.datetimeProp.getMonth()).to(equal, 11);
          expect(byTor.datetimeProp.getDate()).to(equal, 27);
          expect(byTor.datetimeProp.getHours()).to(equal, 16);
          expect(byTor.datetimeProp.getMinutes()).to(equal, 10);
          expect(byTor.datetimeProp.getSeconds()).to(equal, 3);
        }
      });
    });

    describe(".time", function () {
      it('tests time properties', function () {
        var byTor;
        var dates, dt, vals;
        // Obj key is the input string, value is the list of values
        // for the parse Date object's h/m/s/ms
        dates = {
          '21:12' : [21, 12, 0, 0]
          , '1:11': [1, 11, 0, 0]
          , '1:11:03': [1, 11, 3, 0]
          , '1:11:03.999': [1, 11, 3, 999]
        };
        for (var p in dates) {
          dt = p;
          vals = dates[p];
          byTor = ByTor.create({timeProp: dt});
          expect(byTor.valid()).to(beTrue);
          expect(byTor.timeProp.getHours()).to(equal, vals[0]);
          expect(byTor.timeProp.getMinutes()).to(equal, vals[1]);
          expect(byTor.timeProp.getSeconds()).to(equal, vals[2]);
          expect(byTor.timeProp.getMilliseconds()).to(equal, vals[3]);
        }
      });
    });

  });
}});


