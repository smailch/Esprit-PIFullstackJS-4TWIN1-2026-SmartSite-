import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoicesService } from './invoices.service';
import { Invoice } from './schemas/invoice.schema';

describe('InvoicesService', () => {
  let service: InvoicesService;
  const mockModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: getModelToken(Invoice.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
