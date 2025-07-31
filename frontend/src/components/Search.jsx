import "./Form.css";

const Search = ({search, setSearch}) => {

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className={"input-box"}>
            Search:
            <input 
            value={search} 
            onChange={handleSearch}
            className={"input-field"}
            placeholder={"Search..."}>

            </input>
        </div>
    );
};

export default Search;