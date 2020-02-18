'use strict';

const fs = require('fs');
const jsdom = require('jsdom');
const PoObject = require('../po/po-object');
const PoCollection = require('../po/po-collection');

class HtmlTranslationParser {
    constructor(options) {
        this.options = options;
        this.collection = new PoCollection();
    }

    /**
     * Get all translation objects.
     *
     * @returns {PoCollection}
     */
    getCollection() {
        return this.collection;
    }

    /**
     * Parse Html file
     *
     * @return {Array}
     * @param file
     */
    parseFile(file) {
        // Get file contents
        const fileContents = fs.readFileSync(file).toString();

        // Set translation key prefix
        const fileLength = fileContents.length;
        let translationKeyPrefix = file;
        let pathPrefix = this.options.path_prefix || '';
        pathPrefix = pathPrefix.replace(/^[\.\/]+/g, "");
        translationKeyPrefix = translationKeyPrefix.replace(/^[\.\/]+/g, "");
        translationKeyPrefix = translationKeyPrefix.replace(pathPrefix, '');
        translationKeyPrefix = translationKeyPrefix.replace(/\//g, '-');
        translationKeyPrefix = translationKeyPrefix.replace(/\.html$/g, '');

        // Parse html fragment using jsdom
        const fragment = jsdom.JSDOM.fragment(fileContents);

        // Get all tags with a data-translate attribute
        let dataTranslateElements = fragment.querySelectorAll('[data-translate]');
        for (const element of dataTranslateElements) {
            // Get the translation string
            let translationString = element.innerHTML.trim();

            // Get the translation comments
            let translationComment = element.getAttribute('data-translate-comments');

            // Get the translation key
            let translationKey = element.getAttribute('data-translate');

            // Auto-generate translation key if option is enabled
            if (translationKey === '' && this.options.auto_generate_keys) {
                // Set translation key name
                let elementTagName = element.tagName;
                let elementId = element.getAttribute('id');
                let elementContent = translationString.replace(/ /g, '-').toLowerCase();
                let translationKeyName = [elementTagName, elementId ? elementId : elementContent].join('-');

                // Add key suffix, based on the file and name lengths
                let translationKeySuffix = [fileLength, translationKeyName.length].join('-');

                // Set final auto-generated translation key
                translationKey = [translationKeyPrefix, translationKeyName, translationKeySuffix].join('-').toLowerCase();
            }

            // Set translation string as key, if key is empty
            translationKey = translationKey === '' ? translationString : translationKey;

            // Get translation object (or generate a new one)
            let translationObject = this.collection.getTranslation(translationKey);
            translationObject = translationObject ? translationObject : new PoObject({
                msgid: translationKey,
                msgstr: translationString
            });

            // Add position
            translationObject.positions.push(file);

            // Add comment
            if (translationComment !== null) {
                translationObject.comments.push(translationComment);
            }

            // Append translation object
            this.collection.addTranslation(translationObject);
        }
    }
}

module.exports = HtmlTranslationParser;
