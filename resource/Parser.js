const Lexer = require("./Lexer.js");

class Parser {
    constructor(code) {
        this.count = 0;
        this.defined = {};
        this.funcs = {
            print: arg => {
                if (isNaN(arg) && !arg.startsWith("\"")) {
                    arg = this.defined[arg];
                }
                console.log(arg);
            }
        }
        this.tokens = Lexer.Tokenize(code);
        var typedef = "";
        var mathOperations = ["+", "*", "/", "-"]

        while (this.count < this.tokens.length) {
            let symbol = this.consume();

            if (symbol.startsWith("//")) continue;
            if (typedef) {
                while (symbol != "$DECL_END$") {
                    this.defined[typedef] += symbol;
                    symbol = this.consume();
                }

                /* EVALUATE VALUES */
                if (!this.defined[typedef].startsWith("\"")) {

                    if (this.defined[typedef].split("").find(c => mathOperations.includes(c))) {

                        // math - split operations
                        var expression = this.defined[typedef];
                        expression = expression.split("").filter(c => c).join("");

                        var buffer = "";
                        var parsedExpression = [];

                        for (let i = 0; i < expression.length; ++i) {
                            if (mathOperations.includes(expression[i])) {
                                parsedExpression.push(buffer.trim(), expression[i]);
                                buffer = "";
                            } else {
                                buffer += expression[i];
                            }
                        }
                        parsedExpression.push(buffer);

                        var operation = undefined;
                        var previous = 0;
                        parsedExpression.map(n => {
                            n = n.trim();
                            if (mathOperations.includes(n)) {
                                operation = n;
                                return;
                            };

                            if (isNaN(n)) {
                                if (!this.defined[n]) throw new Error(`Undeclared Variable: ${n}`);
                                n = this.defined[n];
                            }

                            if (!previous) {
                                previous = Number(n);
                                return;
                            };

                            if (!operation) throw new Error("Operation Undefined");

                            switch (operation) {
                                case "+":
                                    previous += Number(n);
                                    operation = undefined;
                                    break;
                                case "-":
                                    previous -= Number(n);
                                    operation = undefined;
                                    break;
                                case "*":
                                    previous *= Number(n);
                                    operation = undefined;
                                    break;
                                case "/":
                                    previous /= Number(n);
                                    operation = undefined;
                                    break;
                            }
                        });
                        this.defined[typedef] = previous;
                    } else {
                        this.defined[typedef] = Number(this.defined[typedef]);
                    }
                } else {
                    if (this.defined[typedef].split("").find(c => mathOperations.includes(c))) {

                    }
                }
                typedef = "";
            }

            if (symbol == "=") {
                typedef = this.previous(2);
                this.defined[typedef] = "";
            } else if (symbol == "(") {
                let funcName = this.previous(2);
                if (!this.funcs[funcName]) throw new Error(`Invalid Function: ${funcName}`);
                let args = [];
                symbol = this.consume();
                while (symbol != ")") {
                    args.push(symbol);
                    symbol = this.consume();
                }

                this.funcs[funcName](...args);
            }
        }
    }

    peak(n) {
        return this.tokens[this.count + n - 1];
    }
    consume() {
        this.count++;
        return this.tokens[this.count - 1];
    }
    previous(n = 1) {
        if (this.count - n <= 0) return this.tokens[0];
        return this.tokens[this.count - n]
    }
    getVariables() {
        return this.defined;
    }
}

module.exports = Parser;