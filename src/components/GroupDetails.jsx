import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../services/groupService";
import { Card, CardContent } from "./Card";
import { Loader2, Users, Book, Tag } from "lucide-react";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id);
        setGroup(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load group data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <span className="ml-2">Loading group...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center mt-6">{error}</p>;
  }

  if (!group) return null;

  return (
    <Card className="max-w-4xl mx-auto mt-10 p-6 shadow-xl rounded-2xl bg-white">
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={group.groupImage}
            alt={group.groupName}
            className="w-40 h-40 object-cover rounded-xl border"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{group.groupName}</h2>
            <p className="text-gray-600">{group.description}</p>

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <strong>Settings:</strong> {group.settings}
              </p>
              <p className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <strong>Course ID:</strong> {group.courseId}
              </p>
              <p className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <strong>Forum ID:</strong> {group.forumId}
              </p>
              {group.tags && (
                <p className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <strong>Tags:</strong>{" "}
                  <span className="text-sm text-gray-500">{group.tags}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDetails;
