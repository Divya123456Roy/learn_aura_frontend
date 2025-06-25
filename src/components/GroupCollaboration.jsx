import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { createGroupAPI } from "../services/groupService";
import { Loader2, ImagePlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const GroupCollaboration = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    tags: "",
  });
  const { mutateAsync } = useMutation({
    mutationFn: createGroupAPI,
    mutationKey: ['create-group'],
  });
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGroupImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });
    if (groupImage) {
      payload.append("groupImage", groupImage);
    }

    try {
      const data = await mutateAsync(payload);
      setMessage(`🎉 Group "${data.groupName}" created successfully!`);
      setFormData({
        groupName: "",
        description: "",
        tags: "",
      });
      setGroupImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-4">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl bg-white p-8">
        <CardContent>
          <h2 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
            Create a Study Group
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Group Name", name: "groupName" },
                { label: "Tags (comma separated)", name: "tags" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    required={name === "groupName"}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
                  <ImagePlus className="w-5 h-5 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded object-cover border"
                  />
                )}
              </div>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="w-full md:w-1/3"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" /> Creating...
                  </span>
                ) : (
                  "Create Group"
                )}
              </Button>

              {message && (
                <p
                  className={`mt-4 w-full font-medium text-sm p-2 rounded ${
                    message.includes("successfully")
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupCollaboration;