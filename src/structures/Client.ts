import { readdir } from 'fs/promises';
import { config } from '../../configuration';
import {
    ApplicationCommandDataResolvable,
    Client, Collection, Partials
} from "discord.js";

class DashClient extends Client {
    private slash: ApplicationCommandDataResolvable[] = [];
    public events = new Collection<string, any>();
    public commands = new Collection<string, any>();

    public constructor() {
        super({ 
            intents: 3276799, 
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.User,
                Partials.Message,
                Partials.Channel,
                Partials.GuildScheduledEvent,
                Partials.Reaction,
            ], 
        })
    }

    public async start() {
        this.login(process.env.DISCORD_TOKEN);

        const eventFolders = await readdir('./dist/events');
        const commandFolders = await readdir('./dist/commands');

        for (const folder of eventFolders) {
            const events = (await readdir(`./dist/events/${folder}`)).filter(f => f.endsWith('.js'||'.ts'));

            for (const eventFile of events) {
                const event = await import(`../events/${folder}/${eventFile}`) as any;

                if (!event.name) return;

                this.events.set(event.name, event);

                this.on(event.name, event.run.bind(null, this));
            }
        }

        for (const folder of commandFolders) {
            const commands = (await readdir(`./dist/commands/${folder}`)).filter(f => f.endsWith('.js'||'.ts'));

            for (const commandFile of commands) {
                const command = await import(`../events/${folder}/${commandFile}`) as any;

                if (!command.name) return;

                this.commands.set(command.name, command);

                if ([2, 3].includes(command.type)) delete command?.description;

                this.slash.push(command);
            }
        }

        this.once('ready', async () => {
            await this.guilds.cache.get(config.mainGuildID)?.commands.set(this.slash);

            console.log(`${this.user?.username} is now online...`);

            this.user?.setPresence(config.presenceData);
        })
    }
}

export { DashClient }