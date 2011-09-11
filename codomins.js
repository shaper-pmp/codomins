var codomins = function () {
	return {
		findComments: function(root) {
			root = root || window.document.getElementsByTagName("body")[0];
			var comments = [];
		
			var nodes = root.childNodes;

			for(var i=0; i<nodes.length; i++) {
				if(nodes[i].nodeType == 8) {
					nodes[i].beforeNode = nodes[i].nextSibling;
					comments.push(nodes[i]);
				}
				if(nodes[i].hasChildNodes) {
					comments = comments.concat(this.findComments(nodes[i]));
				}
			}
			return comments;
		},
		
		setContent: function(element, content) {
			if(document.contentType == "application/xml") {
				parser = new DOMParser();
				var doc = parser.parseFromString('<div xmlns="http://www.w3.org/1999/xhtml">' + content + '<\/div>', 'application/xml');
				var root = doc.documentElement;
				for (var i=0; i < root.childNodes.length; ++i) {
					element.appendChild(document.importNode(root.childNodes[i], true));
				}
			}
			else {
				element.innerHTML = content;
				
				if(element.innerHTML != content) {	// Work around nasty IE bug where script and style elements are stripped out if they don't have any "visible" leading content
					element.innerHTML = "<span>_</span>"+content;
					element.removeChild(element.firstChild);
				}
			}
		},
		
		init: function(root) {
			var comments = this.findComments(root);	// Find all correctly-formatted codomins comment nodes (<!---[condition]-content-->)
			var starttoken = "-[";
			var endtoken = "]-";

			var container = document.createElement('div');				
			document.getElementsByTagName("body")[0].appendChild(container);	// Insert the container element so that child elements are actually fully-constructed and definitely accessible through container.childNodes
			
			for(var i=0; i<comments.length; i++) {	// Iterate over codoimins comments
				var nodecontents = comments[i].nodeValue;
				if(nodecontents.indexOf(starttoken) == 0) {	// Check for false matches by ignoring comments unless the condition marker (-[condition]-) is the first thing in the comment
					var endpos = nodecontents.indexOf(endtoken)+endtoken.length;
					var condition = nodecontents.substr(starttoken.length, endpos-starttoken.length-endtoken.length);
					var content = nodecontents.substr(endpos);
					
					if(eval(condition)) {	// If embedded condiution evaluates to true:
					
						this.setContent(container, content);	// Set the comment's container's contents to the contents of the comment (basically snip the comment out of the DOM and set its children to be the children of the comment's parent)

						// This is all we need to do for all static elements, but with certain doctype/content-type combinations stylesheets and scripts must be handled specially or they won't be parsed/executed once they're inserted:
						
						var childnodes = container.childNodes;	// Not div.children, because we also want anonymous text nodes as well as elements
						while(childnodes.length) {
							var node = container.removeChild(childnodes.item(0)); // Remove node from temporary "rendering container", prior to inserting it wherever it needs to go in the DOM
							if(node.tagName) {
								var tagnamelc = node.tagName.toLowerCase();
								if(tagnamelc == "script") {
									this.reattachDynamicElement(node, comments[i].parentNode, comments[i].beforeNode);
								}
								else if(tagnamelc == "style" || (tagnamelc == "link" && node.rel.match(/stylesheet/))) {
									var headelement = document.getElementsByTagName('head')[0];
									this.reattachDynamicElement(node, headelement, headelement.lastChild);
								}
								else {
									comments[i].parentNode.insertBefore(node, comments[i].beforeNode);
								}
							}
							else {
								comments[i].parentNode.insertBefore(node, comments[i].beforeNode);
							}
						}
						
						comments[i].parentNode.removeChild(comments[i]);	// And remove original codomins comment node
					}
				}
			}
			window.document.getElementsByTagName("body")[0].removeChild(container);
		},
		
		reattachDynamicElement: function(node, newparent, nextsibling) {
			var tagnamelc = node.tagName.toLowerCase();
			if(tagnamelc == 'script') {
				if(node.src) {	// Link to external script
					var script = document.createElement(node.tagName);	// Dynamically inserting script nodes by setting container.innerHTML doesn't trigger the browser to execute the script, so we force it by manually creating a new script element, removing the old one and attaching the new one instead.
					if(node.attributes) {
						for(var index in node.attributes) {
							if(node.attributes[index] && node.attributes[index].nodeName) {
								var attribname = node.attributes[index].nodeName;
								script.setAttribute(attribname, node.attributes[index].nodeValue);
							}
						}
					}
					else {
						for(var index in node) {
							script[index] = node[index];
						}
					}
					newparent.insertBefore(script, nextsibling);
				}
				else {	// In-page script element
					var code = null;
					if(typeof node.innerHTML != "undefined") {
						code = node.innerHTML;
					}
					else {
						code = node.textContent;
					}
					eval(code);
					newparent.insertBefore(node, nextsibling);	// Don't really need to insert this here because we already evaluated it, but it's good to leave it in the DOM for completeness' sake, and we already know it won't be evaluated if it's included
				}
			}
			if(tagnamelc == "style" || (tagnamelc == "link" && node.rel.match(/stylesheet/))) {
				if(node.href) {	// Link to external stylesheet
					var link = document.createElement(node.tagName);	// Dynamically inserting script nodes by setting container.innerHTML doesn't trigger the browser to execute the script, so we force it by manually creating a new script element, removing the old one and attaching the new one instead.
					if(node.attributes) {
						for(var index in node.attributes) {
							if(node.attributes[index] && node.attributes[index].nodeName) {
								var attribname = node.attributes[index].nodeName;
								link.setAttribute(attribname, node.attributes[index].nodeValue);
							}
						}
					}
					else {
						for(var index in node) {
							link[index] = node[index];
						}
					}
					newparent.insertBefore(link, nextsibling);

				}
				else {	// In-page stylesheet
					newparent.insertBefore(node, nextsibling);
				}
			}
		}
	};
}();
	