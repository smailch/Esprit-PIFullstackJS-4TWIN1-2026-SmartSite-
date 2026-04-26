import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { Payment } from './schemas/payment.schema';
import { Invoice } from '../invoices/schemas/invoice.schema';

describe('PaymentsService', () => {
  let service: PaymentsService;
  const mockModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getModelToken(Payment.name), useValue: mockModel },
        { provide: getModelToken(Invoice.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
