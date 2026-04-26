import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController (route GET /)', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    controller = module.get<AppController>(AppController);
  });

  it('getHello renvoie le message d’accueil (équivalent GET /)', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
