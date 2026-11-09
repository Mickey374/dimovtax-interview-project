"use client";

import { format } from "date-fns";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

type Comment = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; image: string | null };
};

type ProjectCommentsProps = {
  projectId: string;
  currentUserId: string;
  isAdmin: boolean;
  initialComments: Comment[];
};

const ProjectComments = ({ projectId, currentUserId, isAdmin, initialComments }: ProjectCommentsProps) => {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createComment = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Unable to add comment");
      setComments([...comments, await response.json()]);
      setContent("");
      toast.success("Comment added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add comment");
    } finally {
      setIsSaving(false);
    }
  };

  const updateComment = async (id: string) => {
    if (!editingContent.trim()) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Unable to edit comment");
      const updated = await response.json();
      setComments(comments.map((comment) => (comment.id === id ? updated : comment)));
      setEditingId(null);
      setEditingContent("");
      toast.success("Comment updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to edit comment");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error((await response.json()).message || "Unable to delete comment");
      setComments(comments.filter((comment) => comment.id !== id));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete comment");
    }
  };

  return (
    <CardSection>
      <h2 className="text-dark100_light900 text-xl font-semibold">Activity and comments</h2>
      <div className="mt-4 space-y-4">
        {comments.length === 0 && <p className="text-muted-foreground text-sm">No comments yet.</p>}
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={comment.user.image || "/icons/avatar.svg"}
                  alt={`${comment.user.name || "Unknown user"} profile`}
                  className="rounded-full object-cover"
                  width={36}
                  height={36}
                />
                <div>
                  <p className="font-medium">{comment.user.name || "Unknown user"}</p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(comment.createdAt), "MMM dd, yyyy h:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {comment.userId === currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Edit comment"
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingContent(comment.content);
                    }}
                  >
                    <Pencil />
                  </Button>
                )}
                {(comment.userId === currentUserId || isAdmin) && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Delete comment"
                    onClick={() => void deleteComment(comment.id)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            </div>
            {editingId === comment.id ? (
              <div className="mt-3 space-y-2">
                <Textarea value={editingContent} onChange={(event) => setEditingContent(event.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" disabled={isSaving} onClick={() => void updateComment(comment.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm whitespace-pre-wrap">{comment.content}</p>
            )}
          </article>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
        />
        <Button disabled={isSaving || !content.trim()} onClick={() => void createComment()}>
          <Send />
          Post comment
        </Button>
      </div>
    </CardSection>
  );
};

const CardSection = ({ children }: { children: React.ReactNode }) => (
  <section className="background-light850_dark100 mt-6 max-w-3xl rounded-xl border p-6">{children}</section>
);

export default ProjectComments;
