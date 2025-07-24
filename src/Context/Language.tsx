import { createContext, useState } from "react";

export const lang = createContext<object >({
    currLang: "en",
    setCurrLang: (lang: string) => {}
});
export default function MenuContext({children}: string | any){
    const [currLang , setCurrLang] = useState()
    

    return(
        <lang.Provider value={{currLang , setCurrLang}}>{children}</lang.Provider>
    )
}

export { MenuContext };