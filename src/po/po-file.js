'use strict';

class PoFile {
    /**
     * @param {PoCollection} collection
     * @param {Object} options
     */
    constructor(collection, options) {
        this.collection = collection;
        this.options = options;
    }

    /**
     * Check if variable is a empty object
     *
     * @param  {object}  obj
     *
     * @return {boolean}
     */
    static isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Sort object by key name
     *
     * @param {object} obj
     */
    sortObject(obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    }

    /**
     * Geneate pot contents
     *
     * @return {string}
     */
    generatePot() {
        // Initialize contents
        let contents = '';

        // Add headers
        contents += this.generateHeaders();
        contents += '\n';

        const translations = this.collection.getTranslations();
        for (const i in translations) {
            const poObject = translations[i];
            const translationLines = poObject.toString(false);
            contents += translationLines.join('\n');
            contents += '\n\n';
        }

        return contents;
    }

    /**
     * Generate pot contents
     *
     * @return {string}
     */
    generatePo() {
        // Initialize contents
        let contents = '';

        // Add headers
        contents += this.generateHeaders();
        contents += '\n';

        const translations = this.collection.getTranslations();
        for (const i in translations) {
            const poObject = translations[i];
            const translationLines = poObject.toString(true);
            contents += translationLines.join('\n');
            contents += '\n\n';
        }

        return contents;
    }

    /**
     * @returns {string}
     */
    generateHeaders() {
        const year = new Date().getFullYear();

        let contents = (
            `# Copyright (C) ${year} ${this.options.package}
# This file is distributed under the same license as the ${this.options.package} package.
msgid ""
msgstr ""
"Project-Id-Version: ${this.options.package}\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"\n`);

        if (this.options.headers && !PoFile.isEmptyObject(this.options.headers)) {
            this.options.headers = this.sortObject(this.options.headers);

            for (const key of Object.keys(this.options.headers)) {
                contents += `"${key}: ${this.options.headers[key]}\\n"\n`;
            }
        }

        return contents;
    }
}

module.exports = PoFile;
