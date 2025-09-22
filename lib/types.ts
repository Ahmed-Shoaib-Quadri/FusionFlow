import { ConnectionProviderProps } from '@/app/providers/connections-provider';
import { z } from 'zod';

export const EditUserProfileSchema = z.object({
    email: z.string().email('Required'),
    name: z.string().min(1,'Required'),
})

export const WorkflowFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
})

export type ConnectionTypes = 'Google Drive' | 'Notion' | 'Slack' | 'Discord'

export type Connection = {
    title: ConnectionTypes
    description: string
    image: string
    connectionKey: keyof ConnectionProviderProps
    accessTokenKey?: string
    alwaysTrue?: boolean
    slackSpecial?: boolean
}

export type EditorCanvasTypes = 
 | 'Email'
 | 'Condition'
 | 'AI'
 | 'Slack'
 | 'Google Drive'
 | 'Notion'
 | 'Custom Webhook'
 | 'Google Calender'
 | 'Trigger'
 | 'Action'
 | 'Wait';

export type EditorCanvasMetadata = {
    Email?: {
        to: string;
        subject: string;
        body: string;
    };
    Condition?: {
        condition: string;
    };
    AI?: {
        prompt: string;
    };
    Slack?: {
        channel: string;
        message: string;
    };
    'Google Drive'?: {
        fileId: string;
        action: 'upload' | 'download' | 'share';
    };
    Notion?: {
        pageId: string;
        content: string;
    };
    'Custom Webhook'?: {
        url: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        body?: Record<string, unknown>;
    };
    'Google Calender'?: {
        event: {
            title: string;
            start: string;
            end: string;
        };
    };
    Wait?: {
        duration: number;
    };
    Trigger?: Record<string, unknown>;
    Action?: Record<string, unknown>;
};

export type EditorCanvasCardType = {
    title: string
    description: string
    completed: boolean
    current: boolean
    metadata: EditorCanvasMetadata[EditorCanvasTypes]
    type: EditorCanvasTypes
}

export type EditorNodeType = {
    id: string
    type: EditorCanvasCardType['type']
    position: {
        x: number
        y: number
    }
    data: EditorCanvasCardType 
}

export type EditorNode = EditorNodeType;

export type EditorActions = 
 | {
    type: 'LOAD_DATA'
    payload: {
        elements: EditorNode[]
        edges: {
            id: string
            source: string
            target: string
        }[]
    }
 }
 | {
    type: 'UPDATE_NODE'
    payload: {
        nodeId: string
        data: EditorCanvasCardType
    }
 }
 | {type: 'REDO'}
 | {type: 'UNDO'}
 | {
    type: 'SELECTED_ELEMENT'
    payload: {
        element: EditorNode
    }
 }

 export const nodeMapper: Record<string,string> = {
    Notion: 'notionNode',
    Slack: 'slackNode',
    Discord: 'discordNode',
    'Google Drive': 'googleNode',
 }