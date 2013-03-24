/**
 * @author <tom@0x101.com>
 * @class Config
 */

var fs = require('fs');

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


// Preload the configuration

this.CONFIGURATION_FOLDER = './config/';

this.categories = [];

this.files = fs.readdirSync(this.CONFIGURATION_FOLDER)

var nDomains = this.domains.length;
for (var i = 0; i < nDomains; i++) {
	var currentDomain = this.domains[i];
	this.loadConfig(currentDomain);
}

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
