/*** highlighter of code snippets ***/
document.addEventListener("DOMContentLoaded", function () {
    const cSnippets    = document.querySelectorAll('.c-language');
    const bashSnippets = document.querySelectorAll('.bash-language');

    // C keywords
    const cKeywords1 = ['void', 'char', 'int', 'unsigned', 'long', 'NULL'];
    const cKeywords2 = ['if', 'else', 'while', 'return'];
    const cKeywords3 = ['printf', 'scanf', 'exit', 'fopen', 'fclose', 'fgetc', 'signal', 'setvbuf'];

    // Bash keywords
    const bashKeywords = ['file', 'nm', 'grep', 'printf', 'nc', 'curl', 'gpg']
    
    // patterns for strings and comments
    const stringPat  = ['"[^"]*"', "'[^']*'"];
    const commentPat = ["(//.*)"];

    // regexes are applied to identify language keywords, comments and stings
    // 1. highlighting C snippets
    cSnippets.forEach(snippet => {
        let code = snippet.innerHTML;

        stringPat.forEach(pat => {
            const regex = new RegExp(pat, 'g'); // g mod to find all the occurrences
            code = code.replace(regex, `<span class="c-string">$&</span>`); // $& is the placeholder for the matched part (a backreference)
        });

        cKeywords1.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="c-keyword1">${keyword}</span>`);
        });

        cKeywords2.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="c-keyword2">${keyword}</span>`);
        });

        cKeywords3.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="c-keyword3">${keyword}</span>`);
        });

        commentPat.forEach(pat => {
            const regex = new RegExp(pat, 'g');
            code = code.replace(regex, `<span class="c-comment">$1</span>`); // $1 is a reference to the first captured group in the regular expression (that use parentheses)
        });

        snippet.innerHTML = code;
    });

    // 2. highlighting bash snippets
    bashSnippets.forEach(codeSnippet => {
        let code = codeSnippet.innerHTML;

        bashKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="bash-keyword">${keyword}</span>`);
        });

        codeSnippet.innerHTML = code;
    });
});
