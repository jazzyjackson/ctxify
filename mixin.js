// // edit this first line and call it whatever you want. overwrite document.createElement for all I car.
// // actually maybe that will be a nice upgrade. grab original createElement for safe keeping. if type is string, just call createElement. But I'll keep the two separate for now, and call mixint.createElement to be verbose that I'm doing something different
window.mixint = {
    createElement(graph){
        let [ tagName, attrObj ] = Object.entries(graph)[0]

        let node = document.createElement(tagName)
        for(var attribute in attrObj){
            let newValue = attrObj[attribute]
            switch(attribute){
                case 'textContent':
                    node.textContent = newValue
                    break
                case 'addEventListener':
                    Object.entries(newValue).forEach(entry => {
                        node.addEventListener(...entry)
                    })
                    break
                case 'style': 
                    if(newValue && newValue.constructor == String) node.style = newValue
                    if(newValue && newValue.constructor == Object) Object.assign(node.style, newValue)
                    break
                case 'childNodes':
                    Array.isArray(newValue) && newValue.filter(Boolean).forEach(child => {
                        node.appendChild(child instanceof Element ? child : mixint.createElement(child))
                    })
                    break
                case 'value':
                    // special case for form nodes where setting the value 'attribute' should set the value of the form
                    node.value = newValue
                    // break or no break? no harm in setting value property and value attribute
                    // select options want value attributes I guess?
                default:
                    node.setAttribute(attribute, newValue)
            }
        }
        return node
    }
}
// could be nice to return a proxy around the HTMLElement, 
// or not even around the Element, just put props on it,
// with some setters and getters
// so you can merge attribute objects that add children, eventlisteners, all that...
/* so you could .props = {
    textContent:
    addEventListener:
    value:
    style:
    childNodes:
}
just being able to update that stuff after defining the object
and giving that props setters getters option for any element
not just special classes
that would be great
Now whether certain ones get overwritten?
what if your proxy could define other methods?
or, nothing stopping you from doing that already, not treating it as a class and so on.
*/