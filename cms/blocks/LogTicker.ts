import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";

export const LogTicker: Block = {
  slug: "logTicker",
  interfaceName: "LogTickerBlock",
  labels: { singular: "Studio log ticker", plural: "Studio log tickers" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("A scrolling strip of recent Log Entries that have “Show in ticker” ticked."),
    {
      name: "limit",
      type: "number",
      defaultValue: 8,
      min: 3,
      max: 20,
      admin: { description: "How many recent log entries to show." },
    },
  ],
};
