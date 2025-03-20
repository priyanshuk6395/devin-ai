import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import "remixicon/fonts/remixicon.css";
import axios from "../config/axios";
import Header from "../components/Header";

const Home = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize navigation
  const [modal, setModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  // Function to create a new project
  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/projects/create", { name: projectName });
      setProject((prev) => [...prev, res.data]); // Update UI immediately
      setProjectName("");
      setModal(false);
    } catch (err) {
      console.log(err);
    }
  }

  // Fetch all projects on component mount
  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => setProject(res.data.projects))
      .catch((err) => console.log(err));
  }, []);

  // Function to close modal
  function onClose() {
    setModal(false);
  }

  return (
    <div>
      <Header projectName={projectName}/>
      <main className="p-6 bg-gray-100 mt-14 dark:bg-gray-900 min-h-screen">
        {/* Projects Section */}
        <div className="projects grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Add Project Button */}
          <button
            onClick={() => setModal(true)}
            className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          >
            <i className="ri-add-box-fill text-5xl text-gray-600 dark:text-gray-300"></i>
            <span className="text-xl font-semibold dark:text-white mt-2">
              New Project
            </span>
          </button>

          {/* Project Cards */}
          {Array.isArray(project) && project.length > 0 ? (
            project.map((pro) => (
              <div
                key={pro._id}
                className="bg-white cursor-pointer dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col items-start"
              >
                {/* Project Name */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {pro.name}
                </h3>

                {/* User Count */}
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <i className="ri-user-line mr-1"></i>
                  {pro.users.length}{" "}
                  {pro.users.length === 1 ? "Member" : "Members"}
                </div>

                {/* Navigate to Project Details */}
                <button
                  onClick={() =>
                    navigate(`/project`, {
                      state: { pro },
                    })
                  }
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 text-sm"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No projects available
            </p>
          )}
        </div>

        {/* Modal for Creating a Project */}
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Create New Project
              </h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                    htmlFor="projectName"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
