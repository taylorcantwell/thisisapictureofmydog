'use server';

import { db } from '@/utils';
import { z } from 'zod';

const commentSchema = z
  .object({
    dogId: z.number().optional(),
    content: z.string().trim().min(1).max(500),
    avatarId: z.string().trim().min(1).max(100).optional(),
    name: z.string().trim().min(1).max(100),
  })
  .strict();

export async function submitCommentAction(
  _prevState: unknown,
  formData: FormData
) {
  // Todo: use proper values
  const data = {
    content: formData.get('content'),
    name: formData.get('name'),
    dogId: 1,
  };

  const parsedFormData = commentSchema.safeParse(data);

  if (!parsedFormData.success) {
    return {
      statusCode: 400,
      errors: parsedFormData.error.flatten().fieldErrors,
    };
  }

  try {
    await db.comment.create({
      data: {
        content: parsedFormData.data.content,
        dogId: 1,
        name: parsedFormData.data.name,
      },
    });

    return {
      statusCode: 200,
      data: {
        message: 'success',
      },
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      data: {
        message: 'Unable to submit comment. Please try again later.',
      },
    };
  }
}
