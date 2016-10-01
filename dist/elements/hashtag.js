'use strict';

module.exports = {
	test: function test(x, i) {
		return (/^\s#[^\s]+/.test(x) || i == 0 && /^#[^\s]+/.test(x)
		);
	},

	parse: function parse(text) {
		var isHead = text[0] == '#';
		var hashtag = text.match(/^\s?#[^\s]+/)[0];
		var res = !isHead ? [{
			type: 'text',
			content: text[0]
		}] : [];
		res.push({
			type: 'hashtag',
			content: isHead ? hashtag : hashtag.substr(1),
			hashtag: isHead ? hashtag.substr(1) : hashtag.substr(2)
		});
		return res;
	}
};