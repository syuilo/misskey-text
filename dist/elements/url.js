'use strict';

var regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

module.exports = {
	test: function test(x) {
		return new RegExp('^' + regexp.source).test(x);
	},
	parse: function parse(text) {
		var link = text.match(new RegExp('^' + regexp.source))[0];
		return {
			type: 'link',
			content: link
		};
	}
};