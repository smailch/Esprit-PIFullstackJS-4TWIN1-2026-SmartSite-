'use client';

import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { projects } from '@/lib/mockData';
import { Folder, Cake as Crane, Calendar, DollarSign, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('All');

  const statusOptions = ['All', 'In Progress', 'Planning', 'Completed'];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.status === filter);

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

  const getProjectIcon = (index: number) => {
    const icons = [Folder, Crane, Folder, Crane, Folder];
    const Icon = icons[index % icons.length];
    return <Icon size={18} className="text-primary" />;
  };

  const tableColumns = [
    {
      key: 'name' as const,
      label: 'Project Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {getProjectIcon(row.id - 1)}
          <div>
            <p className="font-semibold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{row.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <span className={getStatusColor(value)}>{value}</span>
      ),
    },
    {
      key: 'budget' as const,
      label: 'Budget',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-1">
          <DollarSign size={16} className="text-accent" />
          <span className="font-semibold text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: 'startDate' as const,
      label: 'Start Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-primary" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'endDate' as const,
      label: 'End Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-primary" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'completion' as const,
      label: 'Progress',
      render: (value: number) => (
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-foreground">{value}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Projects"
        description="Manage and monitor all construction projects"
      >
        <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          New Project
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

      {/* Projects Table */}
      <DataTable columns={tableColumns} data={filteredProjects} title="All Projects" />
    </MainLayout>
  );
}
