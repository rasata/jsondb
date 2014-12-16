json.db (V 1.0.2)
=================

'json.db' est une base de données NoSQL gérer par un système de fichiers au format JSON.

# Installation

	npm install json.db

# Configuration

La base de données doit être définie dans un fichier de configuration à la racine du projet dans "conf/param-db.js",

ce fichier définit les élements suivants :

* name: Nom de la base de données
* user: Utilisateur de la base de données
* pass1: Mot de passe 1
* pass2: Mot de passe 2
* pass3: Mot de passe 3
* path: Répertoire de la base de données (facultatif, si non définit, les fichiers de la base se trouveront à la racine)
* debug: Afficher les logs ou non dans la console (true / false)

### Exemple :

	{
		"name":		"Base",
		"user":		"me",
		"pass1":	"T3sT:USER",
		"pass2":	"TeSt/P@ssW0rd",
		"pass3":	"Pass?44",
		"path":		"db",
		"debug":	true
	}

# Objet 'Database'

	/** Constructeur. */
	Database()
	
	/** Log un message si l'attribut "debug": true.
	 * @param message Message qui sera affiché dans les logs */
	log(message)
	
	/** Supprimer la base de données (+ fichier). */
	drop()
	
	/** Récupérer une table.
	 * @param table Nom de la table
	 * @return un objet Table */
	get(table)
	
	/** Ajouter une table.
	 * @param table Nom de la table
	 * @param columns Array avec les noms des colonnes
	 * @return un objet Table */
	add(table, columns)
	
	/** Supprimer une table (+ fichier).
	 * @param table Nom de la table */
	remove(table)
	
# Objet 'Table'

	/** Constructeur.
	 * @param database Objet Database
	 * @param name Nom de la table
	 * @param columns Array avec les noms des colonnes
	 * @param temp Boolean qui indique si la table est temporaire (pas de fichier) */
	Table(database, name, columns, temp)
		
	/** Ajouter une ligne dans la table.
	 * @param line Ligne au format JSON */
	add(line)
	
	/** Mettre à jour la table.
	 * @param value Nouvelle valeur au format JSON {key: value}
	 * @param condition Condition des lignes à mettre à jour au format JSON {key: value} */
	update(value, condition)
	
	/** Filtrer une colonne de la table.
	 * @param column Nom de la colonne à filter
	 * @return Array */
	filter(column)
	
	/** Rechercher les lignes par valeur.
	 * @param key Colonne
	 * @param value Valeur
	 * @return Un objet Table (temporaire - sans fichier) */
	find(key, value)
	
	/** Rechercher les lignes par valeur.
	 * @param key Colonne
	 * @param value Valeur
	 * @return Un objet Table (temporaire - sans fichier) */
	like(key, value)
	
	/** Joindre 2 tables (par index = numéro de ligne).
	 * @param table Nom de la table
	 * @param foreign Colonne commune entre les 2 tables
	 * @return Un objet Table (temporaire - sans fichier) */
	join(table, foreign)
	
	/** Supprimer des lignes.
	 * @param key Nom de la colonne
	 * @param value Valeur */
	delete(key, value)
	
	/** Modifier une table.
	 * @param newColumns Array avec les noms des colonnes */
	modify(newColumns)
	
# Commandes

* database ?
* table ?
