import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { Invoice } from '../invoices/schemas/invoice.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { AiService } from './ai.service';

describe('ReportsService', () => {
  let service: ReportsService;
  const mockModel = {};
  const mockAi = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getModelToken(Invoice.name), useValue: mockModel },
        { provide: getModelToken(Payment.name), useValue: mockModel },
        { provide: AiService, useValue: mockAi },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
