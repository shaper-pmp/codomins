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
				parser = new DOMParser()
				var doc = parser.parseFromString('<div xmlns="http://www.w3.org/1999/xhtml">' + content + '<\/div>', 'application/xml');
				var root = doc.documentElement;
				for (var i=0; i < root.childNodes.length; ++i) {
					element.appendChild(document.importNode(root.childNodes[i], true))
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
			var comments = this.findComments(root);
			var starttoken = "-[";
			var endtoken = "]-";

			var container = document.createElement('div');				
			document.getElementsByTagName("body")[0].appendChild(container);	// Insert the container element so that child elements are actually fully-constructed and definitely accessible through container.childNodes
			
			for(var i=0; i<comments.length; i++) {
				var nodecontents = comments[i].nodeValue;
				if(nodecontents.indexOf(starttoken) == 0) {
					var endpos = nodecontents.indexOf(endtoken)+endtoken.length;
					var condition = nodecontents.substr(starttoken.length, endpos-starttoken.length-endtoken.length);
					var content = nodecontents.substr(endpos);
					
					if(eval(condition)) {
					
						this.setContent(container, content);
						
						/*container.innerHTML = content;
						dump(typeof container.innerHTML);
						
						if(container.innerHTML != content) {	// Work around nasty IE bug where script and style elements are stripped out if they don't have any "visible" leading content
							container.innerHTML = "<span>_</span>"+content;
							container.removeChild(container.firstChild);
						}*/
						
						var childnodes = container.childNodes;	// Not div.children, because we also want anonymous text nodes as well as elements
						while(childnodes.length) {
							var node = childnodes.item(0);
							var tagname = node.tagName;
							if(tagname && tagname.toLowerCase() == "script") {
								if(node.src) {	// Link to external script
									var script = document.createElement('script');	// Dynamically inserting script nodes by setting container.innerHTML doesn't trigger the browser to execute the script, so we force it by manually creating a new script element, removing the old one and attaching the new one instead.
									script.setAttribute('type', 'text/javascript');
									script.setAttribute('src', node.src);
									/*script.type = 'text/javascript';
									script.src = node.src;*/
									container.removeChild(node);	// Get rid of old (non-executed) script
									node = script;					// And substitute new one
								}
								else {	// In-line code in script element
									var code = null;
									if(typeof node.innerHTML != "undefined") {
										code = node.innerHTML;
									}
									else {
										code = node.textContent;
									}
									eval(code);
								}
							}
							else {
								container.removeChild(node);
							}
							
							comments[i].parentNode.insertBefore(node, comments[i].beforeNode);
						}
						
						comments[i].parentNode.removeChild(comments[i]);
					}
				}
			}
			window.document.getElementsByTagName("body")[0].removeChild(container);
		}
	};
}();
	