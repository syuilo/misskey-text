'use strict';

var regexp = /@[a-zA-Z0-9\-]+/;

module.exports = {
	test: function test(x) {
		return new RegExp('^' + regexp.source).test(x);
	},
	parse: function parse(text) {
		var mention = text.match(new RegExp('^' + regexp.source))[0];
		return {
			type: 'mention',
			content: mention,
			username: mention.substr(1)
		};
	}
};