const Search = ({search, setSearch}) => {

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div>
            search:
            <input value={search} onChange={handleSearch}></input>
        </div>
    );
};

export default Search;