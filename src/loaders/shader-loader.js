// The only JavaScript file here because I don't want to have to tsc this file every I change it (I won't ever change it)

/**
 * @this {import('webpack').LoaderContext<{}>}
 * @param {string} source
 * @returns {string}
 */

module.exports = function(source) {
    this.addDependency(this.resourcePath);
    return `export default ${JSON.stringify(source)};`
};
