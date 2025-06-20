import { Outlet } from "react-router-dom";

const SearchLayout = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-12 col-lg-3 mb-4 mb-md-0">
          <div className="bg-dark text-white p-3 rounded shadow-sm" style={{ minHeight: "300px" }}>
            <h5 className="mb-4">Filters</h5>
            {/* Placeholder for future filter options */}
            <div className="text-secondary">
              <p>Filter options coming soon...</p>
            </div>
          </div>
        </aside>
        {/* Main content */}
        <main className="col-12 col-lg-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SearchLayout;
