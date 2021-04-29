module.exports = {
    Tokenize: code => {
        var lexered = [];

        code
            .split("\n")
            .filter(e => e)
            .map(e => e.replace(/\r/, ""))
            .map(e => {
                if (e.startsWith("//")) {
                    lexered.push(e);
                }
                if (e.includes("=")) {

                    // declaration
                    var declaration = e.split("=")
                    lexered.push(declaration[0].trim(), "=", declaration[1].trim(), "$DECL_END$");
                } else if (
                    e.includes("(") &&
                    (
                        !e.includes("\"(") &&
                        !e.includes("(\"")
                    ) &&
                    e.includes(")")
                ) {
                    var firstParen;
                    for (let i = 0; i < e.length; ++i) {
                        if (e[i] == "(") {
                            firstParen = i;
                            break;
                        }
                    }

                    lexered.push(e.slice(0, firstParen).trim()); // Func Name
                    lexered.push("(") // Open Paren

                    var args = e.slice(firstParen + 1, e.length - 1)
                        .trim()
                        .split(",")
                        .map(e => e.trim());

                    lexered.push(...args); // Args
                    lexered.push(")");
                }
            });

        return lexered;
    }
}