// // edit this first line and call it whatever you want. overwrite document.createElement for all I car.
// // actually maybe that will be a nice upgrade. grab original createElement for safe keeping. if type is string, just call createElement. But I'll keep the two separate for now, and call mixint.createElement to be verbose that I'm doing something different
window.mixint = {
    createElement(graph){
        if(!graph) throw new Error("You didn't give me a graph to work with")
        // document.createElement can handle a string just fine you don't need me.
        if(graph.constructor == String) return document.createElement(graph)
        // otherwise let's recurse the graph and create some nodes
        let [ tagName, attrObj ] = Object.entries(graph)[0]
        let node = document.createElement(tagName)
        // references to childNodes will be created in every node's .child property
        // retrieve children via tagNames like this.child.footer (only relevant for unique tags)
        node.child = {}
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
                        //node.child[ get tagname of node ] 
                        let newChild = child instanceof Element ? child : mixint.createElement(child)
                        node.child[newChild.tagName] = newChild
                        node.appendChild(newChild)
                    })
                    break
                case 'classList':
                    Array.isArray(newValue) && newValue.filter(Boolean).forEach(className => {
                        node.classList.add(className)
                    })
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

Object.defineProperties(HTMLElement.prototype, {
    props: {
        get(){
            let props = Array.from(this.attributes, attr => ({
                [attr.name]: attr.value
            })).reduce((a, n) => Object.assign(a, n),{}) // You would think you could do .reduce(Object.assign), but assign is variadic, and reduce passes the original array as the 4th argument to its callback, so you would get the original numeric keys in your result if you passed all 4 arguments of reduce to Object.assign. So, explicitely pass just 2 arguments, accumulator and next.
            
            return new Proxy(props, {
                set: (obj, prop, value) => {
                    value ? this.setAttribute(prop, value) : this.removeAttribute(prop)
                    return true
                },
                get: (target, name) => {
                    return this.getAttribute(name.toLowerCase())
                }
            })
        },
        set(data){
            Object.keys(data || {}).forEach(key => {
                // handle depth-1 nested objects, if a prop is an object, stringify it, I can parse it when I see it change like all the rest in attributeChangedCallback
                this.setAttribute(key, typeof data[key] == 'object' ? JSON.stringify(data[key]) : data[key])
            })
        }
    },
})