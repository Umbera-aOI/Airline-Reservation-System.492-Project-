import {Body, Controller, Post} from '@nestjs/common';
import {PaymentSubmissionDto} from "./dto/payment-submission.dto";
import {PaymentsService} from "./payments.service";

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) {
    }

    @Post('submit')
    async submitPayment(@Body() body: PaymentSubmissionDto) {
        return this.paymentsService.processPayment(body);
    }
}
