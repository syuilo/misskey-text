(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	test: (x, i) =>
		/^\s#[^\s]+/.test(x) || (i == 0 && /^#[^\s]+/.test(x))
	,
	parse: text => {
		const isHead = text[0] == '#';
		const hashtag = text.match(/^\s?#[^\s]+/)[0];
		const res = !isHead ? [{
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

},{}],2:[function(require,module,exports){
const regexp = /@[a-zA-Z0-9\-]+/;

module.exports = {
	test: x => new RegExp('^' + regexp.source).test(x),
	parse: text => {
		const mention = text.match(new RegExp('^' + regexp.source))[0];
		return {
			type: 'mention',
			content: mention,
			username: mention.substr(1)
		};
	}
};

},{}],3:[function(require,module,exports){
const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

module.exports = {
	test: x => new RegExp('^' + regexp.source).test(x),
	parse: text => {
		const link = text.match(new RegExp('^' + regexp.source))[0];
		return {
			type: 'link',
			content: link
		};
	}
};

},{}],4:[function(require,module,exports){
const elements = [
	require('./elements/url'),
	require('./elements/mention'),
	require('./elements/hashtag')
];

function analyze(source) {

	if (source == '') {
		return null;
	}

	const tokens = [];

	function push(token) {
		if (token != null) {
			tokens.push(token);
			source = source.substr(token.content.length);
		}
	}

	let i = 0;

	// 繝代・繧ｹ
	while (source != '') {
		const parsed = elements.some(el => {
			if (el.test(source, i)) {
				let tokens = el.parse(source);
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

	// 繝・く繧ｹ繝医ｒ郤上ａ繧・
	tokens[0] = [tokens[0]];
	return tokens.reduce((a, b) => {
		if (a[a.length - 1].type == 'text' && b.type == 'text') {
			const tail = a.pop();
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

},{"./elements/hashtag":1,"./elements/mention":2,"./elements/url":3}]},{},[4]);
