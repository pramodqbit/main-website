import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const LogoWall: Block = {
  slug: "logoWall",
  interfaceName: "LogoWallBlock",
  labels: { singular: "Client logo wall", plural: "Client logo walls" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("Logos of clients that have “Show logo” ticked (only with written permission)."),
    ...sectionHeadFields(),
  ],
};
