import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { InteractionResponse, Message, SlashCommandBuilder, User } from "discord.js";

import { EmbedBuilder, Emojis } from "../../libraries";

@ApplyOptions<Command.Options>({
    name: "register",
    description: "Honkai: Star Rail Indonesia staff register.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    fullCategory: ["moderator"],
    preconditions: ["ModeratorOnly"],
})
export class RegisterCommand extends Command {
    private prisma: PrismaClient = new PrismaClient();
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command: SlashCommandBuilder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: ["1068139995103244289"],
            idHints: [],
        });
    }

    public override async messageRun(message: Message): Promise<Message> {
        const user: User = message.author;
        return (await this.response(message, user)) as Message;
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user: User = interaction.user;
        return (await this.response(interaction, user)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction, user: User): Promise<Message | InteractionResponse> {
        const dbForStaff = await this.prisma.staff.findUnique({ where: { userId: user.id } });

        if (!dbForStaff) {
            try {
                void (await this.prisma.staff.create({
                    data: {
                        userId: user.id,
                        activityPoint: 100,
                        attendSum: 0,
                        attendStreak: 0,
                        attendPerMonth: 0,
                        lastMessage: new Date(),
                        lastAttend: new Date(),
                    },
                }));

                return await ctx.reply({
                    embeds: [new EmbedBuilder().setDescription(`${Emojis.checkmark}・Berhasil mendaftarkan diri Anda!`).isSuccessEmbed()],
                });
            } catch (error) {
                return await ctx.reply({
                    embeds: [new EmbedBuilder().setDescription(`Gagal terkoneksi ke database: \`\`\`${error}\`\`\``).isErrorEmbed()],
                });
            }
        }

        return await ctx.reply({
            embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・Anda sudah terdaftar!`).isErrorEmbed()],
        });
    }
}
