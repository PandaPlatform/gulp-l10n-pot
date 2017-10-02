'use strict';

class PoObject {
    constructor(options) {
        this.filename = options.filename;
        this.line = options.line;

        // Check if there is line info
        let line = options.line === undefined ? '' : ':' + options.line;
        this.info = `${options.filename}${line}`;

        this.comment = options.comment;
        this.msgctxt = options.msgctxt;
        this.msgid = options.msgid;
        this.msgid_plural = options.msgid_plural;
        this.msgstr = options.msgstr;
    };

    /**
     * Get msgid lines in pot format
     *
     * @param {string}  msgid
     * @param {Boolean} [plural]
     *
     * @return {Array}
     */
    static getMsgId(msgid, plural) {
        const output = [];
        const idKey = (plural ? 'msgid_plural' : 'msgid');

        if (msgid) {
            msgid = PoObject.escapeQuotes(msgid);

            if (/\n/.test(msgid)) {
                output.push(`${idKey} ""`);
                const rows = msgid.split(/\n/);

                for (let rowId = 0; rowId < rows.length; rowId++) {
                    const lineBreak = rowId === (rows.length - 1) ? '' : '\\n';

                    output.push(`"${rows[rowId] + lineBreak}"`);
                }
            } else {
                output.push(`${idKey} "${msgid}"`);
            }
        }

        return output;
    }

    /**
     * Get msgstr lines in po format
     *
     * @param {String} msgstr
     *
     * @return {Array}
     */
    static getMsgStr(msgstr) {
        const output = [];
        const idKey = 'msgstr';

        msgstr = PoObject.escapeQuotes(msgstr);

        if (/\n/.test(msgstr)) {
            output.push(`${idKey} ""`);
            const rows = msgstr.split(/\n/);

            for (let rowId = 0; rowId < rows.length; rowId++) {
                const lineBreak = rowId === (rows.length - 1) ? '' : '\\n';

                output.push(`"${rows[rowId] + lineBreak}"`);
            }
        } else {
            output.push(`${idKey} "${msgstr}"`);
        }

        return output;
    }

    /**
     * Generate po string snippet (array of lines)
     *
     * @return {Array}
     * @param {Boolean} withMessageString
     */
    toString(withMessageString) {
        // Write translation rows.
        let output = [];

        if (this.comment) {
            output.push(`#. ${this.comment}`);
        }

        // Unify paths for Unix and Windows
        output.push(`#: ${this.info.replace(/\\/g, '/')}`);

        if (this.msgctxt) {
            output.push(`msgctxt "${PoObject.escapeQuotes(this.msgctxt)}"`);
        }

        output = output.concat(PoObject.getMsgId(this.msgid));
        output = output.concat(PoObject.getMsgId(this.msgid_plural, true));
        output = output.concat(PoObject.getMsgStr(withMessageString ? this.msgstr : ''));

        return output;
    }

    /**
     * Escape unescaped double quotes
     *
     * @param {string} text
     * @return string
     */
    static escapeQuotes(text) {
        text = text.replace(/\\([\s\S])|(")/g, '\\$1$2');
        return text;
    }
}

module.exports = PoObject;
