import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message, InteractionResponse, SlashCommandBuilder, GuildMember, Guild, Role } from "discord.js";

import { EmbedBuilder, Staff } from "../../libraries";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

@ApplyOptions<Command.Options>({
    name: "rank",
    aliases: ["leaderboard"],
    description: "Display top rank staff members.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    fullCategory: ["moderator"],
    preconditions: ["ModeratorOnly"],
})
export class RankCommand extends Command {
    public prisma: PrismaClient = new PrismaClient();
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command: SlashCommandBuilder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: ["1068139995103244289"],
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
        return ctx.reply({ content: "COMMAND NYA RUSAK LAGI BERGELUD DENGAN ALGORITMANYA BENTAR YAK :)" });
    }
}
