function analyze(source) {
	
	var tokens = [];

	while (source != '') {
		// URL
		if (/^https?:\/\/[\/a-zA-Z\-~_\.:%#\?=&]+/.test(source)) {
			var link = source.match(/^https?:\/\/[\/a-zA-Z\-~_\.:%#\?=&]+/)[0];
			tokens.push({
				type: 'link',
				content: link
			});
			source = source.substr(link.length);
		}
		// Mention
		else if (/^@[a-zA-Z\-]+/.test(source)) {
			var mention = source.match(/^@[a-zA-Z\-]+/)[0];
			tokens.push({
				type: 'mention',
				content: mention.substr(1)
			});
			source = source.substr(mention.length);
		}
		// Hashtag
		else if (/^#[^\s]+/.test(source)) {
			var hashtag = source.match(/^#[^\s]+/)[0];
			tokens.push({
				type: 'hashtag',
				content: hashtag.substr(1)
			});
			source = source.substr(hashtag.length);
		}
		// Text
		else {
			var last = tokens.pop();
			// 末尾がテキストなら連結
			if (last == undefined) {
				tokens.push({
					type: 'text',
					content: source[0]
				});
			} else if (last.type != 'text') {
				tokens.push(last);
				tokens.push({
					type: 'text',
					content: source[0]
				});
			} else {
				tokens.push({
					type: 'text',
					content: last.content + source[0]
				});
			}
			source = source.substr(1);
		}
	}

	return tokens;
}

module.exports = analyze;
