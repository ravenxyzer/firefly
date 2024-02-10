import { Command, RegisterBehavior, CommandStore, SapphireClient } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { APIEmbedField, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";

import { EmbedBuilder } from "../../libraries";
import { ServiceUtilities } from "utilities/ServiceUtility";

@ApplyOptions<Command.Options>({
    name: "help",
    aliases: ["command", "cmd"],
    description: "Menampilkan panduan menggunakan bot.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    fullCategory: ["core"],
})
export class HelpCommand extends Command {
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

    public async response(ctx: Message | Command.ChatInputCommandInteraction): Promise<Message | InteractionResponse> {
        const client: SapphireClient<boolean> = this.container.client;
        const service: ServiceUtilities = this.container.utilities.service;
        const commands: CommandStore = this.container.stores.get("commands");

        const setCategories = new Set<string>();
        commands.forEach((command) => {
            setCategories.add(command.category ?? "Uncategorized");
        });

        const categories: string[] = Array.from(setCategories);

        let fields: APIEmbedField[] = [];
        for (const category of categories) {
            fields.push({
                name: service.capitalize(category),
                value: commands
                    .filter((command) => command.category == category)
                    .map((command) => `\`${command.name}\``)
                    .join(", "),
            });
        }

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle(`${client.user.username} - Help Directory`)
            .setThumbnail(client.user.displayAvatarURL({ size: 4096 }))
            .setDescription(
                "Panduan dan daftar lengkap perintah yang dapat Anda gunakan mulai dari pengaturan server hingga interaksi dengan fitur-fitur yang disediakan."
            )
            .addFields(fields);

        return ctx.reply({ embeds: [embed] });
    }
}
