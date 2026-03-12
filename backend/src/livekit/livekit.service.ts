import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  private roomService?: RoomServiceClient;
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private livekitUrl: string | undefined;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('LIVEKIT_API_KEY');
    this.apiSecret = this.config.get<string>('LIVEKIT_API_SECRET');
    this.livekitUrl = this.config.get<string>('LIVEKIT_URL');

    if (this.apiKey && this.apiSecret && this.livekitUrl) {
      this.roomService = new RoomServiceClient(
        this.livekitUrl,
        this.apiKey,
        this.apiSecret,
      );
    }
  }

  /**
   * Create a new LiveKit room for a live session
   */
  async createRoom(roomName: string, metadata?: any): Promise<any> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured. Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL');
    }

    try {
      const room = await this.roomService.createRoom({
        name: roomName,
        emptyTimeout: 10 * 60, // 10 minutes
        maxParticipants: 100,
        metadata: JSON.stringify(metadata || {}),
      });

      return {
        roomName: room.name,
        sid: room.sid,
        createdAt: room.creationTime,
        metadata: room.metadata,
      };
    } catch (error) {
      console.error('Failed to create LiveKit room:', error);
      throw error;
    }
  }

  /**
   * Generate access token for a participant to join a room
   */
  async generateToken(
    roomName: string,
    participantName: string,
    participantId: string,
    metadata?: any,
  ): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('LiveKit not configured');
    }

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantId,
      name: participantName,
      metadata: JSON.stringify(metadata || {}),
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return at.toJwt();
  }

  /**
   * Generate teacher token with additional permissions
   */
  async generateTeacherToken(
    roomName: string,
    teacherName: string,
    teacherId: string,
  ): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('LiveKit not configured');
    }

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: teacherId,
      name: teacherName,
      metadata: JSON.stringify({ role: 'teacher' }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: true, // Teacher can control the room
      roomRecord: true, // Teacher can record
    });

    return at.toJwt();
  }

  /**
   * List all active rooms
   */
  async listRooms(): Promise<any[]> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured');
    }

    try {
      const rooms = await this.roomService.listRooms();
      return rooms.map((room) => ({
        name: room.name,
        sid: room.sid,
        numParticipants: room.numParticipants,
        maxParticipants: room.maxParticipants,
        createdAt: room.creationTime,
        metadata: room.metadata,
      }));
    } catch (error) {
      console.error('Failed to list rooms:', error);
      return [];
    }
  }

  /**
   * Get room details
   */
  async getRoom(roomName: string): Promise<any> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured');
    }

    try {
      const rooms = await this.roomService.listRooms([roomName]);
      if (rooms.length === 0) {
        return null;
      }
      const room = rooms[0];
      return {
        name: room.name,
        sid: room.sid,
        numParticipants: room.numParticipants,
        maxParticipants: room.maxParticipants,
        createdAt: room.creationTime,
        metadata: room.metadata,
      };
    } catch (error) {
      console.error('Failed to get room:', error);
      return null;
    }
  }

  /**
   * Delete a room
   */
  async deleteRoom(roomName: string): Promise<void> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured');
    }

    try {
      await this.roomService.deleteRoom(roomName);
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error;
    }
  }

  /**
   * List participants in a room
   */
  async listParticipants(roomName: string): Promise<any[]> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured');
    }

    try {
      const participants = await this.roomService.listParticipants(roomName);
      return participants.map((p) => ({
        identity: p.identity,
        name: p.name,
        sid: p.sid,
        state: p.state,
        joinedAt: p.joinedAt,
        metadata: p.metadata,
      }));
    } catch (error) {
      console.error('Failed to list participants:', error);
      return [];
    }
  }

  /**
   * Remove a participant from a room
   */
  async removeParticipant(roomName: string, participantId: string): Promise<void> {
    if (!this.roomService) {
      throw new Error('LiveKit not configured');
    }

    try {
      await this.roomService.removeParticipant(roomName, participantId);
    } catch (error) {
      console.error('Failed to remove participant:', error);
      throw error;
    }
  }

  /**
   * Get LiveKit connection details
   */
  getLiveKitUrl(): string {
    return this.livekitUrl || '';
  }

  /**
   * Check if LiveKit is configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret && this.livekitUrl);
  }
}
