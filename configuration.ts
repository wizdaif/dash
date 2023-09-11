import { ActivityType } from "discord.js"
import type { PresenceData, Snowflake } from "discord.js"

type Config = {
    allowedIds: Snowflake[],
    mainGuildID: Snowflake,
    presenceData: PresenceData
}

export const config: Config = {
    allowedIds: [''], // this will set who can access the web dashboard
    mainGuildID: '',
    presenceData: {
        status: 'online',
        activities: [
            { 
                name: 'hub',
                type: ActivityType.Watching
            }
        ]
    }
}