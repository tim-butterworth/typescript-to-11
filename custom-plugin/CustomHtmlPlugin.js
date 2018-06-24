const R = require('ramda')
const fs = require('fs')
const path = require('path')
const {
    toAttributeString,
    toTag,
    selfClosingTag,
    simpleTag
} = require('./simpleDom')

const copyFile = (outputDir) => (filePair) => {
    const source = path.join(__dirname, `../node_modules/${filePair.source}`)
    const destination = `${outputDir}/${filePair.destination}`

    fs.copyFile(
	source,
	destination,
	(err) => {
	    if (err) throw err
	    console.log(`copied file ${source} into ${destination}`)
	})
}

const renderHtml = (files) => simpleTag(
    'html',
    [
	simpleTag(
	    'head',
	    ''
	),
	simpleTag(
	    'body',
	    [
		toTag('div', {'id': 'app'}, ''),
		R.map(
		    (file) => toTag(
			'script',
			{
			    src: `./${file}`,
			    type: "application/javascript"
			},
			'')
		)(files).join('\n')
	    ].join('\n')
	)
    ].join('\n')
)

module.exports = {
    apply: (compiler) => {
	compiler.hooks.emit.tapAsync('CustomHtmlPlugin', (compilation, callback) => {
	    const outputDirectory = compilation.outputOptions.path
	    const toDestinationCopy = copyFile(outputDirectory)
	    const vendorFiles = [];
            const files = R.compose(
		R.filter((fileName) => !fileName.includes('test')),
		R.filter((fileName) => !fileName.includes('map')),
		R.concat(vendorFiles),
		R.keys
	    )(compilation.assets)

	    const renderedHtml = renderHtml(files);

	    compilation.assets['index.html'] = {
		source: () => {
		    return renderedHtml;
		},
		size: () => {
		    return renderedHtml.length;
		}
	    };

	    callback();
	});
    }
}
