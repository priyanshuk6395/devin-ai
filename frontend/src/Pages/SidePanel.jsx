import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "../config/axios";

const SidePanel = ({ loc, isOpen, onClose }) => {
  const [project, setProject] = useState(loc || {}); // Initialize with empty object
  const panelRef = useRef(null);
  const isMounted = useRef(true); // Track component mount status

  useEffect(() => {
    isMounted.current = true;

    if (loc && loc._id) {
      axios
        .get(`/projects/get-project/${loc._id}`)
        .then((res) => {
          if (isMounted.current) setProject(res.data.project);
        })
        .catch((err) => console.error("Error fetching project:", err));
    }

    return () => {
      isMounted.current = false;
    };
  }, [loc?._id]); // Ensure it fetches data when `loc._id` changes

  useEffect(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        x: isOpen ? "0%" : "-100%",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      className="fixed top-0 left-0 h-full w-72 sm:w-1/3 md:w-1/4 mt-14 bg-white dark:bg-gray-800 shadow-lg p-4 -translate-x-full"
    >
      <button onClick={onClose} className="absolute top-2 right-2 p-2">
        <i className="ri-close-line text-xl text-gray-700 dark:text-white"></i>
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Group Members
      </h2>

      {/* User Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {project?.users?.map((user) => {
          const displayName = user?.name || user?.email || "Unknown";
          const initials = displayName.charAt(0).toUpperCase();

          return (
            <div
              key={user?._id || Math.random()} // Ensure a unique key
              className="flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg p-3 shadow-md 
              transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-12 w-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {initials}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {displayName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidePanel;
