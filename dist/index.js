'use strict';

var elements = [require('./elements/url'), require('./elements/mention'), require('./elements/hashtag')];

function analyze(source) {

	if (source == '') {
		return null;
	}

	var tokens = [];

	function push(token) {
		if (token != null) {
			tokens.push(token);
			source = source.substr(token.content.length);
		}
	}

	var i = 0;

	// パース
	while (source != '') {
		var parsed = elements.some(function (el) {
			if (el.test(source, i)) {
				var tokens = el.parse(source);
				if (!Array.isArray(tokens)) {
					tokens = [tokens];
				}
				tokens.forEach(push);
				return true;
			}
		});

		if (!parsed) {
			push({
				type: 'text',
				content: source[0]
			});
		}

		i++;
	}

	// テキストを纏める
	tokens[0] = [tokens[0]];
	return tokens.reduce(function (a, b) {
		if (a[a.length - 1].type == 'text' && b.type == 'text') {
			var tail = a.pop();
			return a.concat({
				type: 'text',
				content: tail.content + b.content
			});
		} else {
			return a.concat(b);
		}
	});
}

module.exports = analyze;