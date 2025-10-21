import nodemailer from 'nodemailer';

export interface CustomerData {
  fullName: string;
  phoneNumber: string;
  address?: string;
  gender?: string;
  birthDate?: string;
  peopleCount: number;
  arrivalTime: string;
  reservationCode: string;
  timestamp: string;
}

export interface ExperienceData {
  name: string;
  age: string;
  phone: string;
  schedule: string;
  description: string;
  timestamp: string;
}

// Email configuration với Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    // Anti-spam configurations
    pool: true, // Use connection pooling
    maxConnections: 5, // Limit concurrent connections
    maxMessages: 100, // Messages per connection
    rateDelta: 1000, // 1 second between messages
    rateLimit: 5, // Max 5 emails per rateDelta
    // Timeout configurations để tránh form submission chậm
    connectionTimeout: 3000, // 3 seconds for Vercel
    greetingTimeout: 2000, // 2 seconds for Vercel  
    socketTimeout: 5000, // 5 seconds for Vercel
  });
};

// Parse admin emails from environment variable
const getAdminEmails = (): string[] => {
  const adminEmailsStr = process.env.ADMIN_EMAILS || process.env.EMAIL_USER || '';
  const emails = adminEmailsStr.split(',').map(email => email.trim()).filter(email => email.length > 0);
  // If no admin emails configured, use the EMAIL_USER as fallback
  if (emails.length === 0 && process.env.EMAIL_USER) {
    return [process.env.EMAIL_USER];
  }
  return emails;
};

// Send notification to multiple admins using BCC method
export async function sendAdminNotification(customerData: CustomerData) {
  try {
    const transporter = createTransporter();
    const adminEmails = getAdminEmails();
    
    if (adminEmails.length === 0) {
      console.warn('No admin emails configured');
      return { success: false, error: 'No admin emails configured' };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #D97706; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">👑 XUYÊN VIỆT COOP - ĐĂNG KÝ MỚI!</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #D97706; margin-top: 0;">Khách hàng mới đăng ký ưu đãi</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #FEF3C7;">
              <td style="padding: 12px; border: 1px solid #F59E0B; font-weight: bold; width: 40%;">Họ và tên:</td>
              <td style="padding: 12px; border: 1px solid #F59E0B;"><strong style="color: #1F2937; font-size: 16px;">${customerData.fullName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #F59E0B; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 12px; border: 1px solid #F59E0B;"><strong style="color: #D97706; font-size: 18px;">${customerData.phoneNumber}</strong></td>
            </tr>
            <tr style="background-color: #FEF3C7;">
              <td style="padding: 12px; border: 1px solid #F59E0B; font-weight: bold;">Mã đặt hàng:</td>
              <td style="padding: 12px; border: 1px solid #F59E0B;"><strong style="color: #DC2626; font-size: 20px; font-family: monospace; letter-spacing: 2px;">${customerData.reservationCode}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #F59E0B; font-weight: bold;">Thời gian đăng ký:</td>
              <td style="padding: 12px; border: 1px solid #F59E0B;">${customerData.timestamp}</td>
            </tr>
          </table>
          
          <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D97706;">
            <h3 style="color: #D97706; margin: 0 0 10px 0;">📞 Hành động cần thực hiện:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li>Gọi điện xác nhận ưu đãi MUA 2 TẶNG 1 với khách hàng</li>
              <li>Tư vấn về menu và thời gian sử dụng ưu đãi</li>
              <li>Hẹn thời gian cụ thể để khách đến quán nhận ưu đãi</li>
              <li>Ghi nhận mã đặt hàng vào sổ theo dõi</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${customerData.phoneNumber}" style="background-color: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              📞 GỌI NGAY: ${customerData.phoneNumber}
            </a>
          </div>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin: 0 0 10px 0;">💡 Ghi chú quan trọng:</h4>
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              Email này được gửi tự động từ website landing page. Khách hàng đã đăng ký nhận ưu đãi MUA 2 TẶNG 1. Vui lòng liên hệ trong vòng 30 phút để xác nhận và hướng dẫn sử dụng ưu đãi.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          
          <div style="text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>XUYÊN VIỆT COOP - Sản phẩm Việt - Giá Trị Việt</strong></p>
            <p>📍 Hồng Hưng - Gia Phúc - Hải Phòng | ⏰ 10:00-22:00 | 📞 (+84) 0888. 356. 778</p>
            <p style="margin-top: 10px; font-size: 12px;">
              Thời gian gửi: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
            </p>
          </div>
        </div>
      </div>
    `;

    // BCC Method: Gá»­i 1 email duy nháº¥t vá»›i nhiá»u BCC
    let mailOptions;
    
    if (adminEmails.length === 1) {
      // Chỉ có 1 admin
      mailOptions = {
        from: `"Xuyên Việt Coop - Thông báo đăng ký" <${process.env.EMAIL_USER}>`,
        to: adminEmails[0],
        subject: `👑 [XUYÊN VIỆT COOP] Đăng ký mới: ${customerData.fullName} - ${customerData.reservationCode}`,
        html: htmlContent,
        replyTo: process.env.EMAIL_USER,
        headers: {
          'X-Mailer': 'ROCA-Landing-Page',
          'X-Priority': '3',
          'X-Auto-Response-Suppress': 'All',
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Transfer-Encoding': '8bit',
        },
      };
    } else {
      // Nhiều admin: Gửi cho admin đầu tiên, BCC cho các admin còn lại
      const primaryEmail = adminEmails[0];
      const bccEmails = adminEmails.slice(1);
      
      mailOptions = {
        from: `"Xuyên Việt Coop - Thông báo đăng ký" <${process.env.EMAIL_USER}>`,
        to: primaryEmail,
        bcc: bccEmails.join(', '), // BCC để không lộ email của các admin khác
        subject: `👑 [XUYÊN VIỆT COOP] Đăng ký mới: ${customerData.fullName} - ${customerData.reservationCode}`,
        html: htmlContent,
        replyTo: process.env.EMAIL_USER,
        headers: {
          'X-Mailer': 'ROCA-Landing-Page',
          'X-Priority': '3',
          'X-Auto-Response-Suppress': 'All',
          'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Transfer-Encoding': '8bit',
        },
      };
    }

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    
    // Ä‘Ã³ng transporter
    transporter.close();

    return {
      success: true,
      messageId: (info as any)?.messageId || 'unknown',
      totalRecipients: adminEmails.length,
      recipients: adminEmails,
      method: 'BCC'
    };

  } catch (error) {
    console.error('❌ Email failed:', error instanceof Error ? error.message : 'Unknown error');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      totalRecipients: getAdminEmails().length
    };
  }
}

// Send notification for experience registration
export async function sendExperienceRegistrationEmail(experienceData: ExperienceData) {
  try {
    const transporter = createTransporter();
    const adminEmails = getAdminEmails();

    if (adminEmails.length === 0) {
      console.warn('No admin emails configured');
      return { success: false, error: 'No admin emails configured' };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #10B981; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🌿 ĐĂNG KÝ TRẢI NGHIỆM MỚI!</h1>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #10B981; margin-top: 0;">Khách hàng đăng ký trải nghiệm</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #ECFDF5;">
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold; width: 40%;">Họ và tên:</td>
              <td style="padding: 12px; border: 1px solid #10B981;"><strong style="color: #1F2937; font-size: 16px;">${experienceData.name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold;">Tuổi:</td>
              <td style="padding: 12px; border: 1px solid #10B981;">${experienceData.age || 'Chưa cung cấp'}</td>
            </tr>
            <tr style="background-color: #ECFDF5;">
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 12px; border: 1px solid #10B981;"><strong style="color: #10B981; font-size: 18px;">${experienceData.phone}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold;">Thời gian đặt lịch:</td>
              <td style="padding: 12px; border: 1px solid #10B981;">${experienceData.schedule || 'Chưa chọn'}</td>
            </tr>
            <tr style="background-color: #ECFDF5;">
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold;">Mô tả triệu chứng:</td>
              <td style="padding: 12px; border: 1px solid #10B981;">${experienceData.description || 'Chưa mô tả'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #10B981; font-weight: bold;">Thời gian đăng ký:</td>
              <td style="padding: 12px; border: 1px solid #10B981;">${experienceData.timestamp}</td>
            </tr>
          </table>

          <div style="background-color: #ECFDF5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #10B981; margin: 0 0 10px 0;">📞 Hành động cần thực hiện:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li>Liên hệ khách hàng để xác nhận thông tin và đặt lịch</li>
              <li>Tư vấn về các sản phẩm phù hợp với triệu chứng</li>
              <li>Hướng dẫn khách hàng về quy trình trải nghiệm</li>
              <li>Ghi nhận thông tin vào hệ thống quản lý</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${experienceData.phone}" style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              📞 GỌI NGAY: ${experienceData.phone}
            </a>
          </div>

          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin: 0 0 10px 0;">💡 Ghi chú:</h4>
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              Email này được gửi tự động từ website landing page. Khách hàng đã đăng ký trải nghiệm sản phẩm. Vui lòng liên hệ sớm để tư vấn và hỗ trợ.
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">

          <div style="text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>ROCA - Trải Nghiệm Sức Khỏe Tự Nhiên</strong></p>
            <p style="margin-top: 10px; font-size: 12px;">
              Thời gian gửi: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
            </p>
          </div>
        </div>
      </div>
    `;

    // BCC Method: Gửi 1 email duy nhất với nhiều BCC
    let mailOptions;

    if (adminEmails.length === 1) {
      // Chỉ có 1 admin
      mailOptions = {
        from: `"ROCA - Đăng ký trải nghiệm" <${process.env.EMAIL_USER}>`,
        to: adminEmails[0],
        subject: `🌿 [ROCA] Đăng ký trải nghiệm: ${experienceData.name} - ${experienceData.phone}`,
        html: htmlContent,
        replyTo: process.env.EMAIL_USER,
        headers: {
          'X-Mailer': 'ROCA-Landing-Page',
          'X-Priority': '3',
          'X-Auto-Response-Suppress': 'All',
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Transfer-Encoding': '8bit',
        },
      };
    } else {
      // Nhiều admin: Gửi cho admin đầu tiên, BCC cho các admin còn lại
      const primaryEmail = adminEmails[0];
      const bccEmails = adminEmails.slice(1);

      mailOptions = {
        from: `"ROCA - Đăng ký trải nghiệm" <${process.env.EMAIL_USER}>`,
        to: primaryEmail,
        bcc: bccEmails.join(', '), // BCC để không lộ email của các admin khác
        subject: `🌿 [ROCA] Đăng ký trải nghiệm: ${experienceData.name} - ${experienceData.phone}`,
        html: htmlContent,
        replyTo: process.env.EMAIL_USER,
        headers: {
          'X-Mailer': 'ROCA-Landing-Page',
          'X-Priority': '3',
          'X-Auto-Response-Suppress': 'All',
          'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Transfer-Encoding': '8bit',
        },
      };
    }

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    // Đóng transporter
    transporter.close();

    return {
      success: true,
      messageId: (info as any)?.messageId || 'unknown',
      totalRecipients: adminEmails.length,
      recipients: adminEmails,
      method: 'BCC'
    };

  } catch (error) {
    console.error('❌ Email failed:', error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      totalRecipients: getAdminEmails().length
    };
  }
}

// Function để test email configuration
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter();

    // Verify SMTP connection
    const isConnected = await transporter.verify();

    if (isConnected) {
      transporter.close();
      return { success: true, message: 'Gmail SMTP connection successful' };
    } else {
      return { success: false, message: 'Gmail SMTP connection failed' };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Email configuration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}







