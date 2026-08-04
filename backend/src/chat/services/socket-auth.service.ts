import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class SocketAuthService {
  constructor(private readonly tokenService: TokenService) {}

  async authenticate(client: Socket): Promise<string> {
    const cookies = client.request.headers.cookie;

    if (!cookies) {
      throw new WsException('Unauthorized');
    }
    const refreshToken = cookies
      .split('; ')
      .find((c) => c.startsWith('refresh_token='))
      ?.split('=')[1];
    if (!refreshToken) {
      throw new WsException('Unauthorized');
    }
    const payload = await this.tokenService.verifyRefreshToken(
      decodeURIComponent(refreshToken),
    );
    if (!payload?.sub) {
      throw new WsException('Unauthorized');
    }
    return payload.sub;
  }
}
