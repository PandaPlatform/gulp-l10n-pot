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

        // Parse html fragment using jsdom
        const fragment = jsdom.JSDOM.fragment(fileContents);

        // Get all tags with a data-translate attribute
        let dataTranslateElements = fragment.querySelectorAll('[data-translate]');

        for (const element of dataTranslateElements) {
            // Get the translation string
            let translationString = element.innerHTML.trim();

            // Get the translation comment
            let translationComment = element.getAttribute('data-translate-comment');

            // Get the translation key
            let translationKey = element.getAttribute('data-translate');

            // Set translation string as key, if key is empty
            translationKey = translationKey === '' ? translationString : translationKey;

            // Create translation object
            let translationObject = new PoObject({
                filename: file,
                comment: translationComment,
                msgid: translationKey,
                msgstr: translationString
            });

            // Append translation object
            this.collection.addTranslation(translationObject);
        }
    }
}

module.exports = HtmlTranslationParser;
