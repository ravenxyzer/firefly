import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "activity",
    event: Events.MessageCreate,
    once: false,
})
export class ActivityListener extends Listener {
    public prisma: PrismaClient = new PrismaClient();
    public async run(message: Message): Promise<void> {}
}
