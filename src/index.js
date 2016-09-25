var urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
var mentionRegExp = /@[a-zA-Z\-]+/;
var hashtagRegExp = /\s#[^\s]+/;

function analyze(source) {
	
	var tokens = [];

	function addText(text) {
		var last = tokens.pop();
		// 末尾がテキストなら連結
		if (last == undefined) {
			tokens.push({
				type: 'text',
				content: text
			});
		} else if (last.type != 'text') {
			tokens.push(last);
			tokens.push({
				type: 'text',
				content: text
			});
		} else {
			tokens.push({
				type: 'text',
				content: last.content + text
			});
		}
	}

	while (source != '') {
		// URL
		if (new RegExp('^' + urlRegExp.source).test(source)) {
			var link = source.match(new RegExp('^' + urlRegExp.source))[0];
			tokens.push({
				type: 'link',
				content: link
			});
			source = source.substr(link.length);
		}
		// Mention
		else if (new RegExp('^' + mentionRegExp.source).test(source)) {
			var mention = source.match(new RegExp('^' + mentionRegExp.source))[0];
			tokens.push({
				type: 'mention',
				content: mention.substr(1)
			});
			source = source.substr(mention.length);
		}
		// Hashtag
		else if (new RegExp('^' + hashtagRegExp.source).test(source)) {
			var hashtag = source.match(new RegExp('^' + hashtagRegExp.source))[0];
			addText(source[0]);
			tokens.push({
				type: 'hashtag',
				content: hashtag.substr(2)
			});
			source = source.substr(hashtag.length);
		}
		// Text
		else {
			addText(source[0]);
			source = source.substr(1);
		}
	}

	return tokens;
}

module.exports = analyze;
