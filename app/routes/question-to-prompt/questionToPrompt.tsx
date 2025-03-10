import React, { useState } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa";

const QuestionToPrompt = () => {
    const [userInput, setUserInput] = useState("");
    const [question, setQuestion] = useState(
        "What is the first letter of the alphabet?"
    );
    const [choices, setChoices] = useState(["A. a", "B. b", "C. c"]);
    const [copied, setCopied] = useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        try {
            const lines = userInput
                .split("\n")
                .filter((line) => line.trim() !== "");
            if (lines.length > 0) {
                setQuestion(lines[0]);
                setChoices(
                    lines
                        .slice(1)
                        .map(
                            (choice, index) =>
                                `${String.fromCharCode(65 + index)}. ${choice}`
                        )
                );
            }
        } catch (error) {
            console.error("An Error Occurred", error);
        }
    };

    const handleChange = (e) => {
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
                        className="shadow border-2 border-white rounded-2xl w-full h-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </form>
            <div className="flex flex-col items-center justify-center w-[50%] h-full">
                <h2 className="text-2xl font-bold text-white mb-4">Output</h2>
                <div className="border-2 border-white rounded-2xl p-6 w-[90%] min-h-[50%] flex flex-col gap-4">
                    <h3 className="text-2xl">{question}</h3>
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
