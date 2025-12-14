import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Eye, MoreVertical, FileIcon, Image as ImageIcon } from 'lucide-react';

const Reports: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    { id: 1, title: 'Complete Blood Count (CBC)', date: 'Oct 24, 2023', type: 'Lab Result', format: 'PDF', status: 'Normal', doctor: 'Dr. Kavya' },
    { id: 2, title: 'Chest X-Ray Anteroposterior', date: 'Sep 12, 2023', type: 'Imaging', format: 'DICOM', status: 'Attention', doctor: 'Dr. Harsh' },
    { id: 3, title: 'Annual Physical Summary', date: 'Jan 15, 2023', type: 'General', format: 'PDF', status: 'Normal', doctor: 'Dr. Anadhya' },
    { id: 4, title: 'Lipid Panel', date: 'Dec 05, 2022', type: 'Lab Result', format: 'PDF', status: 'High', doctor: 'Dr. Kavya' },
    { id: 5, title: 'Dermatology Consultation', date: 'Nov 18, 2022', type: 'Consultation', format: 'PDF', status: 'Normal', doctor: 'Dr. Harsh' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = activeFilter === 'All' || doc.type === activeFilter || (activeFilter === 'Abnormal' && doc.status !== 'Normal');
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'Attention': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'High': return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getIcon = (format: string) => {
    return format === 'DICOM' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
  };

  return (
    <div className="flex-1 bg-health-bg min-h-screen pb-20 md:pb-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Medical Reports</h2>
          <p className="text-health-muted">Access and manage your medical history</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-health-bg font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
        </button>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-health-card p-4 rounded-2xl border border-white/5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search reports by name or doctor..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-health-bg border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-gray-600 text-sm"
            />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Lab Result', 'Imaging', 'Abnormal'].map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                        activeFilter === filter 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
            <div key={doc.id} className="group bg-health-card hover:bg-[#1A2421] border border-white/5 rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon Box */}
                <div className={`p-4 rounded-xl ${doc.format === 'DICOM' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {getIcon(doc.format)}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold truncate">{doc.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(doc.status)}`}>
                            {doc.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{doc.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{doc.doctor}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{doc.format}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button className="flex-1 md:flex-none py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}

        {filteredDocs.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No reports found matching your criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;