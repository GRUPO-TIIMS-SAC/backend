import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as admin from 'firebase-admin';

@ApiTags('Live Notifications')
@Controller('live-notifications')
export class LiveNotificationsController {

    @Post('enviar')
    async enviarNotificacion(@Body() data: { token: string, mensaje: string }): Promise<any> {
        const message = {
            token: data.token,
            notification: {
                title: 'Título de la notificación',
                body: data.mensaje,
            },
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Notificación enviada con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
            throw error;
        }
    }
}
