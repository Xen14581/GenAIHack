import apiUrl from "./baseurl";
import axios from "axios"

const getChatHistory = async (data) => {
    // return await axios.post(apiUrl + "/login", data=data)
    return [
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        {'role': 'user', 'parts': 'Hello'},
        {'role': 'assistant', 'parts': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
    ]
}

const stream = async () => {
    try {
        const resp = await fetch(url, {});
        if (!resp.ok || !resp.body) {
            throw resp.statusText;
        }

        const reader = resp.body.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }

            setState(prevState => ({ ...prevState, ...{ data: value } }));
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            setState(prevState => ({ ...prevState, ...{ error: err } }));
        }
    }
}

export default getChatHistory;  