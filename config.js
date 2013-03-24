/**
 * @author <tom@0x101.com>
 * @class Config
 */

var fs = require('fs');

/**
 * @type {String} CONFIGURATION_FOLDER
 */

this.CONFIGURATION_FOLDER = './config/';

/**
 * @type {Array} categories
 */

this.categories = [];

/**
 * @param {String} category
 * @method loadConfig
 */

this.loadConfig = function(category) {

	// By default try to load the 'development' config file
	var configFileName = this.getFullFileName(category, true);
	var filename = this.getFullFileName(category);

	try {
		// We want to merge and override what we defined in the config dev. file
		var data = JSON.parse(fs.readFileSync(filename, 'utf8'));
		var dataDev = JSON.parse(fs.readFileSync(configFileName, 'utf8'));

		for (var property in dataDev) {
			data[property] = dataDev[property];
		}

	} catch(e) {
		// Fallback for non dev. file
		var data = JSON.parse(fs.readFileSync(filename, 'utf8'));
	}

	this.categories[category] = data;

};

/**
 * @param {String} name
 * @param {Boolean} dev
 * @return {String}
 * @method getFullFileName
 */

this.getFullFileName = function(name, dev) {

	if (typeof dev === 'undefined') {
		var dev = false;
	}

	return dev ? this.CONFIGURATION_FOLDER + name + '-dev.json' :
		this.CONFIGURATION_FOLDER + name + '.json';

};


/**
 * @param {String} category
 * @param {String} property
 * @return {String|Array}
 * @method get
 */

this.get = function(category, property) {

	var value = null;

	if (typeof this.categories[category] !== 'undefined' && typeof this.categories[category][property] !== 'undefined') {
		value = this.categories[category][property];
	} else if (typeof property === 'undefined' && typeof this.categories[category] !== 'undefined') {
		value = this.categories[category];
	}

	return value;

};

// Preload the configuration
this.files = fs.readdirSync(this.CONFIGURATION_FOLDER)

var nFiles = this.files.length;
for (var i = 0; i < nFiles; i++) {
	var filename = this.files[i];
	var currentCategory = filename.substr(0, filename.lastIndexOf('.'));
	this.loadConfig(currentCategory);
}
