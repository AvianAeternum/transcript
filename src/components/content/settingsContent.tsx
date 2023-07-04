import {useContentHook} from "@/hook/ContentHook";
import {useState} from "react";
import {FormMessage} from "@/utils/types";
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
        if (!data.api.apiKey || !data.api.organizationKey) {
            setFormMessage({
                type: 'error',
                field: 'global',
                message: 'API & Organization Key are required!'
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

        if (data.api.organizationKey.trim() === '') {
            setFormMessage({
                type: 'error',
                field: 'org-key',
                message: 'Organization Key is required!'
            });
            return;
        }

        try {
            const headers = {
                Authorization: `Bearer ${data.api.apiKey}`,
                "OpenAI-Organization": data.api.organizationKey
            }

            // Set loading to true
            setLoading(true);

            // Get the OpenAI models
            fetch("https://api.openai.com/v1/models", {
                headers: headers as unknown as HeadersInit
            }).then(response => response.json()).then(data => {
                setFormMessage({
                    type: 'success',
                    field: 'global',
                    message: 'API & Organization Key are valid!'
                })
                verifyAPIKey();
                setLoading(false);
            }).catch(error => {
                console.error(error);
                setFormMessage({
                    type: 'error',
                    field: 'global',
                    message: `API & Organization Key are invalid! ${error.message}`
                });
                setLoading(false);
            });
        } catch (ex: any) {
            console.error(ex);
            setFormMessage({
                type: 'error',
                field: 'global',
                message: `API & Organization Key are invalid! ${ex.message}`
            });
            setLoading(false);
        }

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
                    className="bg-[rgba(0,0,0,0.5)] focus:bg-[rgba(0,0,0,0.6)] border-2 border-transparent focus:border-[rgba(0,0,0,.5)] transition-colors duration-100 p-2 text-sm rounded-md outline-none"
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
                    className="bg-[rgba(0,0,0,0.5)] focus:bg-[rgba(0,0,0,0.6)] border-2 border-transparent focus:border-[rgba(0,0,0,.5)] transition-colors duration-100 p-2 text-sm rounded-md outline-none"
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
                    className="bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.6)] transition-colors duration-100 p-2 text-sm rounded-md outline-none disabled:bg-[rgba(0,0,0,0.6)] disabled:cursor-not-allowed"
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
        </div>
    )
}