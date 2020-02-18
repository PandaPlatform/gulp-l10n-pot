# gulp-l10n-pot

Generate pot files from your html files using gulp tasks

This package helps generating pot translation files by parsing your html files looking for specific attributes.

## Installation

Using npm:

```
$ npm i -g npm
$ npm i --save gulp-l10n-pot
```

## Logic

The logic of this package is to allow translations of html files with translation keys using html attributes.

This way, we can allow the creation of translations using translation keys if needed, by adding specific attributes with values.

### Attributes

The `gulp-l10n-pot` module uses the following attributes for parsing html translations:
* `data-translate`: Stores the translation key, if any
* `data-translate-comment`: Stores the translation comment, if any
* Element inner html: Stores the translation value/string

If no key is defined, the translation string will be used as a key.

Input:
```html
<div class="translation-test-container">
    <h1 data-translate="translation-test-header">This is the translation test header.</div>
    <p data-translate="translation-test-paragraph">This is the translation test paragraph.</div>
</div>
```

Output (.pot):
```text
msgid ""
msgstr ""
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: gulp-l10n-pot\n"
"Project-Id-Version: test file\n"

#: file.html
msgid "translation-test-header"
msgstr ""

#: file.html
msgid "translation-test-paragraph"
msgstr ""
```

Output (.po):
```text
msgid ""
msgstr ""
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: gulp-l10n-pot\n"
"Project-Id-Version: test file\n"
"Language: en-us\n"

#: file.html
msgid "translation-test-header"
msgstr "This is the translation test header."

#: file.html
msgid "translation-test-paragraph"
msgstr "This is the translation test paragraph."
```

## Usage

This package can be used through gulp as follows:

```javascript
(function () {
    'use strict';

    // Initialize variables
    var gulp = require('gulp');
    var pot = require('gulp-l10n-pot');

    // ==================== TRANSLATIONS ==================== //
    gulp.task('translations-extract', function () {
        // Generate template file
        pot.htmlToPot({
            package: 'test file',
            src: '../resources/views/**/*.html',
            destination: '../resources/translations/po/translations.pot'
        });

        // Generate default language translations
        pot.htmlToPo({
            package: 'test file',
            src: '../resources/views/**/*.html',
            destination: '../resources/translations/po/en-us.po',
            language: 'en-us'
        });
    });
});
```

## Translation Keys

If translation keys are used, all the occurrences of a translation key will be accumulated in one entry.
The translation value will be the first occurrence of the translation key in any file.

You should be careful to set the same translation for the same keys.

## Auto-generate translation keys

You can choose to let the algorithm auto-generate the translation keys for you, in case you need to have keys but
you are struggling with name conventions.

The auto-generated translation key will include the file path, the tag name, the element id (if any) and the translation
content (if no element id) to make sure you have unique and self-explanatory ids.

To auto-generate the keys, use the `auto_generate_keys` and `path_prefix` parameters as follows:

```javascript
(function () {
    'use strict';

    // Initialize variables
    var gulp = require('gulp');
    var pot = require('gulp-l10n-pot');

    // ==================== TRANSLATIONS ==================== //
    gulp.task('translations-extract', function () {
        // Generate template file
        pot.htmlToPot({
            auto_generate_keys: true,
            path_prefix: '/resources/views/',
            package: 'test file',
            src: '../resources/views/**/*.html',
            destination: '../resources/translations/po/translations.pot'
        });

        // Generate default language translations
        pot.htmlToPo({
            auto_generate_keys: true,
            path_prefix: '/resources/views/',
            package: 'test file',
            src: '../resources/views/**/*.html',
            destination: '../resources/translations/po/en-us.po',
            language: 'en-us'
        });
    });
});
```

## Known issues

* It does not extract the line of the file
