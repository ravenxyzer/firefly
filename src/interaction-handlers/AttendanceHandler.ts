import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { ButtonInteraction, InteractionResponse, TextChannel } from "discord.js";

import { Emojis, EmbedBuilder } from "../libraries";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

@ApplyOptions<InteractionHandler.Options>({
    name: "attendance",
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class AttendanceHandler extends InteractionHandler {
    public prisma: PrismaClient = new PrismaClient();
    public parse(interaction: ButtonInteraction) {
        if (interaction.customId === "attendance-button") return this.some();

        this.none();
    }

    public override async run(interaction: ButtonInteraction): Promise<InteractionResponse> {
        const dbForStaff = await this.prisma.staff.findFirst({ where: { userId: interaction.user.id } });

        if (!dbForStaff)
            return interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・Dimohon untuk melakukan register terlebih dahulu!`)],
                ephemeral: true,
            });

        const channel: TextChannel = interaction.guild.channels.cache.get("1145208321956126790") as TextChannel;
        const currentTime: Dayjs = dayjs().utcOffset(7);
        const currentDaysInMonth: number = currentTime.daysInMonth();

        const lastAttend: Dayjs = dayjs(dbForStaff.lastAttend).utcOffset(7);
        const attendStreak = this.isStreakFailed(lastAttend, currentTime) ? 1 : { increment: 1 };
        const attendPerMonth = this.isNextMonth(lastAttend, currentTime) ? 1 : { increment: 1 };

        const embed: EmbedBuilder = new EmbedBuilder()
            .setAuthor({ name: "Kehadiran Staff!", iconURL: this.container.client.user.displayAvatarURL({ size: 4096 }) })
            .setThumbnail(interaction.user.displayAvatarURL({ size: 4096 }))
            .setDescription(`${Emojis.checkmark}・${interaction.user.tag} telah mengisi absen.`)
            .setFooter({ text: "Terima kasih sudah absen dan tingkatkan terus kehadiranmu!" });

        // Attend Success
        if (this.isBeforeDay(lastAttend, currentTime)) {
            const updatedUser = await this.prisma.staff.update({
                where: { userId: interaction.user.id },
                data: { lastAttend: new Date(), attendStreak, attendPerMonth, attendSum: { increment: 1 } },
            });

            const attendPerMonthSum: number = updatedUser.attendPerMonth;
            const diff: number = attendPerMonthSum - currentDaysInMonth;

            await channel.send({
                embeds: [
                    embed.addFields([
                        { name: "Waktu", value: `${currentTime.format("HH:mm")} WIB` },
                        { name: "Total Kehadiran", value: `${updatedUser.attendSum} kali` },
                        { name: "Kehadiran Beruntun", value: `${updatedUser.attendStreak} kali` },
                        { name: "Absen Bulanan", value: `${attendPerMonthSum}/${currentDaysInMonth} (${diff} hari)` },
                        { name: "Poin Keaktifan", value: `${updatedUser.activityPoint.toLocaleString("us")} poin` },
                    ]),
                ],
            });

            return await interaction.reply({ content: `${Emojis.checkmark} ・ Absen berhasil!`, ephemeral: true });
        }

        return await interaction.reply({ content: `${Emojis.redcross} ・ Anda sudah absen hari ini.`, ephemeral: true });
    }

    private isBeforeDay(last: Dayjs, current: Dayjs): boolean {
        return last.isBefore(current, "day");
    }

    private isStreakFailed(last: Dayjs, current: Dayjs): boolean {
        return last.isBefore(current.subtract(1, "day"), "day");
    }

    private isNextMonth(last: Dayjs, current: Dayjs): boolean {
        return current.month() > last.month() || current.year() > last.year();
    }
}
