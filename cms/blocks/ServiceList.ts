import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const ServiceList: Block = {
  slug: "serviceList",
  interfaceName: "ServiceListBlock",
  labels: { singular: "Service list", plural: "Service lists" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("A list of services with their outcome headline."),
    ...sectionHeadFields(),
    {
      name: "services",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: { description: "Leave empty to show all services, ordered by their “Order” field." },
    },
  ],
};
