import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, X } from 'lucide-react';

export default function SearchBar({ onSearch, initialKeyword = '', initialLocation = '', initialCategory = '', categories = [] }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, location, category });
  };

  const handleClear = () => {
    setKeyword('');
    setLocation('');
    setCategory('');
    onSearch({ keyword: '', location: '', category: '' });
  };

  const hasFilters = keyword || location || category;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 gap-3"
    >
      {/* Keyword Search Input */}
      <div className="md:col-span-4 relative flex items-center bg-slate-50 rounded-xl px-3.5 py-3 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
        <Search className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, skills, or company..."
          className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400 font-sans"
        />
        {keyword && (
          <button type="button" onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Location Search Input */}
      <div className="md:col-span-3 relative flex items-center bg-slate-50 rounded-xl px-3.5 py-3 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
        <MapPin className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State, or Remote"
          className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400 font-sans"
        />
      </div>

      {/* Category Dropdown */}
      <div className="md:col-span-3 relative flex items-center bg-slate-50 rounded-xl px-3.5 py-3 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
        <Briefcase className="w-5 h-5 text-emerald-600 mr-2.5 shrink-0" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id || cat.slug} value={cat.id || cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 flex items-center gap-2">
        <button
          type="submit"
          className="w-full h-full min-h-[46px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors shrink-0"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
