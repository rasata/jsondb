/**
 * NoSQL Database.
 * @author Grégory Tardivel
 * Copyright 2014
 */

module.exports = Database

var crypto = require('crypto');
var fs = require('fs')
var Table = require('./table.js');

var algo = 'aes256';
var extension = '.jsdb';

/** Constructeur Database. */
function Database() {
	var fParameters = 'conf/param-db.js';
	if (!fs.existsSync(fParameters)) {
		throw 'You must define database parameters in "conf/param-db.js" !'
	}
	
	var dParameters = fs.readFileSync(fParameters, {encoding: 'utf8'});
	var parameters = JSON.parse(dParameters);

	var cipherUSR = crypto.createCipher(algo, parameters.pass1);
	var cipherPWD = crypto.createCipher(algo, parameters.pass2);
	
	this.debug = parameters.debug;
	this.name = parameters.name;
	this.user = null;
	this.password = null;
	this.directory = parameters.path;
	
	var cuser = cipherUSR.update(parameters.user, 'utf8', 'hex') + cipherUSR.final('hex');
	var cpassword = cipherPWD.update(parameters.pass3, 'utf8', 'hex') + cipherPWD.final('hex');
	
	this.tables = [];
	this.access = false;

	var exists = fs.existsSync(this.path());
	
	if (exists) {
		this.read();
		if (cuser == this.user && cpassword == this.password) {
			this.access = true;
			this.log('.DATABASE [' + this.name + '] OPENED');
		} else {
			throw '! Access denied !';
		}
	} else {
		this.access = true;
		this.user = cuser;
		this.password = cpassword;
		this.log('.CREATE DATABASE [' + this.name + ']');
		this.save();
	}
}
/** Log un message si l'attribut "debug": true.
 * @param message Message qui sera affiché dans les logs */
Database.prototype.log = function(message) {
    if (this.debug == true) {
        console.log(message);
    }
}
/** @return le chemin du fichier de la base de données. */
Database.prototype.path = function() {
	if (this.directory != undefined) {
		if (!fs.existsSync(this.directory)) {
			fs.mkdirSync(this.directory);
		}
		return this.directory + '/' + this.name + extension;
	} else {
		return this.name + extension;
	}
}
/** Supprimer la base de données (+ fichier). */
Database.prototype.drop = function() {
    this.log('.DROP DATABASE [' + this.name + ']');
	var _this = this;
	this.tables.forEach(function(table) {
		_this.remove(table);
	});
	fs.unlinkSync(this.path());
}
/** Récupérer une table.
 * @param table Nom de la table
 * @return un objet Table */
Database.prototype.get = function(table) {
	if (table instanceof Table) {
		throw 'Parameter must be the table name';
	} else {
		var dbTable = new Table(this, table, null);
		return dbTable;
	}
}
/** Ajouter une table.
 * @param table Nom de la table
 * @param columns Array avec les noms des colonnes
 * @return un objet Table */
Database.prototype.add = function(table, columns) {
	if (table instanceof Table) {
		throw 'Parameter must be the table name';
	} else if (this.tables.indexOf(table) > -1) {
		return this.get(table);
	} else {
		this.read();
		this.tables.push(table);
		this.save();
		var dbTable = new Table(this, table, columns);
		return dbTable;
	}
}
/** Supprimer une table (+ fichier).
 * @param table Nom de la table */
Database.prototype.remove = function(table) {
	if (table instanceof Table) {
		throw 'Parameter must be the table name';
	} else {
		this.log('..DROP TABLE [' + table + ']');
		this.read();
		var index = this.tables.indexOf(table);
		this.tables.splice(index, 1);
		this.save();
		fs.unlinkSync(this.directory + '/' + table + extension);
	}
}
/** Chargement des attributs de la base de données à partir du fichier. */
Database.prototype.read = function() {
	var datas = fs.readFileSync(this.path(), {encoding: 'utf8'});
	var file = JSON.parse(datas);
	this.name = file.name;
	this.user = file.user;
	this.password = file.password;
	this.tables = file.tables;
}
/** Enregistrement de la base de données dans le fichier. */
Database.prototype.save = function() {
	if (this.access == true) {
		fs.writeFileSync(this.path(), this.datas());
	}
}
/** Conversion des données en JSON.
 * Filtre sur les données à ignorer dans le fichier. */
Database.prototype.datas = function() {
	return JSON.stringify(this, function(key, value) {
		if (key == 'access') {
			return undefined;
		}
		return value;
	});
}