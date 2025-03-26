// Settings
const SETTINGS = [
    "basic", // always selected, not shown
    "multiple",
    "choiceLetter",
    "codeChoices",
] as const;

type Setting = (typeof SETTINGS)[number];

export const parseQuestions = (
    userInput: string,
    settings: Set<Setting>
): {
    question: string;
    questionDetails: { text: string[]; detailList: string[] };
    choices: string[];
} => {
    let question = "";
    let questionDetails: { text: string[]; detailList: string[] } = {
        text: [],
        detailList: [],
    };
    let choices: string[] = [];

    const lines = userInput.split("\n");

    // Splitting the Question and Choices
    const splitLines = lines.reduce(
        (acc: string[][], curr: string, index: number) => {
            if (
                curr === "" &&
                index > 0 &&
                lines[index - 1] === "" &&
                lines[index - 2] === ""
            ) {
                acc.push([curr]); // Start new group/subarray
            } else if (acc[acc.length - 1].length > 0 || curr !== "") {
                acc[acc.length - 1].push(curr); // Append to the current group/subarray
            }
            return acc;
        },
        [[]]
    );

    const splitLinesA = splitLines[0] || [];
    const splitLinesB = splitLines.length > 1 ? splitLines[1] : [];

    // Extracting and Formatting the Choices
    let choiceLetter = "A";
    for (let i = 0; i < splitLinesB.length; i++) {
        if (splitLinesB[i].trim() !== "") {
            let combinedChoice = ``;
            if (splitLinesB[i + 1] !== "" && i + 1 < splitLinesB.length) {
                combinedChoice = splitLinesB[i] + " " + splitLinesB[i + 1];
                i++;
            } else {
                combinedChoice = splitLinesB[i];
            }
            if (settings.has("choiceLetter")) {
                choices.push(`${choiceLetter}. ${combinedChoice}`);
                choiceLetter = String.fromCharCode(
                    choiceLetter.charCodeAt(0) + 1
                );
            } else {
                choices.push(combinedChoice);
            }
        }
    }

    // Extracting and Formatting the Question and Details
    question = splitLinesA[0];
    const detailText = [];
    const detailList = [];

    let currentListItem = "";

    for (let i = 1; i < splitLinesA.length; i++) {
        if (splitLinesA[i] !== "") {
            if (splitLinesA[i].match(/^(?:[ivxlcdmIVXLCDM]+\.\s|\d+\.\s)/)) {
                // Check for both cases
                if (currentListItem) {
                    detailList.push(currentListItem);
                }
                currentListItem = splitLinesA[i];
            } else {
                if (currentListItem) {
                    currentListItem += ` ${splitLinesA[i]}`;
                } else {
                    detailText.push(splitLinesA[i]);
                }
            }
        }
    }

    if (currentListItem) {
        detailList.push(currentListItem);
    }

    questionDetails.text = detailText;
    questionDetails.detailList = detailList;

    if (settings.has("multiple")) {
        question += " (Select all that apply)";
    }

    console.log({
        question,
        questionDetails,
        choices,
    });

    return {
        question,
        questionDetails,
        choices,
    };
};

// TODO 2: Implement the parseCodeInChoices function
