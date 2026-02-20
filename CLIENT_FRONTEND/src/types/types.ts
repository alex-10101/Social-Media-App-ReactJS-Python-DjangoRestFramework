/**
 * The properties of a User
 */
export interface IUser {
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: string;
  is_active: boolean;
  date_joined: string;
  email: string;
  coverPicture: string;
  profilePicture: string;
  city: string;
  website: string;
}

/**
 * The properties of a relationship
 */
export interface IRelationship {
  id: number;
  followerUser: number;
  followedUser: number;
  createdAt: string;
}

/**
 * The properties of a post
 */
export interface IPost {
  id: number;
  postDescription: string;
  img: string;
  createdAt: string;
  user: number;
  author: {
    id: number;
    username: string;
    profilePicture: string;
  };
  commentsCount: number;
}

/**
 * The properties of a like
 */
export interface ILike {
  id: number;
  user: number;
  post: number;
  createdAt: string;
}

/**
 * The properties of a comment
 */
export interface IComment {
  id: number;
  commentDescription: string;
  post: number;
  createdAt: string;
  user: number;
  author: {
    id: number;
    username: string;
    profilePicture: string;
  };
}

/**
 * The properties of a paginated response.
 * These properties are returned by the server.
 * The result is of the generic type T.
 * For example, T can be type IPost: PaginatedResponse<IPost>
 * or type IComments: PaginatedResponse<IComments>.
 */
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
