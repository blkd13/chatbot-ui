import { DBConfig } from "ngx-indexed-db";

export const dbConfig: DBConfig = {
    name: 'chat-ui',
    version: 1,
    objectStoresMeta: [{
        store: 'threadList',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'title', keypath: 'title', options: { unique: false, multiEntry: false, index: true } },
            { name: 'timestamp', keypath: 'timestamp', options: { unique: false, multiEntry: false, index: true } },
            { name: 'description', keypath: 'description', options: { unique: false, multiEntry: false, index: false } },
            { name: 'body', keypath: 'body', options: { unique: false, multiEntry: false, index: false } },
        ]
    }]
};

export const dbConfig2: DBConfig = {
    name: 'chat-ui',
    version: 2,
    objectStoresMeta: [{
        store: 'threadList',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'seq', keypath: 'seq', options: { unique: true, multiEntry: false, index: true } }, // ���я�
            { name: 'title', keypath: 'title', options: { unique: false, multiEntry: false, index: true } },
            { name: 'timestamp', keypath: 'timestamp', options: { unique: false, multiEntry: false, index: true } },
            { name: 'description', keypath: 'description', options: { unique: false, multiEntry: false, index: false } },
            { name: 'messageIdList', keypath: 'messageIdList', options: { unique: true, multiEntry: false, index: false } },
        ]
    }, {
        store: 'messageTitleList',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'role', keypath: 'role', options: { unique: false, multiEntry: false, index: false } },
            { name: 'state', keypath: 'state', options: { unique: false, multiEntry: false, index: false } }, // ���b�Z�[�W��M�����ǂ����Ƃ��B����͂���܂�g��Ȃ������B
            { name: 'isExpanded', keypath: 'isExpanded', options: { unique: false, multiEntry: false, index: false } }, // �L���邩���邩
            { name: 'isCached', keypath: 'isCached', options: { unique: false, multiEntry: false, index: false } }, // �R���e�L�X�g�L���b�V��������Ă��邩�ǂ����i���b�N���|����K�v������̂Łj
            { name: 'title', keypath: 'title', options: { unique: false, multiEntry: false, index: false } }, // �G�L�X�p���V����������Ƃ��̃e�L�X�g�Bbody�̓�300�����ŗǂ��Ǝv���B
            { name: 'bodyId', keypath: 'bodyId', options: { unique: false, multiEntry: false, index: false } },
        ]
    }, {
        store: 'messageBodyList',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'body', keypath: 'body', options: { unique: false, multiEntry: false, index: false } }, // �f�J���̂ł���P�Ƃ�store�ɂ��Ă����B
        ]
    }]
};
