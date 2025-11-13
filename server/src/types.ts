import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
  Message,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";

export type MiddlewareFn<T extends (...any: any) => void> = (
  next: () => void,
  ...args: Parameters<T>
) => void;

export type InteractionMiddlewareFn<T extends Interaction<"cached">> =
  MiddlewareFn<(interaction: T) => void>;

export type TextMiddlewareFn<T extends Message<true>> = MiddlewareFn<
  (message: T) => void
>;

export type ReplyableTextMiddlewareFn = TextMiddlewareFn<Message<true>>;

export type ReplyableInteractionMiddlewareFn = InteractionMiddlewareFn<
  | ChatInputCommandInteraction<"cached">
  | MessageContextMenuCommandInteraction<"cached">
  | UserContextMenuCommandInteraction<"cached">
  | AnySelectMenuInteraction<"cached">
  | ButtonInteraction<"cached">
  | ModalSubmitInteraction<"cached">
>;

export enum LicenseGrantType {
  Purchase = "purchase",
  User = "user",
}

export enum ProductImageType {
  RobloxDecal = "decal",
  Image = "image",
}

export enum PurchaseType {
  Robux = "robux",
  Stripe = "stripe",
  Paypal = "paypal",
}

interface ERLocals {
  admin: boolean;
  data: any;
  userId: string | null;
}
export interface ExtendedRequest {
  locals: ERLocals;
}

export enum LinkStrategy {
  Bloxlink = "bloxlink",
  Standalone = "standalone",
  Mixed = "mixed",
}

export type Config = {
  linkStrategy: LinkStrategy;
  admins: string[];
  website: {
    TAG_CONTENT: string;
    HEADER_CONTENT: string;
    SHORT_DESC: string;
    STRIPE_PUBLIC_KEY: string;
  };
  cosmetics: {
    defaultEmbedColor: `#${string}`;
  };
  errorMessages: {
    INVALID_COMMAND: string;
    INVALID_HANDLER: string;
    MISSING_PERMISSION: string;
    MISSING_ROLE: string;
  };
};
