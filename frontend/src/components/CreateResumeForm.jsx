import React from "react";
import { Input } from "./Inputs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Please enter resume title");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      if (response.data?._id) {
        navigate(`/resume/${response.data?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again");
      }
    }
  };
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Create New Resume
      </h3>
      <p className="text-gray-600 mb-8">
        Give your resume a title to get started. You can customize everything later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="e.g., John Doe - Software Enginee"
          label="Resume Title"
          type="text"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button type="submit" 
        className="w-full mt-4 py-3 bg-linear-to-r from-rose-600 to-pink-600 text-white font-bold rounded-2xl 
        hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all">
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
