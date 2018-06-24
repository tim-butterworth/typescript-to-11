const customHtmlPlugin = require('./custom-plugin/CustomHtmlPlugin')
const webpack = require('webpack')
const R = require('ramda')
const fs = require('fs')

const maybeUpdate = (updateFn) => (predicate) => (basis) => {
    if(predicate()) {
	return updateFn(basis);
    } else {
	return basis;
    }
}

const getDirectoriesAndFiles = (root) => {
    const allFiles = fs.readdirSync(root).map((fileName) => root+"/"+fileName);

    const isFile = (filePath) => fs.lstatSync(filePath).isFile()
    const isDirectory = (filePath) => fs.lstatSync(filePath).isDirectory()

    const getUpdateFn = (detectFile, detectDirectory) => (acc, path) => {
	const appender = R.append(path)
	const updater = maybeUpdate(appender)

	const updatedFiles = updater(() => detectFile(path))(acc.files)
	const updatedDirectories = updater(() => detectDirectory(path))(acc.directories)

	return {
	    files: updatedFiles,
	    directories: updatedDirectories
	}
    };

    const updateFn = getUpdateFn(isFile, isDirectory);

    return R.reduce(
	updateFn
	, {files: [],directories: []}
	, allFiles
    );
}

const getFileListRecursively = (rootDir) => {

    let fileList = []
    let directories = [rootDir]

    while(directories.length > 0) {
	const result = R.pipe(
	    R.map
	    , R.reduce(
		(acc, current) =>  ({
		    files: R.concat(acc.files, current.files)
		    , directories: R.concat(acc.directories, current.directories)
		})
		, {files: [], directories: []}
	    )
	)(getDirectoriesAndFiles, directories)

	directories = result.directories
	fileList = R.concat(fileList, result.files)
    }

    return fileList
}

process.traceDeprecation = true

module.exports = {
    mode: "development",
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: "[name]/bundle.js",
        path: __dirname + "/dist"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
	    ,{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        customHtmlPlugin
    ]
};
