import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, User, Mail, Phone, Pill, FileText } from 'lucide-react';

interface SearchFilters {
  searchBy: 'all' | 'name' | 'email' | 'phone' | 'patient_id' | 'drug_name' | 'treatment_type';
  status: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in_progress' | 'follow_up';
  dateRange: {
    start: string;
    end: string;
  } | null;
  hasPrescription: 'all' | 'yes' | 'no';
}

interface EnhancedSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export function EnhancedSearchBar({ 
  onSearch, 
  placeholder = "Search patients, consultations, prescriptions...",
  className = "" 
}: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    searchBy: 'all',
    status: 'all',
    dateRange: null,
    hasPrescription: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSearchingRef = useRef(false);

  // Debounced search
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if already searching
    if (isSearchingRef.current) {
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim() || filters.searchBy !== 'all' || filters.status !== 'all' || filters.dateRange || filters.hasPrescription !== 'all') {
        if (!isSearchingRef.current) {
          isSearchingRef.current = true;
          setIsSearching(true);
          onSearch(query, filters);
          setTimeout(() => {
            setIsSearching(false);
            isSearchingRef.current = false;
          }, 300);
        }
      } else {
        onSearch('', filters);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]); // Removed onSearch from dependencies to prevent infinite loop

  const handleClear = () => {
    // Clear any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setQuery('');
    setFilters({
      searchBy: 'all',
      status: 'all',
      dateRange: null,
      hasPrescription: 'all'
    });
    setIsSearching(false);
    isSearchingRef.current = false;
    
    onSearch('', {
      searchBy: 'all',
      status: 'all',
      dateRange: null,
      hasPrescription: 'all'
    });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getSearchIcon = () => {
    switch (filters.searchBy) {
      case 'name': return <User className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'drug_name': return <Pill className="w-4 h-4" />;
      case 'treatment_type': return <FileText className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getPlaceholder = () => {
    switch (filters.searchBy) {
      case 'name': return 'Search by patient name...';
      case 'email': return 'Search by email address...';
      case 'phone': return 'Search by phone number...';
      case 'patient_id': return 'Search by patient ID...';
      case 'drug_name': return 'Search by drug name...';
      case 'treatment_type': return 'Search by treatment type...';
      default: return placeholder;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {getSearchIcon()}
              </div>
              <input
                type="text"
                placeholder={getPlaceholder()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
              showAdvancedFilters 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          {(query || filters.searchBy !== 'all' || filters.status !== 'all' || filters.dateRange || filters.hasPrescription !== 'all') && (
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search By Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search By
                </label>
                <select
                  value={filters.searchBy}
                  onChange={(e) => handleFilterChange('searchBy', e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Fields</option>
                  <option value="name">Patient Name</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="patient_id">Patient ID</option>
                  <option value="drug_name">Drug Name</option>
                  <option value="treatment_type">Treatment Type</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      start: e.target.value
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      end: e.target.value
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Prescription Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Has Prescription
                </label>
                <select
                  value={filters.hasPrescription}
                  onChange={(e) => handleFilterChange('hasPrescription', e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All</option>
                  <option value="yes">With Prescription</option>
                  <option value="no">Without Prescription</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'pending' }))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'in_progress' }))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.status === 'in_progress' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasPrescription: 'yes' }))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.hasPrescription === 'yes' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                With Prescription
              </button>
              <button
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: {
                    start: new Date().toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  }
                }))}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
