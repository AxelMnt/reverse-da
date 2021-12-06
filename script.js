const DA_PLACEHOLDER = ` // Entre le résultat d'un DA pour en obtenir sa source\no────────────────o ↓ nbMagique\n│ monSuperModule │\no────────────────o ↓ sortie\n┌─── *\n│┌── if (nbMagique == 1337 OR nbMagique == 420)\n││ sortie = "haha funny number"\n│├── else\n││ sortie = "Ce nombre est parfaitement inintéressant, Watson."\n│└──\n└──────────`;

const BAR_REGEX = / ?[oO0]─+[oO0](?: ↓ (.+))?/;
const NAME_REGEX = / ?│ ([^│].+) │/;

// Autre regex qui match un module entier sur plusieurs lignes,
// mais ce serait limite plus galère de l'utiliser que ma méthode de ligne par ligne
// / ?o─+o(?: ↓ (?<input>.+))?\n(?:.+)? │ (?<name>.+) │(?:.+)?\n(?:.+)? o─+o(?: ↓ (?<output>.+))?/

window.onload = function() {
    document.querySelector("#daResult").placeholder = DA_PLACEHOLDER;
}

function reverseDA() {
    const inputEl = document.querySelector("#daResult"); 
    const input = inputEl.value || DA_PLACEHOLDER;

    const indentSize = parseInt(document.querySelector("#indentSize").value);
    const indent = Array(isNaN(indentSize) ? 2 : indentSize).fill('\xa0').join('');

    const map = {
        "┌─── *": "---*",
        "└──────────": "------",
        "┌── ": "",
        "├── if": "elseif",
        "├── else": "else",
        "└──": "endif",
        "╔══ ": "",
        "║ ": indent,
        "║": indent,
        "╙──": "endwhile",
        "├": indent,
        "│ ": indent,
        "│": indent,
        "└": indent,
        "─": "",
        "≠": "!=",
        "≥": ">=",
        "≤": "<=",
    };

    const module = {
        startLine: -1,
        input: null,
        name: null,
        output: null
    };

    const lines = input.split("\n"); 
    const reversedLines = [];

    for (let i = 0; i < lines.length; i++) {
        // Première ligne d'un module
        if (module.startLine == -1) {
            module.input = lines[i].match(BAR_REGEX);
            
            if (module.input) {
                module.startLine = i;
            }
        }
        // deuxième
        else if (i == module.startLine + 1) {
            module.name = lines[i].match(NAME_REGEX);
        }
        // dernière
        else {
            module.output = lines[i].match(BAR_REGEX);

            lines[i] = lines[i].replace(
                BAR_REGEX, 
                `module(${module.name[1] || ""};${module.input[1] || ""};${module.output[1] || ""})`
            );

            module.startLine = -1;
            module.input = null;
            module.name = null;
            module.output = null;
        }

        if (module.startLine == -1) {
            for (let key of Object.keys(map)) {
                lines[i] = lines[i].replaceAll(key, map[key]);
            }

            reversedLines.push(lines[i]);
        }
    }

    inputEl.value = reversedLines.join("\n");
}