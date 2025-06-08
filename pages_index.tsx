import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Upload, Download, Filter, Calendar, Users, DollarSign, TrendingUp, ArrowLeft, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import _ from 'lodash';

const TravelDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedSections, setSelectedSections] = useState([]);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for demonstration
  const sampleData = [
    { Section: 'Operations', 'Personnel Name': 'SGT Johnson', Destination: 'Fort Bragg', 'Travel Date': '2024-03-15', 'Projected Cost': 1200, 'Actual Cost': 1150 },
    { Section: 'Operations', 'Personnel Name': 'CPT Smith', Destination: 'Pentagon', 'Travel Date': '2024-03-20', 'Projected Cost': 800, 'Actual Cost': 850 },
    { Section: 'Intelligence', 'Personnel Name': 'MAJ Davis', Destination: 'Langley', 'Travel Date': '2024-02-10', 'Projected Cost': 1500, 'Actual Cost': 1450 },
    { Section: 'Intelligence', 'Personnel Name': 'SSG Wilson', Destination: 'Fort Gordon', 'Travel Date': '2024-04-05', 'Projected Cost': 900, 'Actual Cost': null },
    { Section: 'Logistics', 'Personnel Name': 'SFC Brown', Destination: 'Fort Lee', 'Travel Date': '2024-01-25', 'Projected Cost': 600, 'Actual Cost': 620 },
    { Section: 'Logistics', 'Personnel Name': 'PFC Garcia', Destination: 'Joint Base Lewis', 'Travel Date': '2024-05-12', 'Projected Cost': 1100, 'Actual Cost': null },
    { Section: 'Communications', 'Personnel Name': 'TSG Miller', Destination: 'Fort Huachuca', 'Travel Date': '2024-02-28', 'Projected Cost': 750, 'Actual Cost': 780 },
    { Section: 'Medical', 'Personnel Name': 'CPT Anderson', Destination: 'Walter Reed', 'Travel Date': '2024-03-08', 'Projected Cost': 400, 'Actual Cost': 380 }
  ];

  useEffect(() => {
    if (data.length === 0) {
      setData(sampleData);
      setFilteredData(sampleData);
    }
  }, []);

  useEffect(() => {
    filterData();
  }, [data, dateRange, selectedSections, timePeriod]);

  const filterData = () => {
    let filtered = [...data];

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(row => {
        const travelDate = new Date(row['Travel Date']);
        return travelDate >= new Date(dateRange.start) && travelDate <= new Date(dateRange.end);
      });
    }

    // Section filter
    if (selectedSections.length > 0) {
      filtered = filtered.filter(row => selectedSections.includes(row.Section));
    }

    setFilteredData(filtered);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsLoading(true);
    
    try {
      let allData = [];
      
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        allData = [...allData, ...jsonData];
      }
      
      setData(allData);
      setFilteredData(allData);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing Excel files. Please check file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Travel Data');
    XLSX.writeFile(wb, `travel_data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const aggregatedData = useMemo(() => {
    const grouped = _.groupBy(filteredData, 'Section');
    return Object.entries(grouped).map(([section, records]) => ({
      section,
      totalProjected: _.sumBy(records, 'Projected Cost'),
      totalActual: _.sumBy(records, row => row['Actual Cost'] || 0),
      count: records.length,
      variance: _.sumBy(records, row => (row['Actual Cost'] || row['Projected Cost']) - row['Projected Cost'])
    }));
  }, [filteredData]);

  const timeSeriesData = useMemo(() => {
    const grouped = _.groupBy(filteredData, row => {
      const date = new Date(row['Travel Date']);
      switch (timePeriod) {
        case 'yearly':
          return date.getFullYear();
        case 'quarterly':
          return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
        default:
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
    });

    return Object.entries(grouped).map(([period, records]) => ({
      period,
      projected: _.sumBy(records, 'Projected Cost'),
      actual: _.sumBy(records, row => row['Actual Cost'] || 0)
    })).sort((a, b) => a.period.localeCompare(b.period));
  }, [filteredData, timePeriod]);

  const pieChartData = aggregatedData.map(item => ({
    name: item.section,
    value: item.totalProjected
  }));

  const uniqueSections = [...new Set(data.map(row => row.Section))];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const sectionDetails = selectedSection ? 
    filteredData.filter(row => row.Section === selectedSection) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">USCYBERCOM J7 Travel Cost Dashboard</h1>
            <p className="text-gray-400">Track and analyze travel costs across staff sections</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J7</span>
            </div>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        {selectedSection && (
          <div className="mb-6 flex items-center text-blue-400">
            <button 
              onClick={() => setSelectedSection(null)}
              className="flex items-center hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </button>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-white">{selectedSection} Details</span>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Excel Files</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Upload Excel'}
                </div>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="flex-1 px-2 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="flex-1 px-2 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Export */}
            <div>
              <label className="block text-sm font-medium mb-2">Actions</label>
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>

          {/* Section Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Filter by Sections</label>
            <div className="flex flex-wrap gap-2">
              {uniqueSections.map(section => (
                <button
                  key={section}
                  onClick={() => {
                    if (selectedSections.includes(section)) {
                      setSelectedSections(selectedSections.filter(s => s !== section));
                    } else {
                      setSelectedSections([...selectedSections, section]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSections.includes(section)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {section}
                </button>
              ))}
              {selectedSections.length > 0 && (
                <button
                  onClick={() => setSelectedSections([])}
                  className="px-3 py-1 rounded-full text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {!selectedSection ? (
          // Main Dashboard View
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Records</p>
                    <p className="text-2xl font-bold text-white">{filteredData.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projected</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${_.sumBy(filteredData, 'Projected Cost').toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Actual</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ${_.sumBy(filteredData, row => row['Actual Cost'] || 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Sections</p>
                    <p className="text-2xl font-bold text-purple-400">{uniqueSections.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Section Costs Bar Chart */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Costs by Section</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aggregatedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="section" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}