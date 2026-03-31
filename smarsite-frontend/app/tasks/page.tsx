'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { tasks, jobs } from '@/lib/mockData';
import { Clipboard, Users, Plus, Filter, ChevronDown, CheckCircle2, Briefcase } from 'lucide-react';
import { useState } from 'react';

export default function TasksPage() {
  const [filter, setFilter] = useState<string>('All');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const statusOptions = ['All', 'In Progress', 'Planning', 'Completed'];

  const filteredTasks = filter === 'All'
    ? tasks
    : tasks.filter(t => t.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'In Progress':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      case 'Planning':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800';
      case 'Medium':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800';
      case 'Low':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 border-blue-200';
      case 'Planning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getTaskJobs = (taskId: number) => {
    return jobs.filter(job => job.taskId === taskId);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Tasks"
        description="Manage and track all project tasks and assignments"
      >
        <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          New Task
        </button>
      </PageHeader>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={18} className="text-muted-foreground" />
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white shadow-sm'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="w-8"></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Task</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Project</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Assigned To</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Jobs</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task: any) => {
                const taskJobs = getTaskJobs(task.id);
                const isExpanded = expandedTaskId === task.id;

                return (
                  <React.Fragment key={task.id}>
                    <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-primary/10 transition-colors"
                          aria-label="Expand task jobs"
                        >
                          <ChevronDown
                            size={16}
                            className={`text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Clipboard size={18} className="text-primary flex-shrink-0" />
                          <span className="font-semibold text-foreground">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-primary/60 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{task.project}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-primary flex-shrink-0" />
                          <span className="text-foreground font-medium text-sm">{task.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-foreground">{task.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusColor(task.status)}>{task.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white bg-accent px-3 py-1 rounded-full inline-block">
                          {task.jobCount} jobs
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Jobs Section */}
                    {isExpanded && (
                      <tr className="bg-secondary/40 border-b border-border">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="max-w-4xl">
                            <div className="flex items-center gap-2 mb-4">
                              <Clipboard size={18} className="text-primary" />
                              <h4 className="text-base font-semibold text-foreground">
                                Jobs for {task.title}
                              </h4>
                              <span className="ml-auto text-sm text-muted-foreground">
                                {taskJobs.length} {taskJobs.length === 1 ? 'job' : 'jobs'}
                              </span>
                            </div>

                            {taskJobs.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {taskJobs.map((job: any) => (
                                  <div
                                    key={job.id}
                                    className={`flex items-start gap-3 p-4 rounded-lg border ${getJobStatusColor(job.status)}`}
                                  >
                                    <CheckCircle2
                                      size={18}
                                      className={`flex-shrink-0 mt-0.5 ${
                                        job.status === 'Completed'
                                          ? 'text-green-600'
                                          : job.status === 'In Progress'
                                          ? 'text-blue-600'
                                          : 'text-yellow-600'
                                      }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground">{job.name}</p>
                                      <div className="flex flex-col gap-2 mt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                          <Users size={12} className="flex-shrink-0" />
                                          <span>{job.assignedTo}</span>
                                        </div>
                                        <div>
                                          <span className={`px-2 py-0.5 rounded-full font-medium inline-block ${
                                            job.status === 'Completed'
                                              ? 'bg-green-100 text-green-800'
                                              : job.status === 'In Progress'
                                              ? 'bg-blue-100 text-blue-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {job.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-muted-foreground">
                                <p className="text-sm">No jobs assigned to this task yet</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tasks found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
