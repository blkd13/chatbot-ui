// ./src/app/models.ts

import { MessageForView, UUID } from "./project-models";

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

export type GPTModels = 'gpt-4-vision-preview' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash-001' | 'gemini-1.5-pro-001' | 'gemini-1.5-flash-002' | 'gemini-1.5-pro-002' | 'gemini-1.0-pro' | 'gemini-1.0-pro-vision';

export type ChatCompletionContentPart = ChatCompletionContentPartText | ChatCompletionContentPartImage;
export interface ChatCompletionContentPartImage { image_url: ChatCompletionContentPartImage.ImageURL; type: 'image_url'; }
export namespace ChatCompletionContentPartImage { export interface ImageURL { url: string; detail?: 'auto' | 'low' | 'high'; label?: string, second?: number } }
export interface ChatCompletionContentPartText { text: string; type: 'text'; }

// export type Message = ({ role: 'system', content: string } | { role: 'user' | 'assistant', content: string | ChatCompletionContentPart[] });
// type Message = { role: ChatCompletionRole, content: ChatCompletionContentPart[] };
// type MessageForView = Message & { editing: number, status: number, cacheId?: string, selected: boolean, previousMessageId: string, id: UUID };

export interface CachedContent {
    id: string;
    name: string;
    model: string;
    createTime: string;
    updateTime: string;
    expireTime: string;
}

namespace ChatCompletionCreateParams {
    export interface ResponseFormat {
        /**
         * Must be one of `text` or `json_object`.
         */
        type?: 'text' | 'json_object';
    }
}

namespace Shared {
    export interface FunctionDefinition {
        /**
         * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
         * underscores and dashes, with a maximum length of 64.
         */
        name: string;

        /**
         * A description of what the function does, used by the model to choose when and
         * how to call the function.
         */
        description?: string;

        /**
         * The parameters the functions accepts, described as a JSON Schema object. See the
         * [guide](https://platform.openai.com/docs/guides/text-generation/function-calling)
         * for examples, and the
         * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
         * documentation about the format.
         *
         * Omitting `parameters` defines a function with an empty parameter list.
         */
        parameters?: FunctionParameters;
    }
}

/**
 * The parameters the functions accepts, described as a JSON Schema object. See the
 * [guide](https://platform.openai.com/docs/guides/text-generation/function-calling)
 * for examples, and the
 * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
 * documentation about the format.
 *
 * Omitting `parameters` defines a function with an empty parameter list.
 */
export type FunctionParameters = Record<string, unknown>;

export interface ChatCompletionTool {
    function: Shared.FunctionDefinition;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
}

/**
 * Controls which (if any) tool is called by the model. `none` means the model will
 * not call any tool and instead generates a message. `auto` means the model can
 * pick between generating a message or calling one or more tools. `required` means
 * the model must call one or more tools. Specifying a particular tool via
 * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
 * call that tool.
 *
 * `none` is the default when no tools are present. `auto` is the default if tools
 * are present.
 */
export type ChatCompletionToolChoiceOption = 'none' | 'auto' | 'required' | ChatCompletionNamedToolChoice;

/**
 * Specifies a tool the model should use. Use to force the model to call a specific
 * function.
 */
export interface ChatCompletionNamedToolChoice {
    function: ChatCompletionNamedToolChoice.Function;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
}

export namespace ChatCompletionNamedToolChoice {
    export interface Function {
        /**
         * The name of the function to call.
         */
        name: string;
    }
}

/**
 * The role of the author of a message
 */
export type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';


export interface ChatCompletionCreateParamsBase {
    /**
     * A list of messages comprising the conversation so far.
     * [Example Python code](https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models).
     */
    messages: (MessageForView | { role: ChatCompletionRole, messageId: UUID, cacheId?: string })[];

    /**
     * ID of the model to use. See the
     * [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility)
     * table for details on which models work with the Chat API.
     */
    model?: GPTModels;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
     * existing frequency in the text so far, decreasing the model's likelihood to
     * repeat the same line verbatim.
     *
     * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/guides/text-generation/parameter-details)
     */
    frequency_penalty?: number | null;

    /**
     * Deprecated in favor of `tool_choice`.
     *
     * Controls which (if any) function is called by the model. `none` means the model
     * will not call a function and instead generates a message. `auto` means the model
     * can pick between generating a message or calling a function. Specifying a
     * particular function via `{"name": "my_function"}` forces the model to call that
     * function.
     *
     * `none` is the default when no functions are present. `auto` is the default if
     * functions are present.
     */
    // function_call?: 'none' | 'auto' | ChatCompletionFunctionCallOption;

    /**
     * Deprecated in favor of `tools`.
     *
     * A list of functions the model may generate JSON inputs for.
     */
    // functions?: Array<ChatCompletionCreateParams.Function>;

    /**
     * Modify the likelihood of specified tokens appearing in the completion.
     *
     * Accepts a JSON object that maps tokens (specified by their token ID in the
     * tokenizer) to an associated bias value from -100 to 100. Mathematically, the
     * bias is added to the logits generated by the model prior to sampling. The exact
     * effect will vary per model, but values between -1 and 1 should decrease or
     * increase likelihood of selection; values like -100 or 100 should result in a ban
     * or exclusive selection of the relevant token.
     */
    logit_bias?: Record<string, number> | null;

    /**
     * Whether to return log probabilities of the output tokens or not. If true,
     * returns the log probabilities of each output token returned in the `content` of
     * `message`.
     */
    logprobs?: boolean | null;

    /**
     * The maximum number of [tokens](/tokenizer) that can be generated in the chat
     * completion.
     *
     * The total length of input tokens and generated tokens is limited by the model's
     * context length.
     * [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
     * for counting tokens.
     */
    max_tokens?: number | null;

    /**
     * How many chat completion choices to generate for each input message. Note that
     * you will be charged based on the number of generated tokens across all of the
     * choices. Keep `n` as `1` to minimize costs.
     */
    n?: number | null;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on
     * whether they appear in the text so far, increasing the model's likelihood to
     * talk about new topics.
     *
     * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/guides/text-generation/parameter-details)
     */
    presence_penalty?: number | null;

    /**
     * An object specifying the format that the model must output. Compatible with
     * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
     * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
     *
     * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
     * message the model generates is valid JSON.
     *
     * **Important:** when using JSON mode, you **must** also instruct the model to
     * produce JSON yourself via a system or user message. Without this, the model may
     * generate an unending stream of whitespace until the generation reaches the token
     * limit, resulting in a long-running and seemingly "stuck" request. Also note that
     * the message content may be partially cut off if `finish_reason="length"`, which
     * indicates the generation exceeded `max_tokens` or the conversation exceeded the
     * max context length.
     */
    response_format?: ChatCompletionCreateParams.ResponseFormat;

    /**
     * This feature is in Beta. If specified, our system will make a best effort to
     * sample deterministically, such that repeated requests with the same `seed` and
     * parameters should return the same result. Determinism is not guaranteed, and you
     * should refer to the `system_fingerprint` response parameter to monitor changes
     * in the backend.
     */
    seed?: number | null;

    /**
     * Up to 4 sequences where the API will stop generating further tokens.
     */
    stop?: string | null | Array<string>;

    /**
     * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be
     * sent as data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available, with the stream terminated by a `data: [DONE]`
     * message.
     * [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).
     */
    stream?: boolean | null;

    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
     * make the output more random, while lower values like 0.2 will make it more
     * focused and deterministic.
     *
     * We generally recommend altering this or `top_p` but not both.
     */
    temperature?: number | null;

    /**
     * Controls which (if any) tool is called by the model. `none` means the model will
     * not call any tool and instead generates a message. `auto` means the model can
     * pick between generating a message or calling one or more tools. `required` means
     * the model must call one or more tools. Specifying a particular tool via
     * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
     * call that tool.
     *
     * `none` is the default when no tools are present. `auto` is the default if tools
     * are present.
     */
    tool_choice?: ChatCompletionToolChoiceOption;

    /**
     * A list of tools the model may call. Currently, only functions are supported as a
     * tool. Use this to provide a list of functions the model may generate JSON inputs
     * for. A max of 128 functions are supported.
     */
    tools?: Array<ChatCompletionTool>;

    /**
     * An integer between 0 and 20 specifying the number of most likely tokens to
     * return at each token position, each with an associated log probability.
     * `logprobs` must be set to `true` if this parameter is used.
     */
    top_logprobs?: number | null;

    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the
     * model considers the results of the tokens with top_p probability mass. So 0.1
     * means only the tokens comprising the top 10% probability mass are considered.
     *
     * We generally recommend altering this or `temperature` but not both.
     */
    top_p?: number | null;

    /**
     * A unique identifier representing your end-user, which can help OpenAI to monitor
     * and detect abuse.
     * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
     */
    user?: string;

    // Gemini用:コンテキストキャッシュ
    cachedContent?: CachedContent,

    // Gemini用:安全性設定
    safetySettings?: SafetyRating[],

    // Gemini用:Google検索フラグ
    isGoogleSearch?: boolean,
}

export type ChatCompletionCreateParamsWithoutMessages = Omit<ChatCompletionCreateParamsBase, 'messages'>;
export interface ChatCompletionStreamInDto {
    args: ChatCompletionCreateParamsBase;
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