import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionResponse, Message, SlashCommandBuilder, User } from "discord.js";

import { EmbedBuilder } from "../../libraries";

@ApplyOptions<Command.Options>({
    name: "about",
    description: "Get information about the bot.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    fullCategory: ["core"],
})
export class AboutCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command: SlashCommandBuilder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public override async messageRun(message: Message): Promise<Message> {
        return (await this.response(message)) as Message;
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        return (await this.response(interaction)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction): Promise<Message | InteractionResponse> {
        const client: User = this.container.client.user;

        const details = {
            developer: [`- [@ravenxyzer](https://instagram.com/ravenxyzer)`],
            networkServer: [`- [Fainéant Utopia](https://discord.gg/sPcbcaKyz7)`],
            socialMedia: [
                `- [@honkaistar.indo](https://instagram.com/honkaistar.indo)`,
                `- [@honkaistarrail.id_](https://instagram.com/honkaistarrail.id_)`,
                `- [@faineant.utopia](https://instagram.com/faineant.utopia)`,
            ],
        };

        const embed: EmbedBuilder = new EmbedBuilder()
            .setAuthor({ name: client.username, iconURL: client.displayAvatarURL({ size: 1024 }) })
            .setDescription(
                "Bot multi-fungsi dan Honkai: Star Rail dari [**Honkai: Star Rail Indonesia**](https://discord.gg/WCAGWq96vv). Bergabunglah dengan kami dan tingkatkan pengalaman bermain Honkai: Star Rail dan perkuat persahabatan di komunitas game yang lebih luas."
            )
            .addFields([
                { name: "Developer", value: details.developer.join("\n") },
                { name: "Social Media", value: details.socialMedia.join("\n") },
                { name: "Network Server", value: details.networkServer.join("\n") },
            ]);

        return await ctx.reply({ embeds: [embed] });
    }

    private async getUser(id: string): Promise<User> {
        return await this.container.client.users.fetch(id);
    }
}
