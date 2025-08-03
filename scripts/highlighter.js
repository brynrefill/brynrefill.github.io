/*** highlighter of code snippets ***/
document.addEventListener("DOMContentLoaded", function () {
    const cSnippets      = document.querySelectorAll('.c-language');
    const pythonSnippets = document.querySelectorAll('.python-language');
    const bashSnippets   = document.querySelectorAll('.bash-language');

    // C keywords
    const cKeywords1 = ['void', 'char', 'int', 'unsigned', 'long', 'NULL'];
    const cKeywords2 = ['if', 'else', 'while', 'return'];
    const cKeywords3 = ['printf', 'scanf', 'exit', 'fopen', 'fclose', 'fgetc', 'signal', 'setvbuf'];

    // Python keywords
    const pythonKeywords1 = [];
    const pythonKeywords2 = ['import', 'as', 'from', 'for', 'in', 'if', 'elif', 'else'];
    const pythonKeywords3 = ['open', 'print', 'range', 'bin', 'len', 'int', 'chr', 'array', 'getdata', 'exit'];

    // Bash keywords
    const bashKeywords = ['file', 'strings', 'echo', 'nm', 'grep', 'printf', 'nc', 'curl', 'gpg', 'python3', 'base64']
    
    // patterns for strings and comments
    const stringPat  = ['"[^"]*"', "'[^']*'"];
    const cCommentPat = ["(//.*)"];
    const pythonCommentPat = ["(#.*)"];

    // regexes are applied to identify language keywords, comments and stings
    // 1. highlighting C snippets
    cSnippets.forEach(snippet => {
        let code = snippet.innerHTML;

        stringPat.forEach(pat => {
            const regex = new RegExp(pat, 'g'); // g mod to find all the occurrences
            code = code.replace(regex, `<span class="string">$&</span>`); // $& is the placeholder for the matched part (a backreference)
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

        cCommentPat.forEach(pat => {
            const regex = new RegExp(pat, 'g');
            code = code.replace(regex, `<span class="c-comment">$1</span>`); // $1 is a reference to the first captured group in the regular expression (that use parentheses)
        });

        snippet.innerHTML = code;
    });

    // 2. highlighting Python snippets
    pythonSnippets.forEach(snippet => {
        let code = snippet.innerHTML;

        stringPat.forEach(pat => {
            const regex = new RegExp(pat, 'g');
            code = code.replace(regex, `<span class="string">$&</span>`);
        });

        pythonKeywords1.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="python-keyword1">${keyword}</span>`);
        });

        pythonKeywords2.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="python-keyword2">${keyword}</span>`);
        });

        pythonKeywords3.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="python-keyword3">${keyword}</span>`);
        });

        pythonCommentPat.forEach(pat => {
            const regex = new RegExp(pat, 'g');
            code = code.replace(regex, `<span class="python-comment">$1</span>`);
        });

        snippet.innerHTML = code;
    });

    // 3. highlighting Bash snippets
    bashSnippets.forEach(codeSnippet => {
        let code = codeSnippet.innerHTML;

        bashKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="bash-keyword">${keyword}</span>`);
        });

        codeSnippet.innerHTML = code;
    });
});
