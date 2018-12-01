/**
 * @param {object} style
 * @return {string}
 * Take object of form {width: "100px", height: "50px"}
 * and return a string `width: 100px; height: 50px;`
 * These values ARE compatible with {{ }} templating
 */
function formatStyleRules(style, seperator = ' '){
	return Object.entries(style).map(tuple =>
		`${tuple[0]}: ${tuple[1]};`
	).join(seperator)
}
/**
 * @param {string} prop
 * @param {string} attribute
 * @return {string}
 * the leading space is intentional by the way,
 * so space only exists in <tagName> before each attribute
 */
function formatAttribute(prop, attribute){
	return ` ${prop}="${attribute}"`
}

module.exports = function renderHTML(graph){
 	var [element, props] = Object.entries(graph).pop()
	var outerHTML = new Array
	var innerHTML = new Array

	if(element == '!')
		return `<!-- ${props} -->\n`

 	for(var prop in props){
 		var attribute = props[prop]
 		if(element.toUpperCase() == 'STYLE'){
 				innerHTML.push(`\n${prop} {${formatStyleRules(attribute)}}\n`)
 		} else switch(prop){
 			case 'textContent':
 				innerHTML.push(attribute)
 				break
 			case 'style':
 				outerHTML.push(formatAttribute('style', formatStyleRules(attribute)))
 				break
 			case 'childNodes':
 				innerHTML.push(...attribute.map(child => renderHTML(child)))
 				break
 			default:
 				outerHTML.push(formatAttribute(prop, attribute))
 		}
	}
	return `<${element}${outerHTML.join(' ')}>${innerHTML.join('')}</${element}>`
}