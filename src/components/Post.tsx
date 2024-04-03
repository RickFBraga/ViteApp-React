import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Comment } from "./Comment.tsx";
import styles from "./Post.module.css";
import { FormEvent, InvalidEvent, useState } from "react";


interface Author {
  name: string,
  role: string,
  avatarUrl: string
}

interface Content {
  type: 'paragraph' | 'link',
  content: string,
}

export interface PostProps {
  author: Author,
  publishedAt: Date,
  content: Content [],
}


export function Post({ author, publishedAt, content }:PostProps) {
  const [comments, setComments] = useState(["Post muito bacana, hein?!"]);

  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(
   publishedAt,
    "d 'de' LLLL 'às' HH:mm'h' ",
    {
      locale: ptBR,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreatNewComment(event : FormEvent) {
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText("");
  }


  function handleNewCommentInvalid(event : InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório!')  }

  function deleteComment(commentsToDelete : string) {
    const commentsWithoutDeletedOne = comments.filter((comments) => {
      return comments != commentsToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <img title="image" className={styles.avatar} src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line) => {
          if (line.type == "paragraph") {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type == "link") {
            return (
              <p key={line.content}>
                <a href="#">{line.content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreatNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          name="comments"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type="submit">Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              deleteComment={deleteComment}
            />
          )
        })}
      </div>
    </article>
  );
}
