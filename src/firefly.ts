import "dotenv/config";
import "@sapphire/plugin-subcommands/register";
import "@sapphire/plugin-utilities-store/register";

import { Client } from "./libraries";

void new Client().login(process.env.TOKEN);
