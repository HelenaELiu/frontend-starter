import { Authing, Events } from "./app";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friending";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/posting";
import { VideoDoc } from "./concepts/videos";
import { EventDoc } from "./concepts/events";
import { OrganizationDoc } from "./concepts/organizations";
import { InviteDoc } from "./concepts/inviting";
import { Router } from "./framework/router";
import { ObjectId } from "mongodb";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await Authing.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await Authing.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert VideoDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async video(video: VideoDoc | null) {
    if (!video) {
      return video;
    }
    const author = await Authing.getUserById(video.author);
    return { ...video, author: author.username };
  }

  /**
   * Same as {@link video} but for an array of VideoDoc for improved performance.
   */
  static async videos(videos: VideoDoc[]) {
    const authors = await Authing.idsToUsernames(videos.map((video) => video.author));
    return videos.map((video, i) => ({ ...video, author: authors[i] }));
  }

  /**
   * Convert EventDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async event(event: EventDoc | null) {
    if (!event) {
      return event;
    }
    const author = await Authing.getUserById(event.author);
    return { ...event, author: author.username };
  }

  /**
   * Same as {@link event} but for an array of EventDoc for improved performance.
   */
  static async events(events: EventDoc[]) {
    const authors = await Authing.idsToUsernames(events.map((event) => event.author));
    return events.map((event, i) => ({ ...event, author: authors[i] }));
  }

  /**
   * Convert OrganizationDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async org(org: OrganizationDoc | null) {
    if (!org) {
      return org;
    }
    const author = await Authing.getUserById(org.author);
    return { ...org, author: author.username };
  }

  /**
   * Same as {@link org} but for an array of OrganizationDoc for improved performance.
   */
  static async orgs(orgs: OrganizationDoc[]) {
    const authors = await Authing.idsToUsernames(orgs.map((org) => org.author));
    return orgs.map((org, i) => ({ ...org, author: authors[i] }));
  }

  /**
   * Convert InviteDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async invite(invite: InviteDoc | null) {
    if (!invite) {
      return invite;
    }
    const from = await Authing.getUserById(invite.from);
    const to = await Authing.getUserById(invite.to);
    const event = await Events.getById(invite.event);
    return { ...invite, from: from.username, to: to.username, event: event.name };
  }

  /**
   * Same as {@link invite} but for an array of InviteDoc for improved performance.
   */
  static async invites(invites: InviteDoc[]) {
    const froms = await Authing.idsToUsernames(invites.map((invite) => invite.from));
    const tos = await Authing.idsToUsernames(invites.map((invite) => invite.to));
    const events = await Events.idsToNames(invites.map((invite) => invite.event));
    return invites.map((invite, i) => ({ ...invite, from: froms[i], to: tos[i], event: events[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await Authing.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
