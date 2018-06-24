const R = require('ramda')

const toAttributeString = (attributeMap) => {
    const rawAttributeString = R.map(
	(pair) => `${pair[0]}='${pair[1]}'`,
	Object.entries(attributeMap)
    ).join(' ')

    return rawAttributeString ? ' ' + rawAttributeString : ''
}

const toTag = (tagName, attributeMap, child) => {
    const attributes = toAttributeString(attributeMap)

    return `<${tagName}${attributes}>\n${child}\n</${tagName}>`
}

const selfClosingTag = (tagName, attributeMap) => {
    const attributes = toAttributeString(attributeMap)

    return `<${tagName}${attributes}/>`
}

const simpleTag = (tag, child) => toTag(tag, {}, child)

module.exports = {
    toAttributeString,
    toTag,
    selfClosingTag,
    simpleTag
}
