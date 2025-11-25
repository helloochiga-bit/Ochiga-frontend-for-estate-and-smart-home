"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaShareAlt,
  FaImage,
  FaVideo,
  FaChartBar,
  FaPaperPlane,
} from "react-icons/fa";

// Define a proper Post type including optional fields
type Comment = { id: number; author: string; text: string };
type Post = {
  id: number;
  author: string;
  content: string;
  pinned: boolean;
  likes: number;
  liked: boolean;
  comments: Comment[];
  image?: string | null;
  video?: string | null;
  poll?: string[] | null;
};

export default function CommunityPanel() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Estate Manager",
      content:
        "Welcome to the Ochiga Community Hub 🎉 Use this space for estate updates and discussions.",
      pinned: true,
      likes: 12,
      liked: false,
      comments: [
        { id: 1, author: "Jane D.", text: "Thanks for this update!" },
        { id: 2, author: "Mark T.", text: "Glad to see this working." },
      ],
    },
    {
      id: 2,
      author: "Aisha B.",
      content: "Anyone know a reliable plumber around Phase 2?",
      pinned: false,
      likes: 3,
      liked: false,
      comments: [{ id: 1, author: "Paul", text: "Try BrightFix—they’re quick." }],
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [media, setMedia] = useState<{ image?: string | null; video?: string | null }>({});
  const [poll, setPoll] = useState<string[]>(["", ""]);
  const [showPoll, setShowPoll] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMedia({ image: URL.createObjectURL(file) });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMedia({ video: URL.createObjectURL(file) });
  };

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const makePost = () => {
    if (!newPost.trim() && !media.image && !media.video && !poll.some((p) => p.trim())) return;
    const newItem: Post = {
      id: Date.now(),
      author: "You",
      content: newPost,
      pinned: false,
      likes: 0,
      liked: false,
      comments: [],
      image: media.image || null,
      video: media.video || null,
      poll: showPoll ? poll.filter((p) => p.trim()) : null,
    };
    setPosts([newItem, ...posts]);
    setNewPost("");
    setMedia({});
    setPoll(["", ""]);
    setShowPoll(false);
  };

  return (
    <div className="mt-2 p-3 bg-gray-900/90 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-3 text-blue-400 font-semibold">💬 Community</p>

      {/* Composer */}
      <div className="p-3 bg-gray-800/70 border border-gray-700 rounded-lg mb-4 space-y-2">
        <textarea
          className="w-full bg-gray-900/70 text-gray-200 text-[13px] p-2 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
          placeholder="Share an update, ask a question..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />

        {media.image && (
          <Image
            src={media.image}
            alt="preview"
            width={500}
            height={300}
            className="rounded-md max-h-40 object-cover border border-gray-700"
          />
        )}
        {media.video && (
          <video
            src={media.video}
            controls
            className="rounded-md max-h-40 border border-gray-700"
          />
        )}

        {showPoll && (
          <div className="space-y-1">
            {poll.map((option, i) => (
              <input
                key={i}
                value={option}
                onChange={(e) => {
                  const newPoll = [...poll];
                  newPoll[i] = e.target.value;
                  setPoll(newPoll);
                }}
                placeholder={`Option ${i + 1}`}
                className="w-full bg-gray-900/70 text-gray-200 text-[13px] px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ))}
            <button
              onClick={() => setPoll([...poll, ""])}
              className="text-[12px] text-blue-400 hover:text-blue-300"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Composer Actions */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-3 text-gray-400 text-[14px]">
            <label className="cursor-pointer hover:text-blue-400 flex items-center gap-1">
              <FaImage /> <span className="hidden sm:inline">Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <label className="cursor-pointer hover:text-blue-400 flex items-center gap-1">
              <FaVideo /> <span className="hidden sm:inline">Video</span>
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
            <button
              onClick={() => setShowPoll(!showPoll)}
              className={`flex items-center gap-1 ${
                showPoll ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              <FaChartBar /> <span className="hidden sm:inline">Poll</span>
            </button>
          </div>

          <button
            onClick={makePost}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-white text-[13px] flex items-center gap-1"
          >
            <FaPaperPlane /> Post
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-3 rounded-lg ${
              post.pinned
                ? "bg-blue-950/60 border border-blue-700/40"
                : "bg-gray-800/60 border border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-medium">{post.author}</span>
              {post.pinned && (
                <span className="text-[10px] bg-blue-700/40 px-2 py-0.5 rounded-full">
                  📌 Pinned
                </span>
              )}
            </div>
            <p className="mt-1 text-gray-300 text-[13px]">{post.content}</p>

            {post.image && (
              <Image
                src={post.image}
                alt="post"
                width={500}
                height={300}
                className="mt-2 rounded-md border border-gray-700 object-cover max-h-52"
              />
            )}
            {post.video && (
              <video
                src={post.video}
                controls
                className="mt-2 rounded-md border border-gray-700 max-h-52"
              />
            )}

            {post.poll && post.poll.length > 0 && (
              <div className="mt-2 space-y-1">
                {post.poll.map((opt, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/70 border border-gray-700 px-2 py-1 rounded-md text-gray-300 text-[12px]"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 text-gray-400">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1 hover:text-red-400 transition"
              >
                {post.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-sky-400">
                <FaRegCommentDots />
                <span>{post.comments.length}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-amber-400">
                <FaShareAlt />
              </button>
            </div>

            {/* Comments */}
            <div className="mt-2 space-y-1 border-t border-gray-700/50 pt-2">
              {post.comments.map((c) => (
                <p key={c.id} className="text-gray-400 text-[12px]">
                  <span className="text-gray-300 font-medium">{c.author}: </span>
                  {c.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
