import noblox from 'noblox.js';

export const get_id = async (username: string) => await noblox.getIdFromUsername(username);

export const get_user = async (userId: number) => await noblox.getPlayerInfo(userId);