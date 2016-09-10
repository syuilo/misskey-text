function analyze(source) {
	
	const tokens = [];

	while (source != '') {
		// URL
		if (/^https?:\/\/[a-zA-Z\-~_\.:%\?=&]+/.test(source)) {
			const link = source.match(/^https?:\/\/[a-zA-Z\-~_\.:%\?=&]+/)[0];
			tokens.push({
				type: 'link',
				content: link
			});
			source = source.substr(link.length);
		}
		// Mention
		else if (/^@[a-zA-Z\-]+/.test(source)) {
			const mention = source.match(/^@[a-zA-Z\-]+/)[0];
			tokens.push({
				type: 'mention',
				content: mention.substr(1)
			});
			source = source.substr(mention.length);
		}
		// Hashtag
		else if (/^#[^\s]+/.test(source)) {
			const hashtag = source.match(/^#[^\s]+/)[0];
			tokens.push({
				type: 'hashtag',
				content: hashtag.substr(1)
			});
			source = source.substr(hashtag.length);
		}
		// Text
		else {
			const last = tokens.pop();
			// 末尾がテキストなら連結
			if (last == undefined || last.type != 'text') {
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