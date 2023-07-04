"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {ContentType, Data} from "@/utils/types";

const DEFAULT_DATA: Data = {
    api: {},
    transcripts: []
}

interface ContentHookProviderProps {

    children: ReactNode;

}

interface ContentHookContext {

    data: Data

    setData: Dispatch<SetStateAction<Data>>;

    contentType: ContentType;

    setContentType: Dispatch<SetStateAction<ContentType>>;

}

const ContentHookContext = createContext<ContentHookContext>(null as unknown as ContentHookContext);

export function ContentHookProvider({children}: ContentHookProviderProps) {
    const [contentType, setContentType] = useState<ContentType>(ContentType.ADD_TRANSCRIPT);
    const [data, setData] = useState<Data>(DEFAULT_DATA);

    function saveData(data: Data) {
        localStorage.setItem("data", JSON.stringify(data));
        console.log("Saved data to localstorage");
    }

    function loadData() {
        // If localstorage doesn't have data, return
        if (!localStorage.getItem("data")) {
            return;
        }

        // Get the data from localstorage
        const data = JSON.parse(localStorage.getItem("data") as string) as Data;

        // Set the data
        setData(data);
        console.log("Loaded data from localstorage");
    }

    useEffect(() => {

        // Load the data (data.json) file
        loadData();
    }, []);

    useEffect(() => {
        if (data === DEFAULT_DATA) {
            return;
        }

        // Save the data (data.json) file
        saveData(data);
    }, [data]);

    return (
        <ContentHookContext.Provider
            value={{
                contentType,
                setContentType,
                data,
                setData
            }}
        >
            {children}
        </ContentHookContext.Provider>
    );
}

export function useContentHook() {
    const context = useContext(ContentHookContext);
    if (!context) {
        throw new Error("useContentHook must be used within a ContentHookProvider");
    }

    return context;
}