'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Input } from '@/ui/input';
import {
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationUI,
} from '@/ui/pagination';
import { Textarea } from '@/ui/textarea';
import { UserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useRef } from 'react';
import { useFormState } from 'react-dom';
import { submitCommentAction } from './submitCommentAction';

type CommentsProps = {
  comments: Array<Comment>;
  hasMore: boolean;
  page: number;
};

export function CommentsList(props: CommentsProps) {
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Array<Comment>,
    Comment
  >(props.comments, (state, comment) => [comment, ...state]);

  return (
    <div>
      {optimisticComments.length > 0 && (
        <>
          <List optimisticComments={optimisticComments} />
          <Pagination hasMore={props.hasMore} />
        </>
      )}

      <Form
        currentPage={props.page}
        addOptimisticComment={addOptimisticComment}
      />
    </div>
  );
}

interface Comment {
  id: number;
  name: string;
  createdAt: Date;
  content: string;
}

type CommentProps = Omit<Comment, 'id'>;

function Comment(props: CommentProps) {
  return (
    <div className="flex items-start gap-4 w-full">
      <Avatar className="h-10 w-10">
        <AvatarImage alt={props.name} src="/placeholder-avatar.jpg" />

        <AvatarFallback>{props.name[0]}</AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="font-medium">{props.name}</div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            2 days ago
          </div>
        </div>

        <p>{props.content}</p>
      </div>
    </div>
  );
}

interface ListProps {
  optimisticComments: Array<Comment>;
}

function List(props: ListProps) {
  return (
    <div className="flex flex-col gap-4 max-h-[300px] overflow-auto border border-teal-200 p-3 rounded-sm shadow-sm">
      {props.optimisticComments.map((comment) => (
        <Comment
          key={comment.id}
          name={comment.name}
          createdAt={comment.createdAt}
          content={comment.content}
        />
      ))}
    </div>
  );
}

// Todo: avatar dropdown feature
const AVATARS = [
  {
    id: 1,
    avatarUrl: 'lol',
  },
];

interface CommentListItem extends Comment {
  id: number;
  createdAt: Date;
  avatarId: number;
  dogId: number;
}

interface FormProps {
  addOptimisticComment: (action: CommentListItem) => void;
  currentPage: number;
}

export function Form(props: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitCommentAction, {
    errors: {},
    statusCode: 0,
  });

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        // TODO: add client side validation and/or use react hook form

        const name = formData.get('name') as string | null;
        const content = formData.get('content') as string | null;

        if (props.currentPage === 1 && name && content) {
          props.addOptimisticComment({
            id: Math.random() * 1000,
            name,
            content,
            // Todo: use proper values
            createdAt: new Date(),
            dogId: 1,
            avatarId: 1,
          });
        }

        formAction(formData);
        formRef.current?.reset();
      }}
      className="border border-teal-200 p-3 rounded-sm"
    >
      <div className="flex items-start gap-4">
        <AvatarDropdownMenu items={AVATARS} />
        {state.errors?.avatarId?.[0] && (
          <FieldError error={state.errors.avatarId[0]} />
        )}

        <div className="flex-1 space-y-2">
          <Input name="name" placeholder="Name" />
          {state.errors?.name?.[0] && (
            <FieldError error={state.errors.name[0]} />
          )}

          <Textarea
            name="content"
            className="min-h-[100px]"
            placeholder="Write your comment..."
            maxLength={200}
          />
          {state.errors?.content?.[0] && (
            <FieldError error={state.errors.content[0]} />
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400">
          Submit
        </Button>
      </div>
    </form>
  );
}

interface FieldErrorProps {
  error: string;
}

function FieldError(props: FieldErrorProps) {
  return <div className="text-red-500 text-sm">{props.error}</div>;
}

interface PaginationProps {
  hasMore: boolean;
}

function Pagination(props: PaginationProps) {
  const router = useRouter();
  const params = useSearchParams();

  const page = params.get('page') ? parseInt(params.get('page') as string) : 1;
  const prevPage = page - 1;
  const nextPage = page + 1;
  const isOnFirstPage = page === 1;

  const setNextPage = () => {
    router.push(`?page=${nextPage}`);
    router.refresh();
  };

  const setPreviousPage = () => {
    router.push(`?page=${prevPage}`);
    router.refresh();
  };

  return (
    <PaginationUI className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={isOnFirstPage}
            onClick={setPreviousPage}
          />
        </PaginationItem>

        {page !== 1 && (
          <PaginationItem>
            <PaginationButton
              disabled={isOnFirstPage}
              onClick={setPreviousPage}
            >
              {prevPage}
            </PaginationButton>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationButton isActive>{page}</PaginationButton>
        </PaginationItem>

        <PaginationItem>
          <PaginationButton disabled={!props.hasMore} onClick={setNextPage}>
            {nextPage}
          </PaginationButton>
        </PaginationItem>

        {props.hasMore && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext disabled={!props.hasMore} onClick={setNextPage} />
        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
}

// Todo: finish avatar dropdown feature
interface AvatarDropdownMenuProps {
  items: Array<ItemProps>;
}

function AvatarDropdownMenu(props: AvatarDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10">
          <AvatarImage alt="avatar" src="" />

          <AvatarFallback>
            <UserIcon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {props.items.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ItemProps {
  id: number;
  avatarUrl: string;
}

function Item(props: ItemProps) {
  return (
    <DropdownMenuItem>
      <Avatar className="h-8 w-8">
        <AvatarImage alt="avatar" src={props.avatarUrl} />

        <AvatarFallback>
          <UserIcon className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    </DropdownMenuItem>
  );
}
