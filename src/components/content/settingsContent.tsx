import {useContentHook} from "@/hook/ContentHook";
import {useState} from "react";
import {FormMessage, Theme} from "@/utils/types";
import {cn} from "@/lib/utils";
import {CgSpinner} from "react-icons/cg";

export default function SettingsContent() {
    const {data, setData} = useContentHook();
    const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Handle the API Key change
     *
     * @param value the value
     */
    function handleAPIKeyChange(value: string) {
        setData(currentData => ({
            ...currentData,
            api: {
                ...currentData.api,
                apiKey: value
            }
        }));
    }

    /**
     * Handle the Organization Key change
     *
     * @param value the value
     */
    function handleOrgKeyChange(value: string) {
        setData(currentData => ({
            ...currentData,
            api: {
                ...currentData.api,
                organizationKey: value
            }
        }));
    }

    /**
     * Verify the API Key
     */
    function verifyAPIKey() {
        setData(currentData => ({
            ...currentData,
            api: {
                ...currentData.api,
                verified: new Date()
            }
        }));
    }

    function handleCheckAPIKey() {
        // Reset the form message
        setFormMessage(null);

        // If api key is not set, return
        if (!data.api.apiKey) {
            setFormMessage({
                type: 'error',
                field: 'global',
                message: 'API Organization Key are required!'
            });
            return;
        }

        if (data.api.apiKey.trim() === '') {
            setFormMessage({
                type: 'error',
                field: 'api-key',
                message: 'API Key is required!'
            });
            return;
        }

        try {
            // Set loading to true
            setLoading(true);

            // Get the OpenAI models
            fetch("https://api.openai.com/v1/models", {
                headers: {
                    Authorization: `Bearer ${data.api.apiKey}`,
                    ...(data.api.organizationKey && {"OpenAI-Organization": data.api.organizationKey})
                } as any
            }).then(response => response.json()).then(data => {
                setFormMessage({
                    type: 'success',
                    field: 'global',
                    message: 'API Key is valid!'
                })
                verifyAPIKey();
                setLoading(false);
            }).catch(error => {
                console.error(error);
                setFormMessage({
                    type: 'error',
                    field: 'global',
                    message: `API Key is invalid! ${error.message}`
                });
                setLoading(false);
            });
        } catch (ex: any) {
            console.error(ex);
            setFormMessage({
                type: 'error',
                field: 'global',
                message: `API Key is invalid! ${ex.message}`
            });
            setLoading(false);
        }

    }

    function handleThemeChange(theme: Theme) {
        setData(currentData => ({
            ...currentData,
            theme
        }));
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid w-full max-w-sm items-center gap-2">
                <label htmlFor="api-key">
                    OpenAPI API Key
                </label>
                <input
                    type="text"
                    id="api-key"
                    placeholder="OpenAI API Key"
                    className="bg-[rgba(0,0,0,0.5)] focus:bg-[rgba(0,0,0,0.6)] border-2 border-transparent focus:border-[rgba(0,0,0,.5)] transition-colors duration-100 p-2 text-sm rounded-xl outline-none"
                    defaultValue={data.api.apiKey ?? ''}
                    onBlur={event => handleAPIKeyChange(event.target.value)}
                />
                {
                    (formMessage && formMessage.field === 'api-key') && (
                        <div
                            className={cn({
                                "text-sm": true,
                                "text-red-500": formMessage.type === 'error',
                                "text-green-500": formMessage.type === 'success'
                            })}
                        >
                            {formMessage.message}
                        </div>
                    )
                }
            </div>
            <div className="grid w-full max-w-sm items-center gap-2">
                <label htmlFor="org-key">
                    OpenAPI Organization ID
                </label>
                <input
                    type="text"
                    id="org-key"
                    placeholder="OpenAI Organization ID"
                    className="bg-[rgba(0,0,0,0.5)] focus:bg-[rgba(0,0,0,0.6)] border-2 border-transparent focus:border-[rgba(0,0,0,.5)] transition-colors duration-100 p-2 text-sm outline-none rounded-xl"
                    defaultValue={data.api.organizationKey ?? ''}
                    onBlur={event => handleOrgKeyChange(event.target.value)}
                />
                {
                    (formMessage && formMessage.field === 'org-key') && (
                        <div
                            className={cn({
                                "text-sm": true,
                                "text-red-500": formMessage.type === 'error',
                                "text-green-500": formMessage.type === 'success'
                            })}
                        >
                            {formMessage.message}
                        </div>
                    )
                }
            </div>
            {
                (formMessage && formMessage.field === 'global') && (
                    <div
                        className={cn({
                            "text-sm": true,
                            "text-red-500": formMessage.type === 'error',
                            "text-green-500": formMessage.type === 'success'
                        })}
                    >
                        {formMessage.message}
                    </div>
                )
            }
            <div className="grid w-full max-w-sm items-center gap-2">
                <button
                    className="bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.6)] transition-colors duration-100 p-2 text-sm outline-none disabled:bg-[rgba(0,0,0,0.6)] disabled:cursor-not-allowed rounded-xl"
                    disabled={loading}
                    onClick={handleCheckAPIKey}
                >
                    {
                        loading && (
                            <CgSpinner className="animate-spin inline-block mr-2"/>
                        )
                    }
                    Check API Credentials
                </button>
            </div>
            <div className="grid w-full">
                <label htmlFor="theme" className="mt-5 mb-3">
                    Preset Themes
                </label>
                <div className="flex flex-wrap flex-row gap-2">
                    {
                        data.savedThemes.map((theme, index) => (
                            <div
                                key={index}
                                className={cn({
                                    "w-10 h-10 cursor-pointer hover:border-2 border-transparent hover:border-white transition-colors duration-100": true,
                                    "border-2 border-white": theme.name === data.theme.name
                                })}
                                onClick={() => handleThemeChange(theme)}
                                style={{
                                    background: `linear-gradient(${theme.bgRotation}deg, ${theme.bgBeginColor}, ${theme.bgEndColor})`
                                }}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}