import React, { useState } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa";
import { parseQuestions } from "../../util/questionParser";

// Settings
const SETTINGS = [
    "basic", // always selected, not shown
    "choiceLetter",
    "multiple",
    "codeChoices",
] as const;

type Setting = (typeof SETTINGS)[number];

// Labels for each setting
const SETTING_LABELS: Record<Setting, string> = {
    basic: "Basic (Always Included)",
    multiple: "Select Multiple Answers",
    choiceLetter: "Add Choice Letters",
    codeChoices: "Code in Choices",
};

const QuestionToPrompt = () => {
    const [userInput, setUserInput] = useState("");
    const [question, setQuestion] = useState(
        "(EXAMPLE) What is the first letter of the alphabet?"
    );
    const [questionDetails, setQuestionDetails] = useState({
        text: [],
        detailList: [],
    });
    const [choices, setChoices] = useState(["A. a", "B. b", "C. c"]);
    const [copied, setCopied] = useState(false);
    const [selectedSettings, setSelectedSettings] = useState<Set<Setting>>(
        new Set(["basic", "choiceLetter"])
    );
    const [error, setError] = useState("");

    // Settings
    const handleCheckboxChange = (type: Setting) => {
        setSelectedSettings((prev) => {
            const updated = new Set(prev);
            if (updated.has(type)) {
                updated.delete(type);
            } else {
                updated.add(type);
            }
            updated.add("basic");
            return updated;
        });
        setError("");
    };
    const handleSettingReset = (e: any) => {
        e.preventDefault();
        setSelectedSettings(new Set(["basic", "choiceLetter"]));
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        try {
            if (!selectedSettings.has("codeChoices")) {
                const parsedQuestion = parseQuestions(
                    userInput,
                    selectedSettings
                );

                setQuestion(parsedQuestion.question);
                setQuestionDetails(parsedQuestion.questionDetails);
                setChoices(parsedQuestion.choices);
                setError("");
            } else {
                throw new Error(
                    "Some settings are not supported in this version"
                );
            }
        } catch (error) {
            console.error("Parsing", error);
            setError(`${error}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const handleCopy = () => {
        const textToCopy = `${question}\n\n${questionDetails.text.join(
            "\n"
        )}\n\n${questionDetails.detailList.join("\n")}\n\n\n${choices.join(
            "\n"
        )}`;
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <div className="bg-gray-800 px-8 py-4 shadow-xl flex justify-evenly items-start h-screen">
            <div className="flex flex-col items-center justify-center w-[50%] h-full">
                <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">
                    Insert Question
                </h2>
                <form
                    className="w-full h-[80%] bg-gray-950 border-2 border-white rounded-3xl p-4 flex flex-col items-center"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-8 w-[95%] min-h-[70%] flex flex-col justify-center items-center">
                        <label
                            htmlFor="message"
                            className="block text-gray-400 text-lg font-medium mb-3"
                        >
                            Input your text here
                        </label>
                        <div
                            className={`flex flex-col justify-start items-center rounded-3xl border-2 w-full h-full px-4 py-2 pt-4 text-white   transition-all duration-300 ease-in-out bg-gray-900 ${
                                error
                                    ? "border-red-400 border-4"
                                    : "  border-white hover:border-blue-400 "
                            }`}
                        >
                            <textarea
                                id="message"
                                name="message"
                                value={userInput}
                                onChange={handleChange}
                                placeholder="Type / Paste your question here..."
                                className={`w-full h-[90%] bg-transparent text-white resize-none leading-tight py-4 focus:outline-none border-b-4 border-dotted  transition-all duration-300 ease-in-out ${
                                    error
                                        ? "border-red-400"
                                        : "border-white hover:border-blue-400"
                                }`}
                            ></textarea>
                            {error && (
                                <p className="text-red-400 m-auto text-md font-semibold">
                                    {`!!  ${error}  !!`}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="flex items-center justify-evenly w-full px-8 mb-6">
                        <div className="flex flex-col gap-4 text-white items-center">
                            <h2 className="text-xl font-semibold">Settings</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 ">
                                {SETTINGS.filter(
                                    (type) => type !== "basic"
                                ).map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center gap-3 text-md"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSettings.has(type)}
                                            onChange={() =>
                                                handleCheckboxChange(type)
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                        />
                                        {SETTING_LABELS[type]}
                                    </label>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleSettingReset}
                                className="bg-gradient-to-r from-red-500 to-rose-800 hover:from-rose-800 hover:to-red-500 text-white font-semibold mt-4 mb-2 py-2 px-6 rounded-lg transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-green-500 hover:to-blue-500 hover:from-green-700 hover:border-white border-gray-950 border-2 text-white text-xl font-semibold py-6 px-6 rounded-lg transition-colors"
                        >
                            Generate
                        </button>
                    </div>
                </form>
            </div>

            {/* Output */}
            <div className="flex flex-col items-center justify-center w-[50%] h-full">
                <h2 className="text-3xl font-bold text-white mb-6">Output</h2>
                <div className="border-2 bg-gray-950 border-white rounded-3xl p-8 w-[90%] h-[80%] flex flex-col gap-6 overflow-auto transition-all duration-300 ease-in-out">
                    <h3 className="text-xl font-black text-white">
                        {question}
                    </h3>

                    <ul className="text-white space-y-2">
                        {questionDetails.text.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <ul className="text-white space-y-2">
                        {questionDetails.detailList.map((item, index) => (
                            <li className="text-cyan-200" key={index}>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-6 rounded-xl bg-gray-900 py-2 pb-4 px-4 items-center">
                        <h4 className="text-2xl font-bold text-center text-white">
                            Choices
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-12 gap-y-6 ">
                            {choices.map((choice, index) => (
                                <li
                                    className="text-yellow-200 text-md font-semibold"
                                    key={index}
                                >
                                    {choice}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="mt-6 bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center sticky bottom-0"
                    >
                        {copied ? (
                            <span className="flex items-center gap-x-3">
                                Copied <FaCheck />
                            </span>
                        ) : (
                            <span className="flex items-center gap-x-3">
                                Copy <FaClipboard />
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionToPrompt;
