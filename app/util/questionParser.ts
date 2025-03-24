export const parseBasicQuestion = (userInput: string) => {
    let question = "";
    let questionDetails = [""];
    let choices: string[] = [];

    const lines = userInput.split("\n").filter((line) => line.trim() !== "");
    if (lines.length > 0) {
        question = lines[0];
        choices = lines
            .slice(1)
            .map(
                (choice, index) =>
                    `${String.fromCharCode(65 + index)}. ${choice}`
            );
    }

    return {
        question,
        questionDetails,
        choices,
    };
};

export const parseMultipleAnswersQuestion = (userInput: string) => {
    let question = "";
    let questionDetails = [""];
    let choices: string[] = [];

    const lines = userInput.split("\n").filter((line) => line.trim() !== "");
    if (lines.length > 0) {
        question = lines[0] + " (Select all that apply)";
        choices = lines
            .slice(1)
            .map(
                (choice, index) =>
                    `${String.fromCharCode(65 + index)}. ${choice}`
            );
    }

    return {
        question,
        questionDetails,
        choices,
    };
};

export const parseSequenceQuestion = (userInput: string) => {
    let question = "";
    let questionDetails: string[] = [];
    let choices: string[] = [];

    const lines = userInput.split("\n").filter((line) => line.trim() !== "");

    if (lines.length > 0) {
        // First line is the question
        question = lines[0];

        const sequenceSteps: string[] = [];
        let i = 1;

        // Collect all the Roman numeral lines as details
        while (i < lines.length && /^[ivxlc]+\.\s+/i.test(lines[i])) {
            sequenceSteps.push(lines[i]);
            i++;
        }

        // Remaining lines are the answer choices
        const rawChoices = lines.slice(i);

        // Format answer choices with A., B., etc.
        choices = rawChoices.map((choice, index) => {
            return `${String.fromCharCode(65 + index)}. ${choice}`;
        });

        // Set the question details as a string array
        questionDetails = sequenceSteps;
    }

    return {
        question,
        questionDetails,
        choices,
    };
};
