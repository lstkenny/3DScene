class DomManager {
	elementAttrDataSet(element, attr, data) {
		for (let key in data) {
			element[attr][key] = data[key]
		}
	}
	removeElement(element) {
		if (element) {
			element.parentNode.removeChild(element)
		}
	}
	createElement(tag, options, parent) {
		const element = document.createElement(tag)
		const attributes = ["id", "name", "title", "src", "href", "width", "height", "type", "action", "method", "value", "checked", "selected", "readonly", "disabled", "size"]
		attributes.forEach(attr => {
			if (options[attr]) {
				element.setAttribute(attr, options[attr]);
			}
		})
		if (options.class) {
			let classes = []
			if (Array.isArray(options.class)) {
				classes = options.class
			} else {
				classes = options.class.trim().split(/\s+/)
			}
			element.classList.add(...classes)
		}
		if (options.style) {
			this.elementAttrDataSet(element, 'style', options.style)
		}
		if (options.data) {
			this.elementAttrDataSet(element, 'dataset', options.data)
		}
		if (options.text) {
			element.appendChild(document.createTextNode(options.text))
		}
		if (options.children) {
			let children = []
			if (Array.isArray(options.children)) {
				children = options.children
			} else {
				children = [options.children]
			}
			children.forEach(child => {
				if (options.childrenPrepend) {
					element.insertBefore(child, element.firstChild);
				} else {
					element.appendChild(child)
				}
			})
		}
		if (options.listeners) {
			for (let event in options.listeners) {
				element.addEventListener(event, options.listeners[event])
			}
		}
		if (parent) {
			parent.appendChild(element)
		}
		return element
	}
	selectText(node) {
		if (document.body.createTextRange) {
			const range = document.body.createTextRange();
			range.moveToElementText(node);
			range.select();
		} else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(node);
			selection.removeAllRanges();
			selection.addRange(range);
		} else {
			console.warn("Could not select text in node: Unsupported browser.");
		}
	}
}
export default DomManager