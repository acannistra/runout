import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppStateWrapper({ children }) {
    let sharedState = {
        measured_angles: []
    }

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}