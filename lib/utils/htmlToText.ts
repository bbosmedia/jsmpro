export function htmlToText(html: string): string {
	// Create a new DOMParser
	const parser = new DOMParser();

	// Parse the HTML string
	const doc = parser.parseFromString(html, 'text/html');

	// Traverse the DOM tree and extract text content
	const textContent = extractText(doc.body);

	return textContent;
}

function extractText(element: Node): string {
	let text = '';

	for (const node of Array.from(element.childNodes)) {
		if (node.nodeType === Node.TEXT_NODE) {
			text += node.textContent || '';
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			text += extractText(node);
		}
	}

	return text;
}

export function convertTripleBackticksToCode(text: string): string {
	const regex = /```([^`]+)```/g;
	const replacedText = text
		.replace(/\n/g, '<br />')
		.replace(regex, '<pre><code>$1</code></pre>');
	return replacedText;
}
