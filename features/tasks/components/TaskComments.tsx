"use client";

import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { MessageSquare, Send } from "lucide-react";
import * as Yup from "yup";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useMembers } from "@/features/members/hooks/useMembers";
import { formatRelativeTime } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentFormValues {
  content: string;
}

const commentValidationSchema = Yup.object().shape({
  content: Yup.string()
    .trim()
    .min(2, "Comment must be at least 2 characters")
    .max(500, "Comment cannot exceed 500 characters")
    .required("Comment cannot be empty"),
});

interface TaskCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export function TaskComments({ comments, onAddComment }: TaskCommentsProps) {
  const { getMemberById } = useMembers();
  const { canAddComment } = usePermissions();

  const handlePostComment = (
    values: CommentFormValues,
    { resetForm, setSubmitting }: FormikHelpers<CommentFormValues>
  ) => {
    onAddComment(values.content.trim());
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Discussion ({comments.length})</span>
      </div>

      {/* Existing Comments Thread */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="py-2 text-xs italic text-slate-400 dark:text-slate-500">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => {
            const author = getMemberById(comment.authorId);
            const authorName = author ? author.name : "Team Member";

            return (
              <div
                key={comment.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/80 dark:bg-slate-900/40"
              >
                <Avatar name={authorName} size="sm" src={author?.avatar} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {authorName}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Comment Input */}
      {canAddComment ? (
        <Formik
          initialValues={{ content: "" }}
          validationSchema={commentValidationSchema}
          onSubmit={handlePostComment}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form className="space-y-2">
              <Textarea
                name="content"
                placeholder="Write a reply or status update..."
                rows={2}
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.content && errors.content ? errors.content : undefined
                }
                className="text-xs"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!values.content.trim() || isSubmitting}
                  isLoading={isSubmitting}
                  className="h-8 text-xs"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Post Reply
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <p className="text-xs italic text-slate-400 dark:text-slate-500">
          View-only mode: comment creation is disabled.
        </p>
      )}
    </div>
  );
}
