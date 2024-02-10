import { GuildMember } from "discord.js";

export interface Staff {
    member: GuildMember;
    activityPoint: number;
    attendSum: number;
    attendPerMonth: number;
}
