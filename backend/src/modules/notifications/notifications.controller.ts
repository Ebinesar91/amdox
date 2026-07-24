import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { GetTenantId } from '../../common/tenant.context';

interface NotificationMessage {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  channels: ('IN_APP' | 'EMAIL' | 'WEBHOOK')[];
  createdAt: Date;
  read: boolean;
}

@ApiTags('Multi-Channel Notification Center')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/notifications')
export class NotificationsController {
  private notifications: NotificationMessage[] = [
    {
      id: 'nt-001',
      tenantId: 'default-tenant-uuid-001',
      title: 'Monthly Payroll Approved',
      message: 'May pay run has been processed and payslips dispatched.',
      type: 'INFO',
      channels: ['IN_APP', 'EMAIL'],
      createdAt: new Date(),
      read: false
    },
    {
      id: 'nt-002',
      tenantId: 'default-tenant-uuid-001',
      title: 'Low Stock Alert',
      message: 'SKU-902 (Gigabit Switch) has dropped below reorder level (10).',
      type: 'WARNING',
      channels: ['IN_APP', 'WEBHOOK'],
      createdAt: new Date(Date.now() - 3600000),
      read: false
    }
  ];

  @Get()
  @ApiOperation({ summary: 'Get all in-app notifications' })
  async getNotifications(@GetTenantId() tenantId: string) {
    return this.notifications.filter(n => n.tenantId === tenantId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Dispatch notification to multi-channel system' })
  async sendNotification(
    @GetTenantId() tenantId: string,
    @Body() body: { title: string; message: string; type: 'INFO' | 'WARNING' | 'ALERT'; channels: ('IN_APP' | 'EMAIL' | 'WEBHOOK')[] }
  ) {
    const newNotif: NotificationMessage = {
      id: `nt-${Math.floor(100 + Math.random() * 900)}`,
      tenantId,
      title: body.title,
      message: body.message,
      type: body.type,
      channels: body.channels,
      createdAt: new Date(),
      read: false
    };

    // 1. In-App notification storage
    if (body.channels.includes('IN_APP')) {
      this.notifications.unshift(newNotif);
    }

    // 2. Email Notification simulation
    if (body.channels.includes('EMAIL')) {
      console.log(`[EMAIL DISPATCH] To: staff@amdox.corp | Subject: ${body.title} | Content: ${body.message}`);
    }

    // 3. Webhook Notification dispatch
    if (body.channels.includes('WEBHOOK')) {
      console.log(`[WEBHOOK DISPATCH] Triggering external hook integration: ${body.title}`);
      // Asynchronous non-blocking post fallback
      fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      }).catch(err => {
        console.warn('Webhook post failed', err.message);
      });
    }

    return {
      status: 'dispatched',
      notificationId: newNotif.id
    };
  }
}
