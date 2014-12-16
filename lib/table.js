/**
 * NoSQL Table.
 * @author Grégory Tardivel
 * Copyright 2014
 */

module.exports = Table

var fs = require('fs')

var extension = '.jsdb';

/** Constructeur Table.
 * @param database Objet Database
 * @param name Nom de la table
 * @param columns Array avec les noms des colonnes
 * @param temp Boolean qui indique si la table est temporaire (pas de fichier) */
function Table(database, name, columns, temp) {
	var tabTemp = (temp == undefined || temp == false);
	if (database != undefined && database.access == true) {
		this.database = database;
		this.name = name;
		this.columns = columns;
		this.lines = [];

		if (tabTemp) {
			var exists = fs.existsSync(this.path());
			
			if (exists) {
				this.read();
			} else {
				this.database.log('..CREATE TABLE [' + this.name + ']');
				this.save();
			}
		}
	} else {
	    throw '! Access denied !';
	}
}
/** Ajouter une ligne dans la table.
 * @param line Ligne au format JSON */
Table.prototype.add = function(line) {
    this.database.log('...INSERT INTO [' + this.name + '] VALUES ' + line);
	var _this = this;
	for (var key in line) {
		var validate = false;
		this.columns.forEach(function(col) {
			if (col == key) {
				validate = true;
				return;
			}
		});
		if (!validate) {
			throw 'Column name is not defined : ' + key;
		}
	}
	this.read();
	this.lines.push(line);
	this.save();
}
/** Mettre à jour la table.
 * @param value Nouvelle valeur au format JSON {key: value}
 * @param condition Condition des lignes à mettre à jour au format JSON {key: value} */
Table.prototype.update = function(value, condition) {
    this.database.log('...UPDATE [' + this.name + '] SET [' + value + '] WHERE [' + condition + ']');
	var _this = this;
	for (var key in condition) {
		this.lines.forEach(function(line) {
			if (line[key] != undefined && line[key] == condition[key]) {
				for (var nkey in value) {
					line[nkey] = value[nkey];
				}
			}
		});
	}
	this.save();
}
/** Filtrer une colonne de la table.
 * @param column Nom de la colonne à filter
 * @return Array */
Table.prototype.filter = function(column) {
    this.database.log('...SELECT [' + column + '] FROM [' + this.name + ']');
	var retour = [];
	this.lines.forEach(function(line) {
		retour.push(line[column]);
	});
	return retour;
}
/** Rechercher les lignes par valeur.
 * @param key Colonne
 * @param value Valeur
 * @return Un objet Table (temporaire - sans fichier) */
Table.prototype.find = function(key, value) {
    this.database.log('...SELECT * FROM [' + this.name + '] WHERE [' + key + '] = [' + value + ']');
	var temp = new Table(this.database, this.name + '_FIND', this.columns, true);
	this.lines.forEach(function(line) {
		if (line[key] != undefined && line[key] == value) {
			temp.lines.push(line);
		}
	});
	return temp;
}
/** Rechercher les lignes par valeur.
 * @param key Colonne
 * @param value Valeur
 * @return Un objet Table (temporaire - sans fichier) */
Table.prototype.like = function(key, value) {
    this.database.log('...SELECT * FROM [' + this.name + '] WHERE [' + key + '] LIKE [%' + value + '%]');
	var temp = new Table(this.database, this.name + '_LIKE', this.columns, true);
	this.lines.forEach(function(line) {
		if (line[key] != undefined && line[key].indexOf(value) > -1) {
			temp.lines.push(line);
		}
	});
	return temp;
}
/** Joindre 2 tables (par index = numéro de ligne).
 * @param table Nom de la table
 * @param foreign Colonne commune entre les 2 tables
 * @return Un objet Table (temporaire - sans fichier) */
Table.prototype.join = function(table, foreign) {
    this.database.log('...SELECT * FROM [' + this.name + '] JOIN [' + table + ']');
	var tjoin = this.database.get(table);
	var tcolumns = this.columns;
	tjoin.columns.forEach(function(col) {
		if (tcolumns.indexOf(col) == -1) {
			tcolumns.push(col);
		}
	});
	var temp = new Table(this.database, this.name + '_JOIN_' + table, tcolumns, true);
	this.lines.forEach(function(line) {
		tjoin.lines.forEach(function(jline) {
			if (jline[foreign] == line[foreign]) {
				var tline = line;
				for (var prop in jline) {
					tline[prop] = jline[prop];
				}
				temp.lines.push(tline);
			}
		});
	});
	return temp;
}
/** Supprimer des lignes.
 * @param key Nom de la colonne
 * @param value Valeur */
Table.prototype.delete = function(key, value) {
    this.database.log('...DELETE FROM [' + this.name + '] WHERE [' + key + '] = [' + value + ']');
	var removed = 0;
	this.read();
	var _this = this;
	var find = true;
	while (find) {
		var index = 0;
		find = false;
		this.lines.forEach(function(line) {
			if (line[key] == value) {
				_this.lines.splice(index, 1);
				find = true;
				removed++;
			}
			index++;
		});
	}
	this.database.log('....' + removed + ' ROWS DELETED');
	this.save();
}
/** Modifier une table.
 * @param newColumns Array avec les noms des colonnes */
Table.prototype.modify = function(newColumns) {
    this.database.log('...ALTER [' + this.name + '] MODIFY COLUMNS ' + newColumns);
	var _this = this;
	var delta = this.columns.length - newColumns.length;
	if (delta > 0) {
		// Remove column
		for (var col in this.columns) {
			if (newColumns.indexOf(col) < 0) {
				// Remove elements of removed column
				this.lines.forEach(function(line) {
					delete line[col];
				});
			}
		}
		this.database.log('....' + delta + ' COLUMN(S) REMOVED');
	}
	this.columns = newColumns;
	this.save();
}
/** Enregistrement de la table dans le fichier. */
Table.prototype.save = function() {
	if (this.database != undefined && this.database.access == true) {
		fs.writeFileSync(this.path(), this.datas());
	}
}
/** Chargement des attributs de la table à partir du fichier. */
Table.prototype.read = function() {
	var datas = fs.readFileSync(this.path(), {encoding: 'utf8'});
	var file = JSON.parse(datas);
	this.name = file.name;
	this.columns = file.columns;
	this.lines = file.lines;
}
/** Conversion des données en JSON.
 * Filtre sur les données à ignorer dans le fichier. */
Table.prototype.datas = function() {
	return JSON.stringify(this, function(key, value) {
		if (key == 'database') {
			return undefined;
		}
		return value;
	});
}
/** @retour le chemin du fichier de la table. */
Table.prototype.path = function() {
	if (this.database.directory != undefined) {
		if (!fs.existsSync(this.database.directory)) {
			fs.mkdirSync(this.database.directory);
		}
		return this.database.directory + '/' + this.name + extension;
	} else {
		return this.name + extension;
	}
}