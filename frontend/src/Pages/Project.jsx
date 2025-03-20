import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SidePanel from "./SidePanel";
import axios from "../config/axios";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
} from "../config/socket";
import { UserContext } from "../context/user.context";
import { marked } from "marked";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getWebContainer } from "../config/webcontainer";
import Header from "../components/Header";

const Project = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [isSidePanel, setIsSidePanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [currFile, setCurrFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [editableContent, setEditableContent] = useState("");
  const [webContainer, setWebContainer] = useState(null);
  const [runProcess, setRunProcess] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [project, setProject] = useState(null);

  // Create ref for scrolling to bottom of chat
  const messageBoxRef = useRef(null);

  useEffect(() => {
    initializeSocket(location.state.pro._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
      });
    }

    // Listen for incoming messages
    receiveMessage("project-message", (data) => {
      if (data.sender === "ai") {
        const message = JSON.parse(data.message);

        if (message.fileTree) {
          setFileTree(message.fileTree);
          webContainer?.mount(message.fileTree);
        }
      }

      setMessages((prevMessages) => [...prevMessages, data]);
    });

    axios.get("/projects/get-project/${location.state.pro._id}").then((res) => {
      setProject(res.data.project);
      setFileTree(res.data.fileTree);
    });

    // Fetch users
    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currFile && fileTree[currFile]?.file?.contents) {
      setEditableContent(fileTree[currFile].file.contents);
    } else {
      setEditableContent("");
    }
  }, [currFile, fileTree]);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAddCollaborators = () => {
    axios
      .put("/projects/add-user", {
        projectId: location.state.pro._id,
        users: selectedUsers,
      })
      .then(() => {
        setSelectedUsers([]);
        setIsModalOpen(false);
      })
      .catch((err) => console.error("Error adding users:", err));
  };

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"));
  }

  function sendChat() {
    if (!message.trim()) return;

    const newMessage = {
      message,
      sender: user._id,
    };

    sendMessage("project-message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]); // Add to state
    setMessage(""); // Clear input after sending
  }

  function WriteAIMessage(message) {
    const msg = JSON.parse(message);
    return marked(msg.text);
  }

  // Get the appropriate language for syntax highlighting
  const getLanguage = (filename) => {
    if (!filename) return "javascript";

    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "js":
        return "javascript";
      case "jsx":
        return "jsx";
      case "ts":
        return "typescript";
      case "tsx":
        return "tsx";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "py":
        return "python";
      case "md":
        return "markdown";
      default:
        return "javascript";
    }
  };

  const handleEditorChange = (e) => {
    const newContent = e.target.value;
    setEditableContent(newContent);

    // Update the file tree
    setFileTree((prev) => ({
      ...prev,
      [currFile]: {
        ...prev[currFile],
        file: {
          ...prev[currFile]?.file,
          contents: newContent,
        },
      },
    }));
    saveFileTree(fileTree);
  };

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: location.state?.pro?._id,
        fileTree: ft,
      })
      .then((res) => {
        
      })
      .catch((err) => {
        console.log("errors: ", err);
      });
  }

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Chat Section */}
      <section>
        <Header projectName={project?.name} />
      </section>

      <section className="left overflow-auto flex flex-col h-[calc(100vh-4rem)] w-full md:w-1/3 bg-gray-200 dark:bg-gray-800 border-r border-gray-300 mt-16 dark:border-gray-700">
        <header className="flex justify-between items-center p-3 px-4 w-full bg-white dark:bg-gray-900 shadow-sm">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm transition-all duration-300"
          >
            <i className="ri-add-fill text-lg"></i>
            <span className="text-sm">Add Collaborator</span>
          </button>

          <button
            onClick={() => setIsSidePanel(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <i className="ri-group-fill text-2xl text-gray-700 dark:text-gray-300"></i>
          </button>
        </header>

        {/* Messages Area */}
        <div className="conversation-area flex-grow flex flex-col overflow-hidden">
          <div
            ref={messageBoxRef}
            className="message-box flex-grow flex flex-col gap-3 p-4 overflow-y-auto"
          >
            {messages.map(({ sender, message }, index) => (
              <div
                key={index}
                className={`message ${
                  sender === "ai"
                    ? "bg-white dark:bg-gray-700 max-w-[90%]"
                    : sender === user._id
                    ? "ml-auto bg-blue-500 text-white max-w-[90%]"
                    : "bg-green-500 text-white max-w-[90%]"
                } p-3 rounded-lg shadow-sm transition-all duration-300`}
              >
                {sender === "ai" && (
                  <small className="opacity-64 dark:text-white text-xs">
                    AI
                  </small>
                )}
                {sender != "ai" && sender != user._id && (
                  <small className="opacity-64 dark:text-white text-xs">
                    {sender}
                  </small>
                )}
                <p
                  className="text-sm dark:text-white message overflow-auto"
                  dangerouslySetInnerHTML={{
                    __html: sender === "ai" ? WriteAIMessage(message) : message,
                  }}
                ></p>
                {sender === "ai" && (
                  <button
                    onClick={() => copyToClipboard(message)}
                    className="mt-2 px-2 py-1 text-xs dark:text-white bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                    Copy Markdown
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="input-field w-full flex p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <input
              className="w-full px-4 py-2 rounded-l-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendChat()}
            />
            <button
              onClick={sendChat}
              className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-300"
            >
              <i className="ri-send-plane-fill text-xl"></i>
            </button>
          </div>
        </div>
      </section>

      <SidePanel 
        loc={location.state.pro}
        isOpen={isSidePanel}
        onClose={() => setIsSidePanel(false)}
      />

      {/* Right Workspace Section */}
      <section className="right flex-grow w-full mt-14 flex flex-col md:flex-row bg-white dark:bg-gray-900">
        {/* File Explorer */}
        <div className="explorer h-48 md:h-full w-full md:w-64 border-b md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="file-tree p-2">
            {Object.keys(fileTree).map((file, index) => (
              <button
                onClick={() => {
                  setCurrFile(file);
                  setOpenFiles((prev) =>
                    prev.includes(file) ? prev : [...prev, file]
                  );
                }}
                key={index}
                className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-300 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <i className="ri-file-text-line"></i>
                <span className="truncate">{file}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="code-editor flex flex-col flex-grow min-w-0">
          {/* Editor Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto">
              {openFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-300 ${
                    file === currFile
                      ? "bg-gray-100 dark:bg-gray-900 text-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setCurrFile(file)}
                >
                  <span className="mr-2 truncate max-w-[120px]">{file}</span>
                  <button
                    className="hover:text-red-500 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFiles((prev) => prev.filter((f) => f !== file));
                      if (file === currFile) {
                        setCurrFile(
                          openFiles.filter((f) => f !== file)[0] || null
                        );
                      }
                    }}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={async () => {
                if (!webContainer) {
                  console.error("WebContainer is not initialized.");
                  return;
                }
                await webContainer.mount(fileTree);

                const installProcess = await webContainer.spawn("npm", [
                  "install",
                ]);

                installProcess.output.pipeTo(
                  new WritableStream({
                    write(chunk) {
                      
                    },
                  })
                );

                if (runProcess) {
                  runProcess.kill();
                }

                let tempRunProcess = await webContainer.spawn("npm", ["start"]);

                tempRunProcess.output.pipeTo(
                  new WritableStream({
                    write(chunk) {
                      
                    },
                  })
                );

                setRunProcess(tempRunProcess);

                webContainer.on("server-ready", (port, url) => {
                  
                  setIframeUrl(url);
                });
              }}
              className="m-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-300"
            >
              Run
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex flex-grow min-h-0">
            <div className="editor-container flex flex-grow">
              <div className="line-numbers p-4 text-right text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                {editableContent.split("\n").map((_, i) => (
                  <div key={i} className="font-mono text-sm">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="code-editor-wrapper relative flex-grow">
                {/* Editable Textarea */}
                <textarea
                  value={editableContent}
                  onChange={handleEditorChange}
                  className="absolute top-0 left-0 w-full h-full p-4 font-mono text-transparent bg-transparent caret-white outline-none resize-none z-10"
                  spellCheck="false"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                />

                {/* Syntax Highlighting Overlay */}
                <div className="syntax-highlighter-container absolute top-0 left-0 w-full h-full overflow-auto">
                  <SyntaxHighlighter
                    language={getLanguage(currFile)}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      height: "100%",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: "monospace",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        display: "block",
                        minHeight: "100%",
                      },
                    }}
                    lineNumberStyle={{
                      minWidth: "3em",
                      paddingRight: "1em",
                      color: "#666",
                      userSelect: "none",
                    }}
                    showLineNumbers
                  >
                    {editableContent}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {iframeUrl && webContainer && (
          <div className="preview-panel w-full md:w-1/3 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                className="w-full px-3 py-1 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <iframe src={iframeUrl} className="flex-grow bg-white " />
          </div>
        )}
      </section>

      {/* Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Users
            </h2>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ul className="mt-4 space-y-2 max-h-80 overflow-auto">
              {users
                .filter((user) =>
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <li
                    key={user._id}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 
                      ${
                        selectedUsers.includes(user._id)
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    onClick={() => toggleUserSelection(user._id)}
                  >
                    <div className="dark:text-white">
                      <p className="font-medium">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user._id) && (
                      <i className="ri-check-line text-lg"></i>
                    )}
                  </li>
                ))}
            </ul>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddCollaborators}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Add Collaborator
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUsers([]);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
