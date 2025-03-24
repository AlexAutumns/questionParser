import React, { useState } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa";

// Importing the parseQuestion functions from the util folder
import {
    parseBasicQuestion,
    parseMultipleAnswersQuestion,
    parseSequenceQuestion,
} from "../../util/questionParser";

const QuestionToPrompt = () => {
    const [userInput, setUserInput] = useState("");
    const [question, setQuestion] = useState(
        "(EXAMPLE) What is the first letter of the alphabet?"
    );
    const [questionDetails, setQuestionDetails] = useState([""]);
    const [choices, setChoices] = useState(["A. a", "B. b", "C. c"]);
    const [copied, setCopied] = useState(false);
    const [type, setType] = useState("basic");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        try {
            let parsedQuestion;

            switch (type) {
                case "basic":
                    parsedQuestion = parseBasicQuestion(userInput);
                    break;
                case "multiple":
                    parsedQuestion = parseMultipleAnswersQuestion(userInput);
                    break;
                case "sequence":
                    parsedQuestion = parseSequenceQuestion(userInput);
                    break;

                default:
                    throw new Error(`Unsupported question type: ${type}`);
            }

            setQuestion(parsedQuestion.question);
            setQuestionDetails(parsedQuestion.questionDetails);
            setChoices(parsedQuestion.choices);
        } catch (error) {
            console.error(
                `A Parsing Error Occurred (Question Type: ${type}):`,
                error
            );
        }
    };

    const handleChange = (e: any) => {
        setUserInput(e.target.value);
    };

    const handleCopy = () => {
        const textToCopy = `${question}\n\n${choices.join("\n")}`;
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <div className="bg-gray-800 p-8 rounded-md shadow-md flex justify-evenly items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-[50%] h-full"
            >
                <h2 className="text-2xl font-bold text-white mb-4">
                    Insert Question
                </h2>
                <div className="mb-6 w-[80%] min-h-[50%] flex flex-col justify-center items-center">
                    <label
                        htmlFor="message"
                        className="block text-white text-sm font-bold mb-2"
                    >
                        Input your text here (It must have line breaks)
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={userInput}
                        onChange={handleChange}
                        placeholder="Type / Paste your question here..."
                        className="shadow border-2 border-white rounded-2xl w-full h-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                </div>
                {/* Settings */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-4">
                        <label
                            htmlFor="type"
                            className="block text-white text-sm font-bold mb-2"
                        >
                            Question Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mr-4 bg-gray-700 text-white border border-white rounded px-3 py-2 focus:outline-none"
                        >
                            <option value="basic">Basic</option>
                            <option value="multiple">Multiple Answers</option>
                            <option value="sequence">Sequence</option>
                            {/* <option value="codeQuestion">Code Question</option>
                            <option value="codeAnswers">Code Answers</option> */}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </form>

            {/* Output */}
            <div className="flex flex-col items-center justify-center w-[50%] h-full">
                <h2 className="text-2xl font-bold text-white mb-4">Output</h2>
                <div className="border-2 border-white rounded-2xl p-6 w-[90%] min-h-[50%] flex flex-col gap-4">
                    <h3 className="text-2xl">{question}</h3>
                    {type === "sequence" ? (
                        <ul>
                            {questionDetails.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <h2>{questionDetails[0]}</h2>
                    )}

                    <ul>
                        {choices.map((choice, index) => (
                            <li key={index}>{choice}</li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={handleCopy}
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                >
                    {copied ? (
                        <span className="flex justify-center items-center gap-x-2">
                            {" "}
                            Copied <FaCheck />
                        </span>
                    ) : (
                        <span className="flex justify-center items-center gap-x-2">
                            Copy <FaClipboard />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default QuestionToPrompt;
