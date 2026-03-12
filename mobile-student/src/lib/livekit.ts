export class Participant {
    sid: string = '';
    identity: string = '';
    isMicrophoneEnabled: boolean = true;
    isCameraEnabled: boolean = true;
    videoTrackPublications = new Map();
    isLocal: boolean = false;
}

export class LocalParticipant extends Participant {
    isLocal: boolean = true;
    setMicrophoneEnabled = async (enabled: boolean) => { this.isMicrophoneEnabled = enabled; };
    setCameraEnabled = async (enabled: boolean) => { this.isCameraEnabled = enabled; };
    setScreenShareEnabled = async (enabled: boolean) => { console.log('Mock: Screen share', enabled); };
    publishData = async (data: Uint8Array, options?: any) => {
        // Instead of echo, send a realistic response from the Sheikh
        setTimeout(() => {
            const response = {
                type: 'chat',
                id: 'resp-' + Date.now(),
                user: 'Sheikh Abdullah',
                text: 'Mashallah, that is a great question. Let us look at the next verse.'
            };
            const encoded = new TextEncoder().encode(JSON.stringify(response));
            const listeners = Room._instance?._listeners.get('DataReceived') || [];
            listeners.forEach(cb => cb(encoded, new RemoteParticipant('Sheikh Abdullah')));
        }, 2000);
    };
}

export class RemoteParticipant extends Participant {
    isLocal: boolean = false;
    constructor(identity: string = 'Sheikh Abdullah') {
        super();
        this.identity = identity;
        this.sid = 'sid-' + identity.replace(/\s+/g, '-').toLowerCase();
    }
}

export class Room {
    static _instance: Room | null = null;
    _listeners = new Map<string, Function[]>();

    constructor() {
        Room._instance = this;
    }

    connect(url: string, token: string) {
        console.log('Mock: Connecting...');
        this.remoteParticipants.set('p1', new RemoteParticipant('Sheikh Abdullah'));
        this.remoteParticipants.set('p2', new RemoteParticipant('Fatima (Admin)'));
        this.remoteParticipants.set('p3', new RemoteParticipant('Brother Yusuf'));
    }

    disconnect() { Room._instance = null; }

    on(event: string, callback: Function) {
        const listeners = this._listeners.get(event) || [];
        listeners.push(callback);
        this._listeners.set(event, listeners);
    }

    localParticipant = new LocalParticipant();
    remoteParticipants = new Map<string, RemoteParticipant>();
    startRecording() { console.log('Mock: Recording started'); }
    async stopRecording() {
        console.log('Mock: Recording stopped');
        return 'file:///mock/path/video.mp4';
    }
}

export const RoomEvent = {
    ParticipantConnected: 'ParticipantConnected',
    ParticipantDisconnected: 'ParticipantDisconnected',
    TrackSubscribed: 'TrackSubscribed',
    TrackUnsubscribed: 'TrackUnsubscribed',
    DataReceived: 'DataReceived',
    ActiveSpeakersChanged: 'ActiveSpeakersChanged',
};
export const Track = {};
export const VideoView = (props: any) => null;
export const AudioSession = {
    startAudioSession: async () => { },
    stopAudioSession: async () => { },
};
export const registerGlobals = () => { };
