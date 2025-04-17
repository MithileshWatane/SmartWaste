import { useState,useEffect } from "react";
import {Moon,Sun} from "lucide-react";

const DarkModeToggle = () => {
    const [darkMode,setDarkMode] = useState(
        localStorage.getItem("theme")==="dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme","dark");
        }else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme","light");
        }
    },[darkMode]);


    return (
        <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition"
        >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-500"/>
            : <Moon className="w-6 h-6 text-gray-900" />}
        </button>
    );
};

export default DarkModeToggle;