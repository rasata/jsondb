var should = require('should');
var jsondb = require('../index');
var fs = require('fs')

describe('database', function() {
	it('file', function() {
		var db = new jsondb.Database();
		db.path().should.eql('db/Base.jsdb');
	});
});
describe('database', function() {
	it('drop', function() {
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
	it('add table', function() {
		var db = new jsondb.Database();
		var t1 = db.add('Personne', ['PersonneID', 'Nom', 'Prenom', 'AdresseID']);
		db.tables.length.should.eql(1);
		console.log(db.tables[0]);
		db.tables[0].should.eql('Personne');
	});
});
describe('database - table', function() {
	it('get table', function() {
		var db = new jsondb.Database();
		var t1 = db.add('Personne', ['PersonneID', 'Nom', 'Prenom', 'AdresseID']);
		var t2 = db.get('Personne');
		t2.should.eql(t1);
	});
});
describe('database - table', function() {
	it('add line 1', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.add({'PersonneID': 1, 'Nom': 'Martin', 'Prenom': 'Roger', 'AdresseID': 1});
		t1.lines.length.should.eql(1);
		t1.lines[0]['Nom'].should.eql('Martin');
		t1.lines[0]['Prenom'].should.eql('Roger');
	});
});
describe('database - table', function() {
	it('add line 2', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.add({'PersonneID': 2, 'Nom': 'Martin', 'Prenom': 'Pierre', 'AdresseID': 2});
		t1.lines.length.should.eql(2);
		t1.lines[0]['Nom'].should.eql('Martin');
		t1.lines[0]['Prenom'].should.eql('Roger');
		t1.lines[1]['Nom'].should.eql('Martin');
		t1.lines[1]['Prenom'].should.eql('Pierre');
	});
});
describe('database - table', function() {
	it('add line 3', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.add({'PersonneID': 3, 'Nom': 'Louis', 'Prenom': 'Pierre', 'AdresseID': 3});
		t1.lines.length.should.eql(3);
		t1.lines[0]['Nom'].should.eql('Martin');
		t1.lines[0]['Prenom'].should.eql('Roger');
		t1.lines[1]['Nom'].should.eql('Martin');
		t1.lines[1]['Prenom'].should.eql('Pierre');
		t1.lines[2]['Nom'].should.eql('Louis');
		t1.lines[2]['Prenom'].should.eql('Pierre');
	});
});
describe('database - table', function() {
	it('add line invalid', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		try {
			t1.add({'Nom': 'Louis', 'Prenom': 'Pierre', 'AdresseID': 3, 'Age': 20});
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
		var t1 = db.get('Personne');
		var select1 = t1.filter('Nom');
		select1.length.should.eql(3);
		select1[0].should.eql('Martin');
		select1[1].should.eql('Martin');
		select1[2].should.eql('Louis');
	});
});
describe('database - table', function() {
	it('select find', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		var select1 = t1.find('Nom', 'Martin');
		select1.lines.length.should.eql(2);
		select1.lines[0]['Nom'].should.eql('Martin');
		select1.lines[0]['Prenom'].should.eql('Roger');
		select1.lines[1]['Nom'].should.eql('Martin');
		select1.lines[1]['Prenom'].should.eql('Pierre');
	});
});
describe('database - table', function() {
	it('select like', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		var select2 = t1.like('Nom', 'oui');
		select2.lines.length.should.eql(1);
		select2.lines[0]['Nom'].should.eql('Louis');
		select2.lines[0]['Prenom'].should.eql('Pierre');
	});
});
describe('database', function() {
	it('add table', function() {
		var db = new jsondb.Database();
		var t2 = db.add('Adresse', ['AdresseID', 'Numero', 'Rue', 'Ville']);
		db.tables.length.should.eql(2);
		db.tables[0].should.eql('Personne');
		db.tables[1].should.eql('Adresse');
	});
});
describe('database - table', function() {
	it('add line 1', function() {
		var db = new jsondb.Database();
		var t2 = db.get('Adresse');
		t2.add({'AdresseID': 1, 'Numero': 1, 'Rue': 'Avenue de la république', 'Ville': 'PARIS'});
		t2.lines.length.should.eql(1);
		t2.lines[0]['Numero'].should.eql(1);
		t2.lines[0]['Rue'].should.eql('Avenue de la république');
		t2.lines[0]['Ville'].should.eql('PARIS');
	});
});
describe('database - table', function() {
	it('add line 2', function() {
		var db = new jsondb.Database();
		var t2 = db.get('Adresse');
		t2.add({'AdresseID': 2, 'Numero': 10, 'Rue': 'Boulevard du Général de Gaule', 'Ville': 'NANTES'});
		t2.lines.length.should.eql(2);
		t2.lines[0]['Numero'].should.eql(1);
		t2.lines[0]['Rue'].should.eql('Avenue de la république');
		t2.lines[0]['Ville'].should.eql('PARIS');
		t2.lines[1]['Numero'].should.eql(10);
		t2.lines[1]['Rue'].should.eql('Boulevard du Général de Gaule');
		t2.lines[1]['Ville'].should.eql('NANTES');
	});
});
describe('database - table', function() {
	it('add line 3', function() {
		var db = new jsondb.Database();
		var t3 = db.get('Adresse');
		t3.add({'AdresseID': 3, 'Numero': 42, 'Rue': 'Rue inconnue', 'Ville': 'BREST'});
		t3.lines.length.should.eql(3);
		t3.lines[0]['Numero'].should.eql(1);
		t3.lines[0]['Rue'].should.eql('Avenue de la république');
		t3.lines[0]['Ville'].should.eql('PARIS');
		t3.lines[1]['Numero'].should.eql(10);
		t3.lines[1]['Rue'].should.eql('Boulevard du Général de Gaule');
		t3.lines[1]['Ville'].should.eql('NANTES');
		t3.lines[2]['Numero'].should.eql(42);
		t3.lines[2]['Rue'].should.eql('Rue inconnue');
		t3.lines[2]['Ville'].should.eql('BREST');
	});
});
describe('database - table', function() {
	it('join table', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		var req1 = t1.join('Adresse', 'AdresseID');
		req1.lines.length.should.eql(3);
		req1.columns.length.should.eql(7);
		req1.columns[0].should.eql('PersonneID');
		req1.columns[1].should.eql('Nom');
		req1.columns[2].should.eql('Prenom');
		req1.columns[3].should.eql('AdresseID');
		req1.columns[4].should.eql('Numero');
		req1.columns[5].should.eql('Rue');
		req1.columns[6].should.eql('Ville');
		req1.lines[0]['PersonneID'].should.eql(1);
		req1.lines[0]['Nom'].should.eql('Martin');
		req1.lines[0]['Prenom'].should.eql('Roger');
		req1.lines[0]['AdresseID'].should.eql(1);
		req1.lines[0]['Numero'].should.eql(1);
		req1.lines[0]['Rue'].should.eql('Avenue de la république');
		req1.lines[0]['Ville'].should.eql('PARIS');
		req1.lines[1]['PersonneID'].should.eql(2);
		req1.lines[1]['Nom'].should.eql('Martin');
		req1.lines[1]['Prenom'].should.eql('Pierre');
		req1.lines[1]['AdresseID'].should.eql(2);
		req1.lines[1]['Numero'].should.eql(10);
		req1.lines[1]['Rue'].should.eql('Boulevard du Général de Gaule');
		req1.lines[1]['Ville'].should.eql('NANTES');
		req1.lines[2]['PersonneID'].should.eql(3);
		req1.lines[2]['Nom'].should.eql('Louis');
		req1.lines[2]['Prenom'].should.eql('Pierre');
		req1.lines[2]['AdresseID'].should.eql(3);
		req1.lines[2]['Numero'].should.eql(42);
		req1.lines[2]['Rue'].should.eql('Rue inconnue');
		req1.lines[2]['Ville'].should.eql('BREST');
	});
});
describe('database - table', function() {
	it('join table', function() {
		var db = new jsondb.Database();
		var t2 = db.get('Adresse');
		var req1 = t2.join('Personne', 'AdresseID');
		req1.lines.length.should.eql(3);
		req1.columns.length.should.eql(7);
		req1.columns[0].should.eql('AdresseID');
		req1.columns[1].should.eql('Numero');
		req1.columns[2].should.eql('Rue');
		req1.columns[3].should.eql('Ville');
		req1.columns[4].should.eql('PersonneID');
		req1.columns[5].should.eql('Nom');
		req1.columns[6].should.eql('Prenom');
		req1.lines[0]['PersonneID'].should.eql(1);
		req1.lines[0]['Nom'].should.eql('Martin');
		req1.lines[0]['Prenom'].should.eql('Roger');
		req1.lines[0]['AdresseID'].should.eql(1);
		req1.lines[0]['Numero'].should.eql(1);
		req1.lines[0]['Rue'].should.eql('Avenue de la république');
		req1.lines[0]['Ville'].should.eql('PARIS');
		req1.lines[1]['PersonneID'].should.eql(2);
		req1.lines[1]['Nom'].should.eql('Martin');
		req1.lines[1]['Prenom'].should.eql('Pierre');
		req1.lines[1]['AdresseID'].should.eql(2);
		req1.lines[1]['Numero'].should.eql(10);
		req1.lines[1]['Rue'].should.eql('Boulevard du Général de Gaule');
		req1.lines[1]['Ville'].should.eql('NANTES');
		req1.lines[2]['PersonneID'].should.eql(3);
		req1.lines[2]['Nom'].should.eql('Louis');
		req1.lines[2]['Prenom'].should.eql('Pierre');
		req1.lines[2]['AdresseID'].should.eql(3);
		req1.lines[2]['Numero'].should.eql(42);
		req1.lines[2]['Rue'].should.eql('Rue inconnue');
		req1.lines[2]['Ville'].should.eql('BREST');
	});
});
describe('database - table', function() {
	it('join table and find', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		var req2 = t1.join('Adresse', 'AdresseID').find('Nom', 'Martin');
		req2.lines.length.should.eql(2);
		req2.lines[0]['PersonneID'].should.eql(1);
		req2.lines[0]['Nom'].should.eql('Martin');
		req2.lines[0]['Prenom'].should.eql('Roger');
		req2.lines[0]['AdresseID'].should.eql(1);
		req2.lines[0]['Numero'].should.eql(1);
		req2.lines[0]['Rue'].should.eql('Avenue de la république');
		req2.lines[0]['Ville'].should.eql('PARIS');
		req2.lines[1]['PersonneID'].should.eql(2);
		req2.lines[1]['Nom'].should.eql('Martin');
		req2.lines[1]['Prenom'].should.eql('Pierre');
		req2.lines[1]['AdresseID'].should.eql(2);
		req2.lines[1]['Numero'].should.eql(10);
		req2.lines[1]['Rue'].should.eql('Boulevard du Général de Gaule');
		req2.lines[1]['Ville'].should.eql('NANTES');
	});
});
describe('database - table', function() {
	it('join table and like', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		var req3 = t1.join('Adresse', 'AdresseID').like('Nom', 'Lou');
		req3.lines.length.should.eql(1);
		req3.lines[0]['PersonneID'].should.eql(3);
		req3.lines[0]['Nom'].should.eql('Louis');
		req3.lines[0]['Prenom'].should.eql('Pierre');
		req3.lines[0]['AdresseID'].should.eql(3);
		req3.lines[0]['Numero'].should.eql(42);
		req3.lines[0]['Rue'].should.eql('Rue inconnue');
		req3.lines[0]['Ville'].should.eql('BREST');
	});
});
describe('database - table', function() {
	it('modify table add column', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.columns.length.should.eql(4);
		t1.columns[0].should.eql('PersonneID');
		t1.columns[1].should.eql('Nom');
		t1.columns[2].should.eql('Prenom');
		t1.columns[3].should.eql('AdresseID');
		t1.modify(['PersonneID', 'Nom', 'Prenom', 'AdresseID', 'Age']);
		t1.columns.length.should.eql(5);
		t1.columns[0].should.eql('PersonneID');
		t1.columns[1].should.eql('Nom');
		t1.columns[2].should.eql('Prenom');
		t1.columns[3].should.eql('AdresseID');
		t1.columns[4].should.eql('Age');
	});
});
describe('database - table', function() {
	it('add line 4', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.add({'PersonneID': 4, 'Nom': 'Louis', 'Prenom': 'Robert', 'AdresseID': 1,'Age': 30});
		t1.lines.length.should.eql(4);
		t1.lines[0]['Nom'].should.eql('Martin');
		t1.lines[0]['Prenom'].should.eql('Roger');
		t1.lines[1]['Nom'].should.eql('Martin');
		t1.lines[1]['Prenom'].should.eql('Pierre');
		t1.lines[2]['Nom'].should.eql('Louis');
		t1.lines[2]['Prenom'].should.eql('Pierre');
		t1.lines[3]['Nom'].should.eql('Louis');
		t1.lines[3]['Prenom'].should.eql('Robert');
		t1.lines[3]['Age'].should.eql(30);
	});
});
describe('database - table', function() {
	it('delete line', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.delete('Nom', 'Martin');
		t1.lines.length.should.eql(2);
		t1.lines[0]['Nom'].should.eql('Louis');
		t1.lines[0]['Prenom'].should.eql('Pierre');
		t1.lines[1]['Nom'].should.eql('Louis');
		t1.lines[1]['Prenom'].should.eql('Robert');
		t1.lines[1]['Age'].should.eql(30);
	});
});
describe('database - table', function() {
	it('modify table remove column', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.columns.length.should.eql(5);
		t1.columns[0].should.eql('PersonneID');
		t1.columns[1].should.eql('Nom');
		t1.columns[2].should.eql('Prenom');
		t1.columns[3].should.eql('AdresseID');
		t1.columns[4].should.eql('Age');
		t1.modify(['Nom', 'Age']);
		t1.columns.length.should.eql(2);
		t1.columns[0].should.eql('Nom');
		t1.columns[1].should.eql('Age');
	});
});
describe('database - table', function() {
	it('update table', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.lines[1]['Nom'].should.eql('Louis');
		t1.lines[1]['Age'].should.eql(30);
		t1.update({'Age': 50}, {'Nom': 'Louis'});
		t1.lines[1]['Nom'].should.eql('Louis');
		t1.lines[1]['Age'].should.eql(50);
	});
});
describe('database - table', function() {
	it('delete line', function() {
		var db = new jsondb.Database();
		var t1 = db.get('Personne');
		t1.lines.length.should.eql(2);
		t1.lines[0]['Nom'].should.eql('Louis');
		t1.lines[1]['Nom'].should.eql('Louis');
		t1.lines[1]['Age'].should.eql(50);
		t1.delete('Nom', 'Louis');
		t1.lines.length.should.eql(0);
	});
});
describe('database', function() {
	it('remove table', function() {
		var db = new jsondb.Database();
		db.remove('Personne');
		db.tables.length.should.eql(1);
		db.tables[0].should.eql('Adresse');
	});
});
describe('database', function() {
	it('drop', function() {
		var db = new jsondb.Database();
		db.drop();
	});
});