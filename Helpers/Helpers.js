class Helpers{
    static nodeArraySearch(array,attribute, attributeValue){
        return array.filter(element=>{
            return element.getAttribute(attribute) === attributeValue.toString()
        })
    }
}
module.exports = Helpers