'use strict';

class PoCollection {
    constructor() {
        this.translations = [];
    }

    /**
     * Generate key to match duplicate translations
     *
     * @param {PoObject} poObject
     * @return {string}
     */
    static generateTranslationKey(poObject) {
        let context = poObject.msgctxt ? poObject.msgctxt : '';
        return `${poObject.msgid}${(context)}`;
    }

    /**
     * Add translation to array
     *
     * @param {PoObject} poObject
     */
    addTranslation(poObject) {
        const translationKey = PoCollection.generateTranslationKey(poObject);
        this.translations[translationKey] = poObject;
    }

    /**
     * Get all translation objects.
     *
     * @returns {PoObject[]}
     */
    getTranslations() {
        return this.translations;
    }
}

module.exports = PoCollection;
