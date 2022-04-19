const TESTCODE = `precision highp float;

uniform float iFrame;
uniform vec2 iResolution;


// code here
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iFrame/ 100.0 + uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
    {
    {
    {
    {

    }
    }
    }
    }
}

void main()  {
    gl_FragColor.w = 1.0;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}`

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

// consts
const operators = [
    '+', '-', '*', '/', '%', '>', '<', '!', '&', '|', '^', '~', '=', '?',
    ':', '++', '--', '==', '!=', '>=', '<=', '&&', '||', '>>', '<<', '+=',
    '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|='
]
const digits = "0123456789"
const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^`{|}~';
const wordStart = "abcdefghijklmnopqrstuvwxyz_"
const wordContinue = wordStart + digits

// util
function isWhitespace(char) {
    return (/\s/).test(char);
}

function constistsOf(string, characters) {
    for (let i = 0; i < string.length; i++) {
        if (!characters.includes(string[i])) return false;
    }

    return true && string.length > 0;
}

function isWord(string) {
    for (let i = 1; i < string.length; i++) {
        if (!wordContinue.includes(string[i])) return false;
    }

    return wordStart.includes(string[0].toLowerCase());
}


// tokenizer
function tokenize(string) {
    let token = "";
    let tokkenArray = [];

    // states
    let isComment = false;
    let isChar = false;
    let isString = false;
    let isPragma = false;

    //
    for (let i = 0; i < string.length; i++) {
        const char = string[i];

        if (char === "\n") {
            if (isComment && token.startsWith("/*")) {
                token += char;

            } else if (isPragma) {
                tokkenArray.push(token);

                tokkenArray.push(char);
                token = "";
                isPragma = false;

            } else {
                if (token !== "") {
                    tokkenArray.push(token);
                }

                tokkenArray.push(char);
                token = "";

                isComment = false;
                isChar = false;
                isString = false;
            }

        } else if (isPragma) {
            token += char;

        } else if (isComment) {

            if (char == "/" && token.endsWith("*") && token.startsWith("/*")) {
                tokkenArray.push(token);

                token = "";
                isComment = false;

            } else {
                token += char;
            }

        } else if (char === '"' && !isChar) {
            if (!isString) {
                if (token !== "") {
                    tokkenArray.push(token);
                }

                token = char;
                isString = true;

            } else if (token.length && token.endsWith("\\")) {
                token += char;

            } else {
                token += char;
                tokkenArray.push(token);

                token = "";
                isString = false;
            }

        } else if (isString) {
            token += char;

        } else if (isChar) {
            if (char === "'") {
                token += char;
                tokkenArray.push(token);

                token = "";
                isChar = false;

            } else {
                token += char;
            }

        } else if (char === "'" && !isString) {
            if (token !== "") {
                tokkenArray.push(token);
            }

            token = char;
            isChar = true;

        } else if (char === "#") {
            if (token !== "") {
                tokkenArray.push(token);
            }

            token = char;
            isPragma = true;

        } else if (token == "/" && "*/".includes(char)) {
            token += char;
            isComment = true;

        } else if (symbols.includes(char)) {
            if (operators.includes(token + char)) {
                token += char;

            } else if (char === ".") {
                // todo:
                if (constistsOf(token, digits)) {
                    token += char;

                } else {
                    if (token !== "") {
                        tokkenArray.push(token);
                    }

                    token = char;
                }

            } else {
                if (token !== "") {
                    tokkenArray.push(token);
                }

                token = char;
            }

        } else {
            if (constistsOf(token, symbols)) {
                tokkenArray.push(token);

                token = "";
            }

            if (isWhitespace(char)) {
                if (token !== "") {
                    tokkenArray.push(token);
                }

                token = "";

            } else {
                token += char;
            }
        }
    }

    if (token !== "") {
        tokkenArray.push(token);
    }

    return tokkenArray;
}

/**
 * rules:
 *      token: newline, last: isBracketOpen -> increment indent
 *      
 */

function formatter(tokens) {
    let indent = 0;
    let tab = "    ";
    let result = "";

    let lastToken = "";

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        // let nextToken = i + 1 < tokens.length ? tokens[i + 1] : "";

        if (isWord(token)) {
            if (!"(.[{".includes(lastToken)) {
                result += " ";
            }

            result += token;
        } else if (token === "\n") {
            if ("{[(".includes(lastToken)) {
                indent++;
            }

            result += token;
            result += tab.repeat(indent);

        } else if (")]}".includes(token)) {
            if (lastToken === "\n") {
                indent--;
            }

            result += token;
        } else {
            result += token;
        }

        lastToken = result;

        // // pre
        // if (token === "}") {
        //     indent--;
        // }

        // // token
        // if (lastToken === "\n") {
        //     result += tab.repeat(indent);

        //     // if (isWord(token)) {
        //     //     result += token;
        //     // } else {
        //     //     result += token;
        //     // }
        //     result += token;

        // } else {
        //     if (i > 0
        //         && !(
        //             ".;[]()},".includes(token) && ".;[](){}".includes(lastToken)) && lastToken != ".") {
        //         result += " ";
        //     }
        //     result += token;
        // }

        // // post
        // if (token === "{") {
        //     indent++;
        // }
        // lastToken = token;
    }

    return result;
}



// main
let tokens = tokenize(TESTCODE);
console.log(tokens);
let formatted = formatter(tokens);
console.log(formatted);