import { db } from '@/utils';
import { CommentsList } from './CommentList';

const TAKE = 5;

interface CommentsProps {
  page?: number;
}

export async function Comments(props: CommentsProps) {
  const page = props.page || 1;
  const skip = page * TAKE - TAKE;

  const result = await fetchComments(skip);

  if (result.statusCode === 500) {
    return <div>{result.data.message}</div>;
  }

  return (
    <CommentsList
      comments={result.data.comments}
      hasMore={result.data.hasMore}
      page={page}
    />
  );
}

interface Comment {
  id: number;
  name: string;
  createdAt: Date;
  content: string;
}

type FetchCommentsResponse =
  | {
      statusCode: 200;
      data: {
        comments: Array<Comment>;
        hasMore: boolean;
      };
    }
  | {
      statusCode: 500;
      data: { message: string };
    };

async function fetchComments(skip: number): Promise<FetchCommentsResponse> {
  try {
    const comments = await db.comment.findMany({
      where: {
        dogId: 1,
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: TAKE + 1,
    });

    const hasMore = comments.length > TAKE;

    if (hasMore) {
      comments.pop();
    }

    return {
      statusCode: 200,
      data: {
        comments,
        hasMore,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      data: {
        message: 'Unable to fetch comments. Please refresh the page.',
      },
    };
  }
}
