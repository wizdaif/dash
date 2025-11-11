export enum Messages {
    INVALID_COMMAND = "",
    INVALID_HANDLER = "",
    MISSING_PERMISSION = "",
}

type Config = {
    linkStrategy: "mixed" | "bloxlink" | "standalone",
    cosmetics: {
        defaultEmbedColor: `#${string}`
    }
}

export default {
    linkStrategy: "mixed", // the options for this are: mixed, bloxlink, standalone
    cosmetics: {
        defaultEmbedColor: "#11111"
    }
} as Config