'use strict';

const globby = require('globby');
const pathSort = require('path-sort');
const fs = require('fs');

const HtmlTranslationParser = require('./src/parsers/html-translation-parser');
const PoFile = require('./src/po/po-file');

/**
 * Write file to disk
 *
 * @param {string} potContent
 * @param {object} destination
 */
function writeFile(potContent, destination) {
    if (destination !== undefined) {
        fs.writeFileSync(destination, potContent);
    }
}

/**
 *  Parse all html files from the given destination
 *  and extract all translation keys.
 *
 * @param options
 * @returns {*}
 */
module.exports.htmlToPot = function (options) {
    // Set options
    options = options || {};

    // Find and sort file paths
    const files = pathSort(globby.sync(options.src));

    // Parse files
    const translationParser = new HtmlTranslationParser(options);
    for (const file of files) {
        translationParser.parseFile(file);
    }

    const generator = new PoFile(translationParser.getCollection(), options);
    const potContents = generator.generatePot();

    // Write file to output
    writeFile(potContents, options.destination);

    return potContents;
};

/**
 *  Parse all html files from the given destination,
 *  extract all translations and save them to the given locale.
 *
 * @param options
 * @returns {*}
 */
module.exports.htmlToPo = function (options) {
    // Set options
    options = options || {};

    // Find and sort file paths
    const files = pathSort(globby.sync(options.src));

    // Parse files
    const translationParser = new HtmlTranslationParser(options);
    for (const file of files) {
        translationParser.parseFile(file);
    }

    const generator = new PoFile(translationParser.getCollection(), options);
    const potContents = generator.generatePo(options.language);

    // Write file to output
    writeFile(potContents, options.destination);

    return potContents;
};
