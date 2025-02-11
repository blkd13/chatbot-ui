// ./src/app/models.ts

import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export enum UserStatus {
    // アクティブ系
    Active = "Active",                // アクティブ状態
    Inactive = "Inactive",            // 非アクティブ状態

    // セキュリティ系
    Suspended = "Suspended",          // アクセス停止
    Locked = "Locked",                // アカウントロック
    Banned = "Banned",                // アクセス禁止

    // アカウントの状態系
    Deleted = "Deleted",              // 削除済み
    Archived = "Archived",            // アーカイブ済み
}

export enum UserRole {
    Maintainer = 'Maintainer', // メンテナ
    User = 'User', // ユーザー

    Owner = 'Owner', // 所有者
    Admin = 'Admin', // 管理者（オーナーに統合したので今は使わない）
    Member = 'Member', // メンバー（スレッドの作成、編集、削除ができる）
    Viewer = 'Viewer', // 閲覧者（スレッドの閲覧のみ）
    Guest = 'Guest', // ゲスト（スレッドの閲覧のみ）
}

export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role: UserRole,
        public status: UserStatus,
        // public profilePictureUrl: string
    ) { }
}
export class TwoFactorAuthDetails {
    constructor(
        public userId: number,
        public secret: string,
        public qrCodeUrl: string
    ) { }
}

export type GPTModels = 'gpt-4o' | 'gpt-4-vision-preview' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash-001' | 'gemini-1.5-pro-001' | 'gemini-1.5-flash-002' | 'gemini-1.5-pro-002' | 'gemini-1.0-pro' | 'gemini-1.0-pro-vision' | 'claude-3-5-sonnet-v2@20241022' | 'gemini-2.0-flash-exp';


export interface CachedContent {
    id: string;
    name: string;
    model: string;
    createTime: string;
    updateTime: string;
    expireTime: string;
}

export type ChatCompletionCreateParamsWithoutMessages = Omit<ChatCompletionCreateParamsBase, 'messages'>;
export interface ChatCompletionStreamInDto {
    args: ChatCompletionCreateParamsBase & { isGoogleSearch?: boolean, cachedContent?: CachedContent, safetySettings?: SafetyRating[] };
    options?: {
        idempotencyKey: string
    };
}
export interface ChatCompletionWithoutMessagesStreamInDto {
    args: ChatCompletionCreateParamsWithoutMessages;
    options?: {
        idempotencyKey: string
    };
}

export type SafetyRatingCategory = 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_DANGEROUS_CONTENT' | 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT';
export const safetyRatingLabelMap: Record<SafetyRatingCategory, string> = {
    HARM_CATEGORY_HATE_SPEECH: '悪意のある表現（ヘイトスピーチ）', // ID や保護されている属性をターゲットとする否定的なコメントや有害なコメント
    HARM_CATEGORY_DANGEROUS_CONTENT: '危険なコンテンツ', // 有害な商品、サービス、アクティビティへのアクセスを促進または可能にする
    HARM_CATEGORY_HARASSMENT: 'ハラスメントコンテンツ', // 他人をターゲットにした悪口、威圧表現、いじめ、虐待的な内容を含むコメント
    HARM_CATEGORY_SEXUALLY_EXPLICIT: '性的に露骨なコンテンツ', // 性行為やわいせつな内容に関する情報が含まれるコンテンツ
};
export interface SafetyRating {
    category: SafetyRatingCategory;
    blocked?: boolean;
    probability: string;
    probabilityScore: number;
    severity: string;
    severityScore: number
}


export type MessageGroupType = 'SINGLE' | 'PARALLEL' | 'REGENERATED';
// export type MessageGroup = { seq: number, id: string, previousMessageId: string, type: MessageGroupType, messages: MessageForView[], selected: boolean, };

// export interface ChatInputDto {
//     messageList: MessageForView[];
//     model?: GPTModels;
//     max_tokens?: number | null;
//     temperature?: number | null;
//     top_p?: number | null;

//     // Gemini用:コンテキストキャッシュ
//     cachedContent?: CachedContent;
//     // Gemini用:安全性設定
//     safetySettings?: SafetyRating[];
// }


export interface GenerateContentRequestForCache {
    ttl?: { seconds: number, nanos: number };
    expire_time?: string; // "expire_time":"2024-06-30T09:00:00.000000Z"
}