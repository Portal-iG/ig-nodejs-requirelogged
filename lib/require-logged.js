var winston = require("winston");
var _rewire = require('rewire');

/**
 * A require function which ensures an exclusive logger is set for each loaded module 
 * 
 * @param  {function} rewire Rewire module reference from 
 *     main application - so that module paths are resolved 
 *     relative to the main application
 * @return {function}        The enhanced require function
 */
module.exports = function (rewire) {
	rewire = rewire || _rewire;
	return function (moduleName) {
		var module = rewire(moduleName);

		if (!winston.loggers.has(moduleName)) {
			winston.loggers.add(moduleName, {
				console: {
					level: 'debug',
					colorize: true,
					timestamp: true,
					label: moduleName
				}
			});	
		}
		var logger = winston.loggers.get(moduleName);
		module.__set__("logger", logger);
		return module;
	}
}