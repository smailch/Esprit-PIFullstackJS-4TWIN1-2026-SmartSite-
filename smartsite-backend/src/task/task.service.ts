import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './chemas/task.chema';
import { TaskDocument } from './chemas/task.chema';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);
    return task.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true });
    if (!updatedTask) throw new NotFoundException(`Task ${id} not found`);
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
  }
}
