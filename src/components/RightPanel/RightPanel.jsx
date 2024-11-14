import { useContext } from "react";
import { SearchContext } from "../../store/searchContext"; // Modifié: ne pas importer depuis SearchProvider

export default function RightPanel() {
  const { setSearchQuery } = useContext(SearchContext);

  return (
    <div className="pl-6 border-l border-slate-700 border-collapse basis-1/4">
      {/* Search button */}
      <div className="flex items-center space-x-2 mt-2">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full bg-slate-700 text-white focus:bg-transparent rounded-full px-4 py-3 ps-10 text-sm outline-none border-none focus:outline-[#1D9BF0] focus:outline-offset-0 focus:outline-1 transition-colors duration-200"
            placeholder="Chercher"
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
