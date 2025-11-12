export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  images: string[];
}

export interface OwnedProduct {
  id: string;
  productId: string;
  userId: string;
  purchaseDate: string;
  licenseKey: string;
  product: Product;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Analytics {
  totalRevenue: number;
  totalPurchases: number;
  activeUsers: number;
  recentPurchases: {
    id: string;
    productName: string;
    username: string;
    amount: number;
    date: string;
  }[];
  revenueChart: {
    month: string;
    revenue: number;
  }[];
}

export interface LinkedAccount {
  platform: string;
  username: string;
  userId: string;
  linkedDate: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  avatar_url: string;
  public_flags: number;
  flags: number;
  banner: string;
  accent_color: number;
  global_name: string;
  avatar_decoration: boolean;
  banner_color: string;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
}

export interface RobloxUser {
  sub: string;
  name: string;
  nickname: string;
  referred_username: string;
  created_at: number;
  profile: string;
  picture: string;

  jti: string | null;
  iss: string | null;
  aud: string | null;

  state: string | null;
  nonce: string | null;

  access_token: string;
  refresh_token: string;
  id_token: string;
}

export type ApiResponse<T> =
  | { error: true; statusCode: number; message: string }
  | { error: false; statusCode: number; data: T };
