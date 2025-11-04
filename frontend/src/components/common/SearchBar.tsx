interface SearchBarProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
}

export default function SearchBar({ placeholder = "search", onSearch }: SearchBarProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get('search') as string;
        if (onSearch) {
        onSearch(searchValue);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-3xl">
        <input
            type="text"
            name="search"
            placeholder={placeholder}
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
        />
        <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-200 rounded-full p-1 transition"
        >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
        </form>
    );
}