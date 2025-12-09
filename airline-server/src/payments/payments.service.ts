import {BadRequestException, Injectable} from '@nestjs/common';
import {PaymentSubmissionDto} from "./dto/payment-submission.dto";

@Injectable()
export class PaymentsService {
    async processPayment(paymentSubmissionDto: PaymentSubmissionDto) {
        if (
            !paymentSubmissionDto.creditCardNumber!.match(/^\d{4} \d{4} \d{4} \d{4}$/) ||
            !paymentSubmissionDto.firstName ||
            !paymentSubmissionDto.lastName ||
            !paymentSubmissionDto.expirationDate.match(/^\d{2}\/\d{2}$/) ||
            ![3, 4].includes(paymentSubmissionDto.cvv.length)
        ) {
            throw new BadRequestException('Invalid payment information.');
        }
        return {
            success: true,
            message: 'Payment successful.'
        }
    }
}
