const Filters = ({
  search,
  handleSearch,
  category,
  setCategory,
  categories,
  toggleAlphaSort,
  toggleDateSort,
  sortMode
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        className="border px-3 py-2 w-48"
        placeholder="Search…"
        onChange={e => handleSearch(e.target.value)}
        defaultValue={search}
      />

      <select
        className="border px-3 py-2"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="All">All</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button onClick={toggleAlphaSort} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">
        {sortMode === 'alpha-desc' ? '(Z-A)' : '(A-Z)'}
      </button>
      <button onClick={toggleDateSort} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">
        {sortMode === 'date-desc' ? '(Newest)' : '(Oldest)'}
      </button>
    </div>
  );
};

export default Filters;
