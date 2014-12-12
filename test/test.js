var should = require('should');
var jsondb = require('../index');
var fs = require('fs')

describe('database', function() {
	it('file name', function() {
		var db = new jsondb.Database();
		db.path().should.eql('db/Base.jsdb');
	});
});

describe('database', function() {
	it('drop with directory', function() {
		var db = new jsondb.Database();
		db.drop();
	});
});

describe('database', function() {
	it('access', function() {
		var db = new jsondb.Database();
		db.access.should.eql(true);
		
		var file = fs.readFileSync('conf/param-db.js', {encoding: 'utf8'});
		var datas = JSON.parse(file);
		datas.user = 'toto';
		fs.writeFileSync('conf/param-db.js', JSON.stringify(datas));
		
		try {
			var db = new jsondb.Database();
		} catch(err) {
			console.error(err);
		}
		
		datas.user = 'greg';
		fs.writeFileSync('conf/param-db.js', JSON.stringify(datas));
	});
});

describe('database', function() {
	it('add table 1', function() {
		var db = new jsondb.Database();
		
		var t1 = db.add('Table', ['Nom', 'Prenom', 'Adresse1']);
		db.tables.length.should.eql(1);
	});
});

describe('database - table', function() {
	it('get table', function() {
		var db = new jsondb.Database();

		var t1 = db.add('Table', ['Nom', 'Prenom', 'Adresse1']);
		var t2 = db.get('Table');
		t2.should.eql(t1);
	});
});

describe('database - table', function() {
	it('add line 1 table 1', function() {
		var db = new jsondb.Database();

		var t1 = db.get('Table');

		t1.add({'Nom': 'Martin', 'Prenom': 'Roger', 'Adresse1': 1});
		t1.lines.length.should.eql(1);
	});
});

describe('database - table', function() {
	it('add line 2 table 1', function() {
		var db = new jsondb.Database();

		var t1 = db.get('Table');

		t1.add({'Nom': 'Martin', 'Prenom': 'Pierre', 'Adresse1': 2});
		t1.lines.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('add line 3 table 1', function() {
		var db = new jsondb.Database();

		var t1 = db.get('Table');

		t1.add({'Nom': 'Louis', 'Prenom': 'Pierre', 'Adresse1': 3});
		t1.lines.length.should.eql(3);
	});
});

describe('database - table', function() {
	it('add line invalid', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');

		try {
			t1.add({'Nom': 'Louis', 'Prenom': 'Pierre', 'Adresse1': 3, 'Age': 20});
		} catch(err) {
			console.error(err);
			err.should.eql('Column name is not defined : Age');
		}

		t1.lines.length.should.eql(3);
	});
});

describe('database - table', function() {
	it('select filter', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');

		var select1 = t1.filter('Nom');
		console.log(select1);
		select1.length.should.eql(3);
	});
});


describe('database - table', function() {
	it('select find', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');

		var select1 = t1.find('Nom', 'Martin');
		select1.lines.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('select like', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');

		var select2 = t1.like('Nom', 'oui');
		select2.lines.length.should.eql(1);
	});
});

describe('database', function() {
	it('add table 2', function() {
		var db = new jsondb.Database();
		
		var t2 = db.add('Adresse1', ['Numero', 'Rue', 'Ville']);
		db.tables.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('add line 1 table 2', function() {
		var db = new jsondb.Database();

		var t2 = db.get('Adresse1');

		t2.add({'Numero': 1, 'Rue': 'Avenue de la république', 'Ville': 'PARIS'});
		t2.lines.length.should.eql(1);
	});
});

describe('database - table', function() {
	it('add line 2 table 2', function() {
		var db = new jsondb.Database();

		var t2 = db.get('Adresse1');

		t2.add({'Numero': 2, 'Rue': 'Boulevard du Général de Gaule', 'Ville': 'NANTES'});
		t2.lines.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('add line 3 table 2', function() {
		var db = new jsondb.Database();

		var t3 = db.get('Adresse1');

		t3.add({'Numero': 3, 'Rue': 'Rue inconnue', 'Ville': 'BREST'});
		t3.lines.length.should.eql(3);
	});
});


describe('database - table', function() {
	it('join table 1', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		
		var req1 = t1.join('Adresse1');
		req1.lines.length.should.eql(3);
		req1.columns.length.should.eql(6);
	});
});

describe('database - table', function() {
	it('join table 2', function() {
		var db = new jsondb.Database();
		
		var t2 = db.get('Adresse1');
		
		var req1 = t2.join('Table');
		req1.lines.length.should.eql(0);
	});
});

describe('database - table', function() {
	it('join table and find', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		
		var req2 = t1.join('Adresse1').find('Nom', 'Martin');
		req2.lines.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('join table and like', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		
		var req3 = t1.join('Adresse1').like('Nom', 'Lou');
		req3.lines.length.should.eql(1);
	});
});

describe('database - table', function() {
	it('modify table add column', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		
		t1.modify(['Nom', 'Prenom', 'Age']);
		t1.columns.length.should.eql(3);
	});
});

describe('database - table', function() {
	it('add line 4 table 1', function() {
		var db = new jsondb.Database();

		var t1 = db.get('Table');

		t1.add({'Nom': 'Louis', 'Prenom': 'Robert', 'Age': 30});
		t1.lines.length.should.eql(4);
	});
});

describe('database - table', function() {
	it('delete line', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		
		t1.delete('Nom', 'Martin');
		t1.lines.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('modify table remove column', function() {
		var db = new jsondb.Database();
		
		var t1 = db.get('Table');
		console.log(t1.lines);
		t1.modify(['Nom', 'Age']);
		console.log(t1.lines);
		t1.columns.length.should.eql(2);
	});
});

describe('database - table', function() {
	it('update table', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Table');
		t1.update({'Age': 50}, {'Nom': 'Louis'});
		console.log(t1.lines);
	});
});

describe('database', function() {
	it('remove table', function() {
		var db = new jsondb.Database();
		db.remove('Table');
		db.tables.length.should.eql(1);
	});
});

describe('database', function() {
	it('drop', function() {
		var db = new jsondb.Database();
		db.drop();
	});
});